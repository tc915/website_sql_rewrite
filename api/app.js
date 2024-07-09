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
import { addProductPricing, addProductToCart, createBoatSetupTable, createCart, createHomePageProduct, createProduct, createThinkTank, createUser, createUserWithGoogle, deleteAllThinkTankDocs, deleteCartItems, deleteHomePageProductDocs, deletePricings, deleteProduct, findCartByToken, findProductByImageFileName, findUserByEmail, findUserByUsername, findUserByVerificationToken, getAllHomePageProducts, getBoatSetupWithUserId, getPricingsForProduct, getProduct, getProducts, getProdutsInCart, getThinkTankContent, updateTable } from './database.js';
dotenv.config();

const admins = JSON.parse(fs.readFileSync(new URL('./permission-list.json', import.meta.url), 'utf8'));


const app = express();
app.use(cookieParser());

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        let allowedOrigins = ['http://localhost:5173', 'http://10.0.0.180:5173', 'http://10.0.0.180:3000', 'https://test.ideasthatfloat.com', 'https://ideasthatfloat-server-lnr7.onrender.com'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.post('/register', async (req, res) => {
    const { name, username, email, password, googleUser } = req.body;
    try {
        if (googleUser) {
            const userDoc = await createUserWithGoogle(name, email, true)
            res.status(201).json(userDoc)
        } else {
            const verificationToken = crypto.randomBytes(20).toString('hex');

            await createUser(name, email, bcrypt.hashSync(password, bcryptSalt), verificationToken)

            let mailOptions = {
                from: 'tc915004@outlook.com',
                to: email,
                subject: 'Email Verification',
                text: `Hello ${name}, \n\nPlease verify your account by clicking this link:\nhttps://test.ideasthatfloat.com/register/verify-email/${verificationToken}\n\nThank You!`
            }

            let transporter = nodemailer.createTransport({
                service: 'Outlook365',
                auth: {
                    user: 'tc915004@outlook.com',
                    pass: 'Tc1038668!278'
                }
            });

            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: 'Error occurred' })
                } else {
                    console.log('Verification email sent');
                    res.status(200).json({ message: 'Verification email sent' })
                }
            });
            res.status(201).json('User Registered')
        }
    } catch (err) {
        res.status(422).json(err);
    }
});

app.get('/verify-email/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const userDoc = await findUserByVerificationToken(token);
        if (!userDoc) {
            res.status(422).json('Invalid or expired verification token');
        } else {
            userDoc.confirmed = true;
            userDoc.verificationToken = undefined;
            await updateTable('users', userDoc)
            res.json('Email verified successfully');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/login', async (req, res) => {
    const { username, email, password, googleUser } = req.body;
    try {
        const userDoc = await findUserByUsername(username);
        console.log(userDoc)
        if (!userDoc) {
            res.status(422).json({ message: 'user not found' });
        } else if (!userDoc.confirmed && !googleUser) {
            res.status(420).json({ message: 'Email not verified' })
        } else {
            const passOk = googleUser || (userDoc.password && bcrypt.compareSync(password, userDoc.password));
            console.log(passOk)
            if (passOk) {
                jwt.sign({
                    username: userDoc.username,
                    id: userDoc.id
                }, jwtSecret, {}, async (err, token) => {
                    if (err) throw err;
                    res.cookie('userToken', token, { domain: 'ideasthatfloat-server-lnr7.onrender.com', secure: true, sameSite: 'none' });

                    // If there is a cart token, save it to the user
                    const cartToken = req.cookies.cartToken;
                    if (cartToken) {
                        const cartDoc = await findCartByToken(cartToken);
                        if (cartDoc) {
                            cartDoc.userId = userDoc.id
                            await updateTable('cart', cartDoc)
                        }
                    }

                    res.json(userDoc);
                })
            } else {
                res.status(422).json('incorrect password')
            }
        }
    } catch (err) {
        res.status(500).json(err.stack)
    }
});



app.get('/verify-token', async (req, res) => {
    const userToken = req.cookies.userToken;
    if (!userToken) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(userToken, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.json({ username: decoded.username, id: decoded.id, cart: decoded.cart });
    })
});

app.post('/logout', (req, res) => {
    res.clearCookie('userToken', { domain: 'ideasthatfloat-server-lnr7.onrender.com', secure: true, sameSite: 'none' });
    res.status(200).send({ message: 'logged out successfully' })
});

app.post('/add-product', upload.fields([{ name: 'imageThumbnail', maxCount: 1 }, { name: 'imageDetails', maxCount: 1 }]), async (req, res) => {
    req.body.newProductVariablePricing = JSON.parse(req.body.newProductVariablePricing);
    const { newProductName, newProductPartNumber, newProductDescription, newProductVariablePricing } = req.body;
    const files = req.files;

    try {
        // Check if a product with the same imageFileName already exists
        const existingProduct = await findProductByImageFileName(files.imageThumbnail[0].originalname)
        if (existingProduct) {
            throw new Error('Duplicate image file name');
        }

        let detailsImage;
        if (files && files.imageDetails && files.imageDetails[0]) {
            detailsImage = files.imageDetails;
        }

        const product = await createProduct(newProductName, newProductPartNumber, newProductDescription, files.imageThumbnail, detailsImage)
        const productId = product.id
        let pricing = []
        for (let i = 0; i < newProductVariablePricing.length; i++) {
            const result = await addProductPricing(newProductVariablePricing[i], productId)
            pricing.push(result)
        }
        res.status(201).json({ product, pricing })
    } catch (err) {
        console.log(err.stack);
        res.status(500).json(err);
    }
});



app.get('/get-products', async (req, res) => {
    try {
        const products = await getProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json(err.stack)
    }
});


app.delete('/delete-product/:id', async (req, res) => {
    const { id } = req.params; // Get the product ID from the URL parameters
    try {
        // Find the product by ID
        const product = await getProduct(id)
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete the pricings and product from the database
        await deletePricings(id);
        await deleteProduct(id);


        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(409).json({ error: 'The product you are attempting to delete is being referenced somwhere else' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'An error occurred' });
        }
    }
});

app.get('/product/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const productDoc = await getProduct(id);
        const prices = await getPricingsForProduct(id);
        if (productDoc && prices) {
            res.json({ productDoc, prices });
        } else {
            res.status(404).send('product not found')
        }
    } catch (err) {
        res.json(422).json(err);
    }
});

app.patch('/product/:id', upload.fields([{ name: 'imageThumbnail', maxCount: 1 }, { name: 'imageDetails', maxCount: 1 }]), async (req, res) => {

    const { id } = req.params;
    req.body.variablePricing = JSON.parse(req.body.variablePricing);
    const { productName, productPartNumber, productDescription, variablePricing } = req.body;
    const files = req.files;

    try {
        const productDoc = {
            id: id,
            name: productName,
            partNumber: productPartNumber,
            description: productDescription,
        }

        if (files && files.imageThumbnail && files.imageThumbnail[0]) {
            productDoc.thumbnailImageId = files.imageThumbnail[0].filename;
            productDoc.thumbnailImageFileName = files.imageThumbnail[0].originalname;
        }

        if (files && files.imageDetails && files.imageDetails[0]) {
            productDoc.detailsImageId = files.imageDetails[0].filename;
            productDoc.detailsImageFileName = files.imageDetails[0].originalname;
        }

        await updateTable('products', productDoc)

        await deletePricings(id)
        let newPricing = []
        for (let price of variablePricing) {
            const newPrice = addProductPricing(price, id)
            newPricing.push(newPrice)
        }

        res.status(200).json({ productDoc, newPricing })
    } catch (err) {
        console.log(err.stack)
        res.status(500).json(err);
    }
});


app.post('/sign-guest-token', async (req, res) => {
    try {
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

app.post('/sign-theme-token', async (req, res) => {
    try {
        jwt.sign({
            darkMode: false
        }, jwtSecret, {}, async (err, token) => {
            if (err) {
                return res.status(500).json({ messge: err.message });
            }
            res.cookie('themeToken', token, { domain: 'ideasthatfloat-server-lnr7.onrender.com', secure: true, sameSite: 'none' })
            res.status(200).json(token)
        })
    } catch (err) { res.status(500).json({ message: err.message }) }
});

app.get('/verify-theme-token', async (req, res) => {
    const themeToken = req.cookies.themeToken;
    if (!themeToken) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(themeToken, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.json({ darkMode: decoded.darkMode });
    })
});

app.post('/update-theme-token', async (req, res) => {
    try {
        const { darkMode } = req.body;
        jwt.sign({
            darkMode: darkMode
        }, jwtSecret, {}, async (err, token) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.cookie('themeToken', token, { domain: 'ideasthatfloat-server-lnr7.onrender.com', secure: true, sameSite: 'none' })
            res.status(200).json(token);
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/add-product-to-cart/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const { cartToken } = req.cookies;
    try {
        const product = await getProduct(id)
        if (product) {
            let cartDoc = await findCartByToken(cartToken)
            if (cartDoc) {
                await addProductToCart(product, quantity, cartToken)
                res.json(cartDoc);
            } else {
                res.status(404).json({ message: 'Cart not found' })
            }
        } else {
            res.status(404).json({ message: 'Product not found' })
        }
    } catch (err) {
        res.status(422).json(err);
    }
});


app.get('/user-cart', async (req, res) => {
    const cartToken = req.cookies.cartToken;
    try {
        const cartDoc = await findCartByToken(cartToken);
        const cartProducts = await getProdutsInCart(cartDoc.id)
        if (!cartProducts) {
            res.status(422).json('cart not found')
        } else {
            let products = []
            let pricings = []
            for (let i = 0; i < cartProducts.length; i++) {
                const product = await getProduct(cartProducts[i].productId)
                const pricing = await getPricingsForProduct(product.id)
                products.push(product)
                pricings.push(pricing)
            }
            res.json({ cartDoc, cartProducts, products, pricings });
        }
    } catch (err) {
        res.status(422).json(err)
    }
});


app.post('/cart-products', async (req, res) => {
    const { cart, productIndex } = req.body;
    try {
        const productId = cart.products[productIndex].product;
        const productDoc = await getProduct(productId);
        res.json(productDoc);
    } catch (err) {
        res.status(422).json(err);
    }
});

app.post('/delete-cart-item', async (req, res) => {
    const cartToken = req.cookies.cartToken;
    const { cartProducts, productId, count, index } = req.body;
    try {
        const cartDoc = await findCartByToken(cartToken)
        cartDoc.productCountTotal -= count
        await updateTable('cart', cartDoc)

        await deleteCartItems(productId)

        let newCartProducts = cartProducts
        newCartProducts.splice(index, 1)
        res.status(200).json({ cartDoc, newCartProducts })

    } catch (err) {
        res.status(422).json(err);
    }
});

app.post('/send-email', async (req, res) => {
    console.log('email sending')
    const { name, phoneNum, email, message } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'Outlook365',
        auth: {
            user: 'tc915004@outlook.com',
            pass: 'Tc1038668!278'
        }
    });

    let mailOptions;

    if (phoneNum === '') {
        mailOptions = {
            from: 'tc915004@outlook.com',
            to: "tc915004@outlook.com",
            subject: `New Message from ${name}`,
            text: `
                    Name: ${name}
                    Email: ${email}
                    Message: ${message}
                `
        };
    } else {
        mailOptions = {
            from: 'tc915004@outlook.com',
            to: "tc915004@outlook.com",
            subject: `New Message from ${name}`,
            text: `
                    Name: ${name}
                    Phone: ${phoneNum}
                    Email: ${email}
                    Message: ${message}
                `
        };
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error occured' })
        } else {
            console.log('email success')
            res.status(200).json({ message: 'Email send' })
        }
    });
});

app.post('/check-admin', (req, res) => {
    const { username } = req.body;
    for (let i = 0; i < admins.admins.length; i++) {
        if (username === admins.admins[i].username) {
            res.json('admin');
            return;
        }
    }
    res.json('user');
});

app.post('/reset-password-email', async (req, res) => {
    try {
        const { email } = req.body;

        const userDoc = await findUserByEmail(email);

        if (!userDoc) {
            res.status(422).json('User not found');
        } else {
            const resetPasswordToken = crypto.randomBytes(20).toString('hex');

            let mailOptions = {
                from: 'tc915004@outlook.com',
                to: email,
                subject: 'Password Reset',
                text: `You can reset your password by clicking this link:\nhttps://test.ideasthatfloat.com/login/reset-password/${email.split('@')[0]}/${resetPasswordToken}\n\nThank You!`
            }

            let transporter = nodemailer.createTransport({
                service: 'Outlook365',
                auth: {
                    user: 'tc915004@outlook.com',
                    pass: 'Tc1038668!278'
                }
            });

            transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: 'Error occurred' })
                } else {
                    console.log('Verification email sent');
                    res.status(200).json({ message: 'Verification email sent' })
                }
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

app.post('/reset-password/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { password } = req.body;
        const userDoc = await findUserByUsername(username);
        if (!userDoc) {
            res.status(422).json('User not found')
        } else {
            userDoc.password = bcrypt.hashSync(password, bcryptSalt);
            await updateTable('users', userDoc)
            res.json('Password reset');
        }
    } catch (err) {
        res.status(422).json('error occured')
    }
});

app.post('/save-think-tank-edit', upload.fields([{ name: 'thinkTankImage', maxCount: 1 }]), async (req, res) => {
    try {
        const { thinkTankText } = req.body;
        const thinkTankImage = req.files.thinkTankImage;

        // delete all old docs, create a new doc

        await deleteAllThinkTankDocs()

        const imageId = thinkTankImage[0].filename;
        const imageFileName = thinkTankImage[0].originalname;

        const thinkTankDoc = await createThinkTank(thinkTankText, imageId, imageFileName);

        res.json(thinkTankDoc);
    } catch (err) {
        res.status(422).json({ message: err.message })
    }
});


app.get('/get-think-tank-content', async (req, res) => {
    try {
        const inTheLabDoc = await getThinkTankContent();
        res.status(200).json(inTheLabDoc);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/user-info/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const userDoc = await findUserByUsername(username);
        if (!userDoc) {
            res.status(422).json('User not found');
        } else {
            res.status(200).json(userDoc);
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/save-user-changes/:username', async (req, res) => {
    const { email, password } = req.body;
    const { username } = req.params;
    try {
        const userDoc = await findUserByUsername(username);
        let usernameChange = false;
        let passwordChange = false;
        if (!userDoc) {
            res.status(422).json('User not found');
        } else {
            if (userDoc.email !== email) {

                const duplicateUser = await findUserByEmail(email);
                if (duplicateUser) {
                    res.status(420).json('Duplicate email');
                } else {
                    usernameChange = true;

                    const verificationToken = crypto.randomBytes(20).toString('hex');

                    userDoc.email = email;
                    userDoc.username = email.split('@')[0];
                    userDoc.confirmed = false;
                    userDoc.verificationToken = verificationToken;

                    let mailOptions = {
                        from: 'tc915004@outlook.com',
                        to: email,
                        subject: 'Email Verification',
                        text: `Please verify your account by clicking this link:\nhttps://test.ideasthatfloat.com/register/verify-email/${verificationToken}\n\nThank You!`
                    }

                    let transporter = nodemailer.createTransport({
                        service: 'Outlook365',
                        auth: {
                            user: 'tc915004@outlook.com',
                            pass: 'Tc1038668!278'
                        }
                    });

                    transporter.sendMail(mailOptions, (err, data) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ message: 'Error occurred' })
                        } else {
                            res.status(200).json({ message: 'Verification email sent' })
                        }
                    });
                }
            }
            if (password && password !== '') {
                userDoc.password = bcrypt.hashSync(password, bcryptSalt);
                passwordChange = true;
            }
            await updateTable('users', userDoc)
            res.status(200).json({ usernameChange, passwordChange });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/save-products-section', async (req, res) => {
    const { productsPageNames, productsPageDescriptions, productsSectionProducts } = req.body;
    try {
        await deleteHomePageProductDocs()
        let products = [];
        for (let i = 0; i < productsPageNames.length; i++) {
            const homePageProduct = await createHomePageProduct(productsPageNames[i], productsPageDescriptions[i], productsSectionProducts[i]);
            products.push(homePageProduct)
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/showcase-products', async (req, res) => {
    try {
        const showcaseProductDocs = await getAllHomePageProducts();
        if (!showcaseProductDocs) {
            res.status(422).json('No showcase products in database');
        } else {
            res.status(200).json(showcaseProductDocs);
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/save-boat-setup', async (req, res) => {
    try {
        const setupData = req.body;
        console.log(setupData.userId)
        const boatSetupAlreadySaved = await getBoatSetupWithUserId(setupData.userId)
        if (boatSetupAlreadySaved) {
            const newData = {
                id: boatSetupAlreadySaved.id,
                ...setupData
            }
            await updateTable('boatCalculator', newData)
            res.status(200).json('Boat setup saved')
            console.log('boat setup saved to already existing setup')
        } else {
            const savedBoatSetup = await createBoatSetupTable(setupData)
            res.status(201).json(savedBoatSetup)
            console.log(savedBoatSetup)
        }
    } catch (err) {
        console.log(err.stack)
        res.status(500).json(err.stack)
    }
});

app.get('/boat-setup/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const boatSetupDoc = await getBoatSetupWithUserId(userId);
        res.status(200).json(boatSetupDoc);
    } catch (err) {
        console.log(err.stack)
        res.status(500).json(err.stack)
    }
});

const port = process.env.PORT || 4000;


app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`)
});

