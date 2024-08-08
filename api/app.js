import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
const upload = multer({ dest: 'uploads/' });
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer'
import fs from 'fs'
import dotenv from 'dotenv'
import url from 'url'
import crypto from 'crypto'
// imported functions from external scripts for database queries
import { addProductPricing, addProductToCart, createBoatSetupTable, createCart, createHomePageProduct, createProduct, createThinkTank, createUser, createUserWithGoogle, deleteAllCartItems, deleteAllThinkTankDocs, deleteCartItems, deleteHomePageProductDocs, deletePricings, deleteProduct, findCartByToken, findProductByImageFileName, findUserByEmail, findUserByUsername, findUserByVerificationToken, getAllHomePageProducts, getBoatSetupWithUserId, getCartItem, getCartItemWithProductId, getPricingsForProduct, getProduct, getProducts, getProductsInCart, getThinkTankContent, updateTable } from './database.js';
// imported function for checking out with Stripe
import { createCheckoutSession } from './checkout.js'
// imported function for using webhooks with Stripe as well as getting the sessions storage
import { webhook, sessionsStore } from './webhook.js'
// imported functions for sending emails
import { sendEmail, sendResetPasswordEmail, sendVerificationEmail } from './mailer.js'

// Load environment variables from a .env file into process.env
dotenv.config();

// Read and parse the JSON file containing the list of permissions
const admins = JSON.parse(fs.readFileSync(new URL('./permission-list.json', import.meta.url), 'utf8'));

// Create an instance of an Express application
const app = express();

// Use the cookie-parser middleware to parse cookies attached to client requests
app.use(cookieParser());

// Generate a salt for hashing passwords using bcrypt, with a salt round of 10
const bcryptSalt = bcrypt.genSaltSync(10);

// Retrieve the secret key for JWT from environment variables
const jwtSecret = process.env.JWT_SECRET;

// Use the express.json() middleware to parse incoming JSON requests
// and store the raw body in req.rawBody for later use
app.use(express.json({
    verify: (req, res, buffer) => req['rawBody'] = buffer,
}));

// Serve static files from the 'uploads' directory at the '/uploads' route
app.use('/uploads', express.static('uploads'));

// Configure CORS (Cross-Origin Resource Sharing) settings
app.use(cors({
    // Allow credentials (such as cookies) to be sent with requests
    credentials: true,
    // Define a custom origin checker function
    origin: (origin, callback) => {
        // List of allowed origins
        let allowedOrigins = ['http://localhost:5173', 'http://10.0.0.180:5173', 'http://10.0.0.180:3000', 'https://test.ideasthatfloat.com', 'https://ideasthatfloat-server-lnr7.onrender.com'];
        // If the origin is allowed or there is no origin (e.g., requests without CORS), allow it
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Otherwise, block the request and return an error
            callback(new Error('Not allowed by CORS'));
        }
    }
}));


// Define a POST endpoint at '/register' for handling user registration
app.post('/register', async (req, res) => {
    // Extract user details from the request body
    const { name, username, email, password, googleUser } = req.body;

    try {
        // Check if the user is registering with Google authentication
        if (googleUser) {
            // Create a new user using Google authentication details
            const userDoc = await createUserWithGoogle(name, email, true);
            // Respond with the newly created user document and a 201 status code for successful creation
            res.status(201).json(userDoc);
        } else {
            // If not a Google user, generate a unique verification token for email verification
            const verificationToken = crypto.randomBytes(20).toString('hex');

            // Hash the password using bcrypt and create a new user with the provided details
            await createUser(name, email, bcrypt.hashSync(password, bcryptSalt), verificationToken);

            // Send a verification email to the user with the generated token
            await sendVerificationEmail(email, verificationToken);

            // Respond with a success message and a 201 status code for successful registration
            res.status(201).json('User Registered');
        }
    } catch (err) {
        // If an error occurs, respond with a 422 status code and include the error details
        res.status(422).json(err);
    }
});


// Define a GET endpoint at '/verify-email/:token' for handling email verification
app.get('/verify-email/:token', async (req, res) => {
    // Extract the verification token from the URL parameters
    const { token } = req.params;

    try {
        // Find a user document in the database using the provided verification token
        const userDoc = await findUserByVerificationToken(token);

        // Check if a user document was found
        if (!userDoc) {
            // If no user is found or the token is invalid/expired, respond with a 422 status and an error message
            res.status(422).json('Invalid or expired verification token');
        } else {
            // If the user document is found, mark the user's email as confirmed
            userDoc.confirmed = true;
            // Remove the verification token from the user document
            userDoc.verificationToken = undefined;
            // Update the user document in the database
            await updateTable('users', userDoc);
            // Respond with a success message indicating successful email verification
            res.json('Email verified successfully');
        }
    } catch (err) {
        // If an error occurs during the process, respond with a 500 status and include the error details
        res.status(500).json(err);
    }
});


// Define a POST endpoint at '/login' for handling user login
app.post('/login', async (req, res) => {
    // Extract user details from the request body
    const { username, email, password, googleUser } = req.body;

    try {
        // Find a user document in the database by username
        const userDoc = await findUserByUsername(username);

        // Check if the user document was found
        if (!userDoc) {
            // If no user is found, respond with a 422 status and an error message
            res.status(422).json({ message: 'user not found' });
        } else if (!userDoc.confirmed && !googleUser) {
            // If the user's email is not confirmed and the login is not through Google, respond with a 420 status and an error message
            res.status(420).json({ message: 'Email not verified' });
        } else {
            // Check if the password is correct or if the user is logging in with Google
            const passOk = googleUser || (userDoc.password && bcrypt.compareSync(password, userDoc.password));

            if (passOk) {
                // If the password is correct or the user is a Google user, sign a JWT token with user information
                jwt.sign({
                    username: userDoc.username,
                    id: userDoc.id
                }, jwtSecret, {}, async (err, token) => {
                    if (err) throw err;

                    // Set the JWT token as a cookie in the response with security settings
                    res.cookie('userToken', token, { domain: 'ideasthatfloat-server-lnr7.onrender.com', secure: true, sameSite: 'none' });

                    // Check if there is a cart token in the cookies
                    const cartToken = req.cookies.cartToken;
                    if (cartToken) {
                        // Find the cart document by the cart token
                        const cartDoc = await findCartByToken(cartToken);
                        if (cartDoc) {
                            // Associate the cart with the logged-in user
                            cartDoc.userId = userDoc.id;
                            // Update the cart document in the database
                            await updateTable('cart', cartDoc);
                        }
                    }

                    // Respond with the user document upon successful login
                    res.json(userDoc);
                });
            } else if (userDoc.password === null) {
                // If the user has no password and is not logging in through Google, respond with a 401 status and an error message
                res.status(401).json({ message: 'Please log in through Google' });
            } else {
                // If the password is incorrect, respond with a 422 status and an error message
                res.status(422).json('incorrect password');
            }
        }
    } catch (err) {
        // If an error occurs during the process, respond with a 500 status and include the error stack
        res.status(500).json(err.stack);
    }
});

// Define a GET endpoint at '/verify-token' for verifying the user's JWT token
app.get('/verify-token', async (req, res) => {
    // Retrieve the JWT token from the cookies
    const userToken = req.cookies.userToken;

    // Check if the token is not provided
    if (!userToken) {
        // If no token is present, respond with a 401 status and an error message
        return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the JWT token using the secret key
    jwt.verify(userToken, jwtSecret, (err, decoded) => {
        // Check if there was an error during token verification
        if (err) {
            // If the token is invalid, respond with a 401 status and an error message
            return res.status(401).json({ error: 'Invalid token' });
        }

        // If the token is valid, respond with the decoded user information
        // This includes the username, user ID, and cart information
        res.json({ username: decoded.username, id: decoded.id, cart: decoded.cart });
    });
});


// Define a POST endpoint at '/logout' for handling user logout
app.post('/logout', (req, res) => {
    // Clear the 'userToken' cookie from the client's browser
    // This effectively logs the user out by removing the authentication token
    res.clearCookie('userToken', { domain: 'ideasthatfloat-server-lnr7.onrender.com', secure: true, sameSite: 'none' });

    // Respond with a 200 status code and a success message indicating that the logout was successful
    res.status(200).send({ message: 'logged out successfully' });
});


// Define a POST endpoint at '/add-product' for adding a new product
// Use the 'upload.fields' middleware to handle file uploads with fields 'imageThumbnail' and 'imageDetails'
app.post('/add-product', upload.fields([{ name: 'imageThumbnail', maxCount: 1 }, { name: 'imageDetails', maxCount: 1 }]), async (req, res) => {
    // Parse the 'newProductVariablePricing' field from JSON format
    req.body.newProductVariablePricing = JSON.parse(req.body.newProductVariablePricing);

    // Extract product details from the request body
    const { newProductName, newProductPartNumber, newProductDescription, newProductVariablePricing } = req.body;
    // Retrieve uploaded files from the request
    const files = req.files;

    try {
        // Check if a product with the same image file name already exists
        const existingProduct = await findProductByImageFileName(files.imageThumbnail[0].originalname);
        if (existingProduct) {
            // If a product with the same image file name exists, throw an error
            throw new Error('Duplicate image file name');
        }

        // Initialize variable to hold details image if available
        let detailsImage;
        if (files && files.imageDetails && files.imageDetails[0]) {
            detailsImage = files.imageDetails;
        }

        // Create a new product with the provided details and images
        const product = await createProduct(newProductName, newProductPartNumber, newProductDescription, files.imageThumbnail, detailsImage);
        // Extract the product ID
        const productId = product.id;

        // Initialize an array to hold pricing details
        let pricing = [];
        // Loop through each variable pricing entry and add it to the product
        for (let i = 0; i < newProductVariablePricing.length; i++) {
            const result = await addProductPricing(newProductVariablePricing[i], productId);
            pricing.push(result);
        }

        // Respond with a 201 status code and the newly created product and pricing details
        res.status(201).json({ product, pricing });
    } catch (err) {
        // Log the error stack for debugging purposes
        console.log(err.stack);
        // Respond with a 500 status code and the error details
        res.status(500).json(err);
    }
});


// Define a GET endpoint at '/get-products' for retrieving a list of products
app.get('/get-products', async (req, res) => {
    try {
        // Fetch all products from the database or data source
        const products = await getProducts();
        // Respond with the list of products in JSON format
        res.json(products);
    } catch (err) {
        // If an error occurs during the retrieval process, respond with a 500 status code
        // and include the error stack for debugging
        res.status(500).json(err.stack);
    }
});



// Define a DELETE endpoint at '/delete-product/:id' for removing a product by its ID
app.delete('/delete-product/:id', async (req, res) => {
    // Extract the product ID from the URL parameters
    const { id } = req.params;

    try {
        // Find the product in the database by its ID
        const product = await getProduct(id);
        // Check if the product exists
        if (!product) {
            // If the product is not found, respond with a 404 status and an error message
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the product is currently in any user's cart
        const isProductInCart = await getCartItemWithProductId(id);
        if (isProductInCart) {
            // If the product is referenced in a cart, throw an error with a specific code
            const err = new Error('Product is referenced in cart');
            err.code = 'ER_ROW_IS_REFERENCED_2';
            throw err;
        }

        // Delete all pricing information associated with the product
        await deletePricings(id);
        // Delete the product from the database
        await deleteProduct(id);

        // Respond with a success message indicating that the product was deleted
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        // Handle errors during the deletion process
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            // Respond with a 409 status code if the product is referenced elsewhere (e.g., in a cart)
            res.status(409).json({ error: 'The product you are attempting to delete is being referenced somewhere else' });
        } else {
            // Log the error for debugging and respond with a 500 status code for general errors
            console.error(err);
            res.status(500).json({ error: 'An error occurred' });
        }
    }
});


// Define a GET endpoint at '/product/:id' for retrieving a product and its associated pricing details by ID
app.get('/product/:id', async (req, res) => {
    // Extract the product ID from the URL parameters
    const { id } = req.params;

    try {
        // Retrieve the product document from the database by its ID
        const productDoc = await getProduct(id);
        // Retrieve the pricing details associated with the product
        const prices = await getPricingsForProduct(id);

        // Check if both the product and pricing details were found
        if (productDoc && prices) {
            // Respond with the product document and its pricing details in JSON format
            res.json({ productDoc, prices });
        } else {
            // If either the product or pricing details are not found, respond with a 404 status and an error message
            res.status(404).send('product not found');
        }
    } catch (err) {
        // If an error occurs during retrieval, respond with a 422 status code and the error details
        res.status(422).json(err);
    }
});


// Define a PATCH endpoint at '/product/:id' for updating a product by its ID
// Use the 'upload.fields' middleware to handle file uploads with fields 'imageThumbnail' and 'imageDetails'
app.patch('/product/:id', upload.fields([{ name: 'imageThumbnail', maxCount: 1 }, { name: 'imageDetails', maxCount: 1 }]), async (req, res) => {

    // Extract the product ID from the URL parameters
    const { id } = req.params;
    // Parse the 'variablePricing' field from JSON format
    req.body.variablePricing = JSON.parse(req.body.variablePricing);
    // Extract updated product details and pricing from the request body
    const { productName, productPartNumber, productDescription, variablePricing } = req.body;
    // Retrieve uploaded files from the request
    const files = req.files;

    try {
        // Create a product document object with the updated details
        const productDoc = {
            id: id,
            name: productName,
            partNumber: productPartNumber,
            description: productDescription,
        }

        // Check if an image thumbnail file was uploaded
        if (files && files.imageThumbnail && files.imageThumbnail[0]) {
            // Add thumbnail image details to the product document
            productDoc.thumbnailImageId = files.imageThumbnail[0].filename;
            productDoc.thumbnailImageFileName = files.imageThumbnail[0].originalname;
        }

        // Check if a detailed image file was uploaded
        if (files && files.imageDetails && files.imageDetails[0]) {
            // Add details image to the product document
            productDoc.detailsImageId = files.imageDetails[0].filename;
            productDoc.detailsImageFileName = files.imageDetails[0].originalname;
        }

        // Update the product details in the database
        await updateTable('products', productDoc);

        // Delete existing pricing information for the product
        await deletePricings(id);
        // Initialize an array to hold the new pricing details
        let newPricing = [];
        // Loop through each pricing entry and add it to the product
        for (let price of variablePricing) {
            // Add new pricing and accumulate the results
            const newPrice = await addProductPricing(price, id);
            newPricing.push(newPrice);
        }

        // Respond with a 200 status code and the updated product details and new pricing
        res.status(200).json({ productDoc, newPricing });
    } catch (err) {
        // Log the error stack for debugging purposes
        console.log(err.stack);
        // Respond with a 500 status code and the error details if an error occurs
        res.status(500).json(err);
    }
});


app.post('/sign-guest-token', async (req, res) => {
    try {
        // Check if a valid cartToken was sent in the request
        const existingToken = req.cookies.cartToken;
        // Verify the existing token
        if (existingToken) {
            // If the token is valid, return it
            return res.status(200).json(existingToken);
        }

        // If no valid token was sent, sign a new one
        jwt.sign({
            guest: true
        }, jwtSecret, {}, async (err, token) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.cookie('cartToken', token, { domain: 'ideasthatfloat-server-lnr7.onrender.com', secure: true, sameSite: 'none' })

            // Check if a cart already exists for this token
            let cartDoc = await findCartByToken(token);

            // If no cart exists, create a new one
            if (!cartDoc) {
                cartDoc = await createCart(undefined, token)
            }

            res.status(200).json(token);
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});


// Define a POST endpoint at '/sign-theme-token' for generating and signing a theme token
app.post('/sign-theme-token', async (req, res) => {
    try {
        // Generate a JWT token with the theme information (e.g., dark mode setting)
        jwt.sign({
            darkMode: false  // Example theme setting
        }, jwtSecret, {}, async (err, token) => {
            if (err) {
                // If there's an error signing the token, respond with a 500 status code and error message
                return res.status(500).json({ message: err.message });
            }
            // Set the generated token as a cookie with domain, secure, and sameSite attributes
            res.cookie('themeToken', token, { domain: 'ideasthatfloat-server-lnr7.onrender.com', secure: true, sameSite: 'none' });
            // Respond with the token and a 200 status code
            res.status(200).json(token);
        });
    } catch (err) {
        // Catch any other errors and respond with a 500 status code and error message
        res.status(500).json({ message: err.message });
    }
});


// Define a GET endpoint at '/verify-theme-token' for verifying the theme token
app.get('/verify-theme-token', async (req, res) => {
    // Extract the theme token from cookies
    const themeToken = req.cookies.themeToken;

    // Check if the token is not present
    if (!themeToken) {
        // Respond with a 401 status code if no token is provided
        return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the token using the JWT secret
    jwt.verify(themeToken, jwtSecret, (err, decoded) => {
        // Handle errors during token verification
        if (err) {
            // Respond with a 401 status code if the token is invalid
            return res.status(401).json({ error: 'Invalid token' });
        }
        // Respond with the decoded payload, specifically the darkMode setting
        res.json({ darkMode: decoded.darkMode });
    });
});


// Define a POST endpoint at '/update-theme-token' for updating the theme token
app.post('/update-theme-token', async (req, res) => {
    try {
        // Extract the 'darkMode' setting from the request body
        const { darkMode } = req.body;

        // Generate a new JWT token with the updated 'darkMode' setting
        jwt.sign({
            darkMode: darkMode  // Include the updated theme setting in the token payload
        }, jwtSecret, {}, async (err, token) => {
            if (err) {
                // If there's an error signing the token, respond with a 500 status code and error message
                return res.status(500).json({ message: err.message });
            }

            // Set the new token as a cookie with domain, secure, and sameSite attributes
            res.cookie('themeToken', token, { domain: 'ideasthatfloat-server-lnr7.onrender.com', secure: true, sameSite: 'none' });
            // Respond with the new token and a 200 status code
            res.status(200).json(token);
        });
    } catch (err) {
        // Catch any other errors and respond with a 500 status code and error message
        res.status(500).json({ message: err.message });
    }
});



// Define a POST endpoint at '/add-product-to-cart/:id' for adding a product to a cart by product ID
app.post('/add-product-to-cart/:id', async (req, res) => {
    // Extract the product ID from the URL parameters
    const { id } = req.params;
    // Extract the quantity to be added from the request body
    const { quantity } = req.body;
    // Retrieve the cart token from cookies
    const { cartToken } = req.cookies;

    try {
        // Find the product by its ID
        const product = await getProduct(id);
        if (product) {
            // If the product is found, find the cart document by the cart token
            let cartDoc = await findCartByToken(cartToken);
            if (cartDoc) {
                // If the cart is found, add the product to the cart
                await addProductToCart(product, quantity, cartToken);
                // Respond with the updated cart document
                res.json(cartDoc);
            } else {
                // If the cart is not found, respond with a 404 status code and an error message
                res.status(404).json({ message: 'Cart not found' });
            }
        } else {
            // If the product is not found, respond with a 404 status code and an error message
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        // Catch and respond with a 422 status code and the error details if an error occurs
        res.status(422).json(err);
    }
});



// Define a GET endpoint at '/user-cart' for retrieving the user's cart and its products
app.get('/user-cart', async (req, res) => {
    // Extract the cart token from cookies
    const cartToken = req.cookies.cartToken;

    try {
        // Find the cart document using the cart token
        const cartDoc = await findCartByToken(cartToken);
        // Retrieve all products in the cart based on the cart document's ID
        const cartProducts = await getProductsInCart(cartDoc.id);
        // Check if the cart products were found
        if (!cartProducts) {
            // Respond with a 422 status code if the cart was not found
            res.status(422).json('cart not found');
        } else {
            // Initialize arrays to store product and pricing information
            let products = [];
            let pricings = [];

            // Loop through each product in the cart
            for (let i = 0; i < cartProducts.length; i++) {
                // Retrieve product details using the product ID
                const product = await getProduct(cartProducts[i].productId);
                // Retrieve pricing information for the product
                const pricing = await getPricingsForProduct(product.id);
                // Add product and pricing to their respective arrays
                products.push(product);
                pricings.push(pricing);
            }

            // Respond with the cart document, cart products, products, and pricing information
            res.json({ cartDoc, cartProducts, products, pricings });
        }
    } catch (err) {
        console.log(err)
        // Catch any errors and respond with a 422 status code and error details
        res.status(422).json(err);
    }
});



// Define a POST endpoint at '/cart-products' for retrieving a specific product from the cart
app.post('/cart-products', async (req, res) => {
    // Extract 'cart' and 'productIndex' from the request body
    const { cart, productIndex } = req.body;

    try {
        // Extract the product ID from the cart using the specified product index
        const productId = cart.products[productIndex].product;
        // Retrieve the product details using the product ID
        const productDoc = await getProduct(productId);
        // Respond with the product details
        res.json(productDoc);
    } catch (err) {
        // Catch any errors and respond with a 422 status code and error details
        res.status(422).json(err);
    }
});


// Define a POST endpoint at '/delete-cart-item' for removing an item from the cart
app.post('/delete-cart-item', async (req, res) => {
    // Extract the cart token from cookies
    const cartToken = req.cookies.cartToken;
    // Extract cart products, product ID, count of items to be removed, and the index of the product to be removed from the request body
    const { cartProducts, productId, count, index } = req.body;

    try {
        // Find the cart document using the cart token
        const cartDoc = await findCartByToken(cartToken);
        if (!cartDoc) {
            // Respond with a 404 status code if the cart is not found
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Update the total product count in the cart document by subtracting the count of items to be removed
        cartDoc.productCountTotal -= count;
        // Update the cart document in the database
        await updateTable('cart', cartDoc);

        // Delete the specific cart items based on the cart ID and product ID
        await deleteCartItems(cartDoc.id, productId);

        // Create a new array of cart products with the item at the specified index removed
        let newCartProducts = cartProducts;
        newCartProducts.splice(index, 1);

        // Respond with the updated cart document and the new list of cart products
        res.status(200).json({ cartDoc, newCartProducts });

    } catch (err) {
        // Log the error and respond with a 422 status code and error details if an error occurs
        console.log(err.stack);
        res.status(422).json(err);
    }
});


// Define a POST endpoint at '/send-email' for sending an email based on the provided information
app.post('/send-email', async (req, res) => {
    try {
        // Extract name, phone number, email, and message from the request body
        const { name, phoneNum, email, message } = req.body;

        // Initialize variable to hold the email body
        let body;

        // Construct the email body based on whether a phone number is provided
        if (phoneNum) {
            body = `
            Name: ${name}
            Email: ${email}
            Phone Number: ${phoneNum}
            Message: ${message}`;
        } else {
            body = `
            Name: ${name}
            Email: ${email}
            Message: ${message}`;
        }

        // Use the sendEmail function to send an email to a specified address with the constructed body
        // --->>>URGENT: CHANGE EMAIL HERE TO COMPANY EMAIL
        await sendEmail('tc915004@outlook.com', `New message from ${name}`, body);

        // Respond with a 200 status code and a success message if the email is sent successfully
        res.status(200).json({ message: 'Email sent' });
    } catch (err) {
        // Respond with a 500 status code and an error message if the email fails to send
        res.status(500).json({ message: 'Email failed to send' });
    }
});


// Define a POST endpoint at '/check-admin' to check if a user is an admin
app.post('/check-admin', (req, res) => {
    // Extract the username from the request body
    const { username } = req.body;

    // Iterate over the list of admin usernames
    for (let i = 0; i < admins.admins.length; i++) {
        // Check if the extracted username matches any of the admin usernames
        if (username === admins.admins[i].username) {
            // Respond with 'admin' if the username is found in the admin list
            res.json('admin');
            return;
        }
    }
    // Respond with 'user' if the username is not found in the admin list
    res.json('user');
});


// Define a POST endpoint at '/reset-password-email' for initiating a password reset process
app.post('/reset-password-email', async (req, res) => {
    try {
        // Extract the email from the request body
        const { email } = req.body;

        // Find the user document by the provided email
        const userDoc = await findUserByEmail(email);

        // Check if the user document exists
        if (!userDoc) {
            // Respond with a 422 status code if the user is not found
            res.status(422).json('User not found');
        } else {
            // Generate a unique token for resetting the password
            const resetPasswordToken = crypto.randomBytes(20).toString('hex');

            // Send a password reset email with the generated token
            await sendResetPasswordEmail(email, resetPasswordToken);
        }
    } catch (err) {
        // Respond with a 500 status code and an error message if an exception occurs
        res.status(500).json({ message: err.message });
    }
});


// Define a POST endpoint at '/reset-password/:username' to reset a user's password
app.post('/reset-password/:username', async (req, res) => {
    try {
        // Extract the username from the URL parameters
        const { username } = req.params;
        // Extract the new password from the request body
        const { password } = req.body;

        // Find the user document by the provided username
        const userDoc = await findUserByUsername(username);

        // Check if the user document exists
        if (!userDoc) {
            // Respond with a 422 status code if the user is not found
            res.status(422).json('User not found');
        } else {
            // Hash the new password using bcrypt with a predefined salt
            userDoc.password = bcrypt.hashSync(password, bcryptSalt);

            // Update the user's document in the database with the new hashed password
            await updateTable('users', userDoc);

            // Respond with a success message indicating that the password has been reset
            res.json('Password reset');
        }
    } catch (err) {
        // Respond with a 422 status code and an error message if an exception occurs
        res.status(422).json('error occured');
    }
});


// Define a POST endpoint at '/save-think-tank-edit' to handle think tank edits and uploads
app.post('/save-think-tank-edit', upload.fields([{ name: 'thinkTankImage', maxCount: 1 }]), async (req, res) => {
    try {
        // Extract the think tank text from the request body
        const { thinkTankText } = req.body;
        // Extract the uploaded think tank image from the request files
        const thinkTankImage = req.files.thinkTankImage;

        // Delete all existing think tank documents from the database before saving the new info
        // You can also just change the original think tanks docs instead of deleting
        await deleteAllThinkTankDocs();

        // Extract the filename and original name of the uploaded image
        const imageId = thinkTankImage[0].filename;
        const imageFileName = thinkTankImage[0].originalname;

        // Create a new think tank document with the provided text and image details
        const thinkTankDoc = await createThinkTank(thinkTankText, imageId, imageFileName);

        // Respond with the newly created think tank document
        res.json(thinkTankDoc);
    } catch (err) {
        // Respond with a 422 status code and the error message if an exception occurs
        res.status(422).json({ message: err.message });
    }
});



// Define a GET endpoint at '/get-think-tank-content' to retrieve think tank content
app.get('/get-think-tank-content', async (req, res) => {
    try {
        // Fetch the think tank content from the database
        const inTheLabDoc = await getThinkTankContent();

        // Respond with the retrieved content and a 200 status code
        res.status(200).json(inTheLabDoc);
    } catch (err) {
        // Respond with a 500 status code and the error message if an exception occurs
        res.status(500).json({ message: err.message });
    }
});


// Define a GET endpoint at '/user-info/:username' to retrieve user information by username
app.get('/user-info/:username', async (req, res) => {
    // Extract the username from the URL parameters
    const { username } = req.params;

    try {
        // Fetch the user document from the database using the provided username
        const userDoc = await findUserByUsername(username);

        // Check if the user document was found
        if (!userDoc) {
            // Respond with a 422 status code if the user is not found
            res.status(422).json('User not found');
        } else {
            // Respond with the user document and a 200 status code if the user is found
            res.status(200).json(userDoc);
        }
    } catch (err) {
        // Respond with a 500 status code and the error message if an exception occurs
        res.status(500).json(err);
    }
});


// Define a POST endpoint at '/save-user-changes/:username' to handle user information updates
app.post('/save-user-changes/:username', async (req, res) => {
    // Extract the email and password from the request body
    const { email, password } = req.body;
    // Extract the username from the URL parameters
    const { username } = req.params;

    try {
        // Fetch the user document from the database using the provided username
        const userDoc = await findUserByUsername(username);
        let usernameChange = false;
        let passwordChange = false;

        // Check if the user document was found
        if (!userDoc) {
            // Respond with a 422 status code if the user is not found
            res.status(422).json('User not found');
            return; // Exit the function early if the user is not found
        }

        // Check if the email has changed
        if (userDoc.email !== email) {
            // Check if the new email is already associated with another user
            const duplicateUser = await findUserByEmail(email);
            if (duplicateUser) {
                // Respond with a 420 status code if the email is a duplicate
                res.status(420).json('Duplicate email');
                return; // Exit the function early if there is a duplicate email
            }

            // Mark that the username has changed
            usernameChange = true;

            // Generate a verification token for the email change
            const verificationToken = crypto.randomBytes(20).toString('hex');

            // Update user document with the new email, new username, and verification token
            userDoc.email = email;
            userDoc.username = email.split('@')[0]; // Use the part before '@' as the new username
            userDoc.confirmed = false; // Set confirmation status to false
            userDoc.verificationToken = verificationToken; // Add verification token

            // Send a verification email to the new address
            await sendVerificationEmail(email, verificationToken);
        }

        // Check if a new password is provided
        if (password && password !== '') {
            // Hash the new password and update the user document
            userDoc.password = bcrypt.hashSync(password, bcryptSalt);
            passwordChange = true;
        }

        // Update the user document in the database
        await updateTable('users', userDoc);
        // Respond with a 200 status code and information about what was changed
        res.status(200).json({ usernameChange, passwordChange });

    } catch (err) {
        // Respond with a 500 status code and the error message if an exception occurs
        res.status(500).json(err);
    }
});


// Define a POST endpoint at '/save-products-section' to handle saving product section details
app.post('/save-products-section', async (req, res) => {
    // Extract product page names, descriptions, and products from the request body
    const { productsPageNames, productsPageDescriptions, productsSectionProducts } = req.body;

    try {
        // Delete existing home page product documents from the database
        await deleteHomePageProductDocs();

        let products = [];

        // Iterate through each product page name
        for (let i = 0; i < productsPageNames.length; i++) {
            // Create a new home page product document with the corresponding name, description, and product details
            const homePageProduct = await createHomePageProduct(
                productsPageNames[i],
                productsPageDescriptions[i],
                productsSectionProducts[i]
            );

            // Add the newly created product to the products array
            products.push(homePageProduct);
        }

        // Respond with a 200 status code and the list of newly created products
        res.status(200).json(products);

    } catch (err) {
        // Respond with a 500 status code and the error message if an exception occurs
        res.status(500).json(err);
    }
});


// Define a GET endpoint at '/showcase-products' to retrieve showcase products from the database
app.get('/showcase-products', async (req, res) => {
    try {
        // Fetch all home page product documents from the database
        const showcaseProductDocs = await getAllHomePageProducts();

        // Check if any products were retrieved
        if (!showcaseProductDocs) {
            // If no products are found, respond with a 422 status code and a message indicating no products
            res.status(422).json('No showcase products in database');
        } else {
            // If products are found, respond with a 200 status code and the list of products
            res.status(200).json(showcaseProductDocs);
        }
    } catch (err) {
        // If an error occurs, respond with a 500 status code and the error message
        res.status(500).json(err);
    }
});


// Define a POST endpoint at '/save-boat-setup' for saving boat setup data
app.post('/save-boat-setup', async (req, res) => {
    try {
        // Extract boat setup data from the request body
        const setupData = req.body;

        // Check if there is already a boat setup saved for the given user ID
        const boatSetupAlreadySaved = await getBoatSetupWithUserId(setupData.userId);

        // If a boat setup already exists for the user
        if (boatSetupAlreadySaved) {
            // Create a new object with the existing ID and the updated setup data
            const newData = {
                id: boatSetupAlreadySaved.id,
                ...setupData
            };

            // Update the existing boat setup record in the database with the new data
            await updateTable('boatCalculator', newData);

            // Respond with a 200 status code and a message indicating that the boat setup was saved
            res.status(200).json('Boat setup saved');
        } else {
            // If no boat setup exists for the user, create a new boat setup record
            const savedBoatSetup = await createBoatSetupTable(setupData);

            // Respond with a 201 status code and the newly created boat setup
            res.status(201).json(savedBoatSetup);
        }
    } catch (err) {
        // Log the error stack trace and respond with a 500 status code and the error message
        console.log(err.stack);
        res.status(500).json(err.stack);
    }
});


// Define a GET endpoint at '/boat-setup/:userId' for retrieving boat setup data for a specific user
app.get('/boat-setup/:userId', async (req, res) => {
    try {
        // Extract the user ID from the URL parameters
        const { userId } = req.params;

        // Retrieve the boat setup document associated with the given user ID
        const boatSetupDoc = await getBoatSetupWithUserId(userId);

        // Respond with a 200 status code and the boat setup document
        res.status(200).json(boatSetupDoc);
    } catch (err) {
        // Log the error stack trace
        console.log(err.stack);

        // Respond with a 500 status code and the error stack trace if an exception occurs
        res.status(500).json(err.stack);
    }
});


// Define a POST endpoint at '/checkout-cart' for initiating the checkout process
app.post('/checkout-cart', createCheckoutSession);


// Define a POST endpoint at '/delete-cart-items' for deleting all items from the user's cart
app.post('/delete-cart-items', async (req, res) => {
    try {
        // Retrieve the cart token from cookies
        const cartToken = req.cookies.cartToken;

        // Find the cart document using the cart token
        const cartDoc = await findCartByToken(cartToken);

        // Delete all items from the cart based on the cart ID
        await deleteAllCartItems(cartDoc.id);

        // Reset the total product count to zero
        cartDoc.productCountTotal = 0;

        // Update the cart document in the database
        await updateTable('cart', cartDoc);

        // Respond to the client with a success message
        res.status(200).json('Cart items deleted');
    } catch (err) {
        // Log the error stack trace for debugging
        console.log(err.stack);

        // Respond to the client with an error message
        res.status(500).json('Error occurred when trying to delete cart items');
    }
});

// POST request utilized on Stripe's end to use webhooks for listening to events like checkout successes, payment successes, etc.
app.post('/webhook', webhook)

// Define a GET endpoint at '/:sessionId' to retrieve session information
app.get('/:sessionId', (req, res) => {
    try {
        // Extract the session ID from the URL parameters
        const { sessionId } = req.params;

        // Access the session data from the sessions store
        const session = sessionsStore[sessionId];

        // Check if the session exists
        if (session) {
            // Respond with the session data if found
            res.status(200).json(session);
        } else {
            // Respond with a 404 error if the session is not found
            res.status(404).send('Session not found');
        }
    } catch (err) {
        // Log the error stack trace for debugging
        console.log(err.stack);

        // Respond with a 500 error if an exception occurs
        res.status(500).json({ error: err.message });
    }
});


// Define a DELETE endpoint at '/delete-all-showcase-products' to remove all showcase products
app.delete('/delete-all-showcase-products', async (req, res) => {
    try {
        // Call the function to delete all showcase product documents
        await deleteHomePageProductDocs();

        // Respond with a success message if deletion is successful
        res.status(200).json('Deleted showcase products');
    } catch (err) {
        // Log the error stack trace for debugging
        console.log(err.stack);

        // Respond with a 500 status code and the error message if an exception occurs
        res.status(500).json({ error: err });
    }
});


// Define the port on which the server will listen. Defaults to 4000 if not specified in environment variables.
const port = process.env.PORT || 4000;

// Start the server and listen on the specified port and address ('0.0.0.0' makes it accessible from all network interfaces)
app.listen(port, '0.0.0.0', () => {
    // Log a message to the console when the server starts successfully
    console.log(`Server is running on port ${port}`);
});


