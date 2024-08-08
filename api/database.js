import mysql from 'mysql2/promise'; // Import the mysql2 library with promise support
import dotenv from 'dotenv'; // Import dotenv to manage environment variables
dotenv.config(); // Load environment variables from a .env file

// Configuration object for MySQL connection
const db_config = {
    host: process.env.MYSQL_HOST, // MySQL host (e.g., localhost or a remote server)
    user: process.env.MYSQL_USER, // MySQL username
    password: process.env.MYSQL_PASSWORD, // MySQL password
    database: process.env.MYSQL_DATABASE // MySQL database name
}

// Variable to hold the connection pool
let pool;

// Function to establish a connection pool
const establishConnection = () => {
    // Create a connection pool using the configuration object
    pool = mysql.createPool(db_config)
}

// Call the function to establish the connection pool
establishConnection();



// Exporting the asynchronous function getUsers
export async function getUsers() {
    // Execute a query to select all rows from the 'users' table
    const [rows] = await pool.query("SELECT * FROM users")

    // Return the rows retrieved from the database
    return rows
}


// Exporting the asynchronous function findUserById
export async function findUserById(id) {
    // Execute a query to select a user from the 'users' table where the id matches the provided id
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE id = ?
        `, [id])

    // Return the first row of the result set (the user with the specified id)
    return rows[0]
}


// Exporting the asynchronous function createUser
export const createUser = async (name, email, password, verificationToken) => {
    // Generate a username from the email by taking the part before '@'
    const username = email.split('@')[0]

    // Execute an SQL query to insert a new user into the 'users' table
    const [result] = await pool.query(`
        INSERT INTO users (name, username, password, email, verificationToken)
        VALUES (?, ?, ?, ?, ?)
        `, [name, username, password, email, verificationToken])

    // Extract the ID of the newly inserted user from the result
    const id = result.insertId

    // Retrieve the newly created user from the database using the ID
    const user = await findUserById(id)

    // Return the newly created user object
    return user
}


// Exporting the asynchronous function createUserWithGoogle
export const createUserWithGoogle = async (name, email, confirmed) => {
    // Generate a username from the email by taking the part before '@'
    const username = email.split('@')[0]

    // Execute an SQL query to insert a new user into the 'users' table
    const [result] = await pool.query(`
        INSERT INTO users (name, username, email, confirmed)
        VALUES (?, ?, ?, ?)
        `, [name, username, email, confirmed])

    // Extract the ID of the newly inserted user from the result
    const id = result.insertId

    // Retrieve the newly created user from the database using the ID
    const user = await findUserById(id)

    // Return the newly created user object
    return user
}


// Exporting the asynchronous function findUserByEmail
export const findUserByEmail = async (email) => {
    // Execute an SQL query to select all columns from the 'users' table
    // where the email column matches the provided email
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE email = ?
         `, [email])

    // Return the first row of the result (if any)
    return rows[0]
}


// Exporting the asynchronous function findUserByUsername
export const findUserByUsername = async (username) => {
    // Define the SQL query to select all columns from the 'users' table
    // where the username column matches the provided username
    const sql = 'SELECT * FROM users WHERE username = ?';

    // Define the values to be used in the SQL query's placeholders
    const values = [username];

    // Execute the SQL query using the pool connection
    // The query method returns an array where the first element is the rows returned by the query
    const [rows] = await pool.query(sql, values);

    // Return the first row of the result (if any)
    return rows[0];
}



// Exporting the asynchronous function findUserByVerificationToken
export const findUserByVerificationToken = async (verificationToken) => {
    // Define the SQL query to select all columns from the 'users' table
    // where the verificationToken column matches the provided verificationToken
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE verificationToken = ?
         `, [verificationToken]);

    // Return the first row of the result (if any)
    return rows[0];
}

// function for updating any table with a provided document
export const updateTable = async (tableName, doc) => {
    // Get the keys of the doc object
    const keys = Object.keys(doc);

    // Generate the SET clause of the SQL query
    const setClause = keys.map((key, index) => `${key} = ?`).join(', ');
    // Generate the values array for the SQL query
    const values = keys.map(key => doc[key]);

    // Add the doc's id to the values array
    values.push(doc.id);

    // Generate and execute the SQL query
    const [result] = await pool.query(`
        UPDATE ${tableName}
        SET ${setClause}
        WHERE id = ?
    `, values);
}



// Exporting the asynchronous function getProducts
export async function getProducts() {
    // Define the SQL query to select all columns from the 'products' table
    const [rows] = await pool.query(`SELECT * FROM products`);

    // Return the result rows (all products)
    return rows;
}


// Exporting the asynchronous function getProduct
export async function getProduct(id) {
    // Define the SQL query to select all columns from the 'products' table where the 'id' matches the provided value
    const [rows] = await pool.query(`
        SELECT *
        FROM products
        WHERE id = ?
        `, [id]);

    // Return the first row from the result (the product with the specified id)
    return rows[0];
}


// Exporting the asynchronous function findProductByImageFileName
export async function findProductByImageFileName(thumbnailImageFileName) {
    // Define the SQL query to select all columns from the 'products' table where the 'thumbnailImageFileName' matches the provided value
    const [rows] = await pool.query(`
        SELECT *
        FROM products
        WHERE thumbnailImageFileName = ?
        `, [thumbnailImageFileName]);

    // Return the first row if it exists, otherwise return null
    return rows.length > 0 ? rows[0] : null;
}


// Exporting the asynchronous function createProduct
export const createProduct = async (name, partNumber, description, thumbnailImage, detailsImage) => {

    // Extract the file name and ID of the thumbnail image from the uploaded files
    const thumbnailImageFileName = thumbnailImage[0].originalname;
    let thumbnailImageId = thumbnailImage[0].filename;

    let detailsImageFileName;
    let detailsImageId;

    // Check if detailsImage is provided and has at least one file
    if (detailsImage && detailsImage[0]) {
        // Extract the file name and ID of the details image from the uploaded files
        detailsImageFileName = detailsImage[0].originalname;
        detailsImageId = detailsImage[0].filename;
    }

    // Define the SQL query to insert a new product into the 'products' table
    const [result] = await pool.query(`
        INSERT INTO products (name, partNumber, description, thumbnailImageId, detailsImageId, thumbnailImageFileName, detailsImageFileName)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [name, partNumber, description, thumbnailImageId, detailsImageId, thumbnailImageFileName, detailsImageFileName]);

    // Get the ID of the newly inserted product
    const id = result.insertId;

    // Retrieve and return the newly created product
    return getProduct(id);
}



// Export an asynchronous function to delete a product from the 'products' table
export const deleteProduct = async (productId) => {
    // SQL query to delete a product based on its ID
    const query = 'DELETE FROM products WHERE id = ?';
    // Execute the query with the provided product ID
    await pool.query(query, [productId]);
}

// Export an asynchronous function to delete all pricings for a specific product
export const deletePricings = async (productId) => {
    // SQL query to delete all pricings associated with the given product ID
    const query = 'DELETE FROM pricings WHERE productId = ?';
    // Execute the query with the provided product ID
    await pool.query(query, [productId]);
}

// Export an asynchronous function to get pricing details by ID
export const getPricing = async (id) => {
    // SQL query to select all details from the 'pricings' table where the ID matches
    const [rows] = await pool.query(`
        SELECT *
        FROM pricings
        WHERE id = ?
        `, [id]);
    // Return the first row of the query result
    return rows[0];
}

// Export an asynchronous function to get all pricings for a specific product
export const getPricingsForProduct = async (productId) => {
    // SQL query to select all details from the 'pricings' table where the product ID matches
    const [rows] = await pool.query(`
        SELECT *
        FROM pricings
        WHERE productId = ?
        `, [productId]);
    // Return all rows of the query result
    return rows;
}

// Export an asynchronous function to add pricing details for a product
export const addProductPricing = async (productPricing, productId) => {
    // Define the SQL query to insert a new pricing record into the 'pricings' table
    // Conditionally include 'max' in the query if it's provided
    let query = `
        INSERT INTO pricings (min, ${productPricing.max ? 'max, ' : ''} price, productId)
        VALUES (?, ${productPricing.max ? '?, ' : ''} ?, ?)
    `;

    // Prepare values for the query
    let values = [productPricing.min, productPricing.price, productId];

    // Insert 'max' value into the values array if it's provided
    if (productPricing.max) {
        values.splice(1, 0, productPricing.max);
    }

    // Execute the query and get the result
    const [result] = await pool.query(query, values);
    // Get the ID of the newly inserted pricing record
    const id = result.insertId;
    // Retrieve and return the newly added pricing details
    const pricing = await getPricing(id);
    return pricing;
}

// Export an asynchronous function to get cart details by ID
export const getCart = async (id) => {
    // SQL query to select all details from the 'cart' table where the ID matches
    const [rows] = await pool.query(`
        SELECT *
        FROM cart
        WHERE id = ?
        `, [id]);
    // Return the first row of the query result
    return rows[0];
}


// Export an asynchronous function to find a cart by its token
export const findCartByToken = async (token) => {
    // Define the SQL query to select a cart where the token matches
    const sql = 'SELECT * FROM cart WHERE token = ?';
    // Prepare the values for the query
    const values = [token];
    // Execute the query and get the result
    const [rows] = await pool.query(sql, values);
    // Return the first row if found, otherwise return null
    return rows.length > 0 ? rows[0] : null;
}

// Export an asynchronous function to get a cart item by its ID
export const getCartItem = async (id) => {
    // Define the SQL query to select a cart item where the ID matches
    const [rows] = await pool.query(`
        SELECT *
        FROM CartItem
        WHERE id = ?
        `, [id]);
    // Return the first row of the result
    return rows[0];
}

// Export an asynchronous function to get a cart item by product ID
export const getCartItemWithProductId = async (productId) => {
    // Define the SQL query to select a cart item where the product ID matches
    const [rows] = await pool.query(`
        SELECT *
        FROM CartItem
        WHERE productId = ?
        `, [productId]);
    // Return the first row of the result
    return rows[0];
}

// Export an asynchronous function to delete specific cart items by cart ID and product ID
export const deleteCartItems = async (cartId, productId) => {
    // Define the SQL query to delete cart items based on cart ID and product ID
    const query = `DELETE FROM CartItem WHERE cartId = ? AND productId = ?`;
    // Prepare the values for the query
    const values = [cartId, productId];
    // Execute the query
    await pool.query(query, values);
}

// Export an asynchronous function to delete all cart items for a specific cart ID
export const deleteAllCartItems = async (cartId) => {
    // Define the SQL query to delete all cart items for a specific cart ID
    const query = `DELETE FROM CartItem WHERE cartId = ?`;
    // Prepare the value for the query
    const values = [cartId];
    // Execute the query
    await pool.query(query, values);
}


// Export an asynchronous function to create a new cart
export const createCart = async (userId, token) => {
    let sql, values;

    // If a user ID is provided, insert into the cart table with user ID
    if (userId) {
        sql = 'INSERT INTO cart (token, userId) VALUES (?, ?)';
        values = [token, userId];
    } else {
        // If no user ID is provided, insert into the cart table without user ID
        sql = 'INSERT INTO cart (token) VALUES (?)';
        values = [token];
    }

    // Execute the SQL query to create the cart
    const [result] = await pool.query(sql, values);
    // Return the token of the newly created cart
    return token;
};

// Export an asynchronous function to add a product to a cart
export const addProductToCart = async (product, count, token) => {
    const productId = product.id;

    // Retrieve the cart based on the provided token
    const [rows] = await pool.query(`
        SELECT *
        FROM cart
        WHERE token = ?
        `, [token]);
    const cart = rows[0];

    // Check if the product is already in the cart
    const [productRows] = await pool.query(`
        SELECT *
        FROM CartItem
        WHERE productId = ? AND cartId = ?
        `, [productId, cart.id]);
    const existingProduct = productRows[0];

    if (existingProduct) {
        // If the product is already in the cart, increment the count
        const newCount = existingProduct.count + count;
        await pool.query(`
            UPDATE CartItem
            SET count = ?
            WHERE id = ?
            `, [newCount, existingProduct.id]);
    } else {
        // If the product is not in the cart, add it
        const [cartItemResult] = await pool.query(`
            INSERT INTO CartItem (productId, count, cartId)
            VALUES (?, ?, ?)
            `, [productId, count, cart.id]);
    }

    // Update the total product count in the cart
    const [updatedRows] = await pool.query(`
        SELECT SUM(count) as totalProductCount
        FROM CartItem
        WHERE cartId = ?
        `, [cart.id]);
    const totalProductCount = updatedRows[0].totalProductCount;

    // Update the cart with the new total product count
    await pool.query(`
        UPDATE cart
        SET productCountTotal = ?
        WHERE id = ?
        `, [totalProductCount, cart.id]);

    // Retrieve and return the updated cart
    const newCart = await getCart(cart.id);
    return newCart;
}




// Export an asynchronous function to retrieve all products in a cart based on the cart ID
export const getProductsInCart = async (cartId) => {
    // Query the CartItem table to get all items associated with the given cartId
    const [rows] = await pool.query(`
        SELECT *
        FROM CartItem
        WHERE cartId = ?
        `, [cartId]);
    // Return the retrieved rows (all products in the specified cart)
    return rows;
}

// Export an asynchronous function to retrieve the current content of the think tank
export const getThinkTankContent = async () => {
    // Query the thinkTank table to get all records
    const [rows] = await pool.query(`
        SELECT *
        FROM thinkTank
        `);
    // Return the first record from the thinkTank table
    return rows[0];
}

// Export an asynchronous function to create a new think tank entry
export const createThinkTank = async (message, imageId, imageFileName) => {
    // Define the SQL query to insert a new record into the thinkTank table
    const query = `INSERT INTO thinkTank (message, imageId, imageFileName) VALUES (?, ?, ?)`;
    // Define the values to be inserted into the table
    const values = [message, imageId, imageFileName];
    // Execute the SQL query to insert the new record
    const [result] = await pool.query(query, values);
    // Retrieve the updated content of the think tank table after insertion
    const thinkTankDoc = await getThinkTankContent();
    // Return the updated think tank content
    return thinkTankDoc;
}

// Export an asynchronous function to delete all records from the thinkTank table
export const deleteAllThinkTankDocs = async () => {
    // Define the SQL query to delete all records from the thinkTank table
    const query = `DELETE FROM thinkTank`;
    // Execute the SQL query to delete all records
    await pool.query(query);
}

// Export an asynchronous function to delete all records from the homePageProduct table
export const deleteHomePageProductDocs = async () => {
    // Define the SQL query to delete all records from the homePageProduct table
    const query = `DELETE FROM homePageProduct`;
    // Execute the SQL query to delete all records
    await pool.query(query);
}

// Export an asynchronous function to retrieve a specific home page product by ID
export const getHomePageProduct = async (id) => {
    // Define the SQL query to get a specific product from the homePageProduct table by its ID
    const query = `SELECT * FROM homePageProduct WHERE id = ?`;
    // Define the values for the query (product ID)
    const values = id;
    // Execute the SQL query to retrieve the product
    const [rows] = await pool.query(query, values);
    // Return the first record from the result set (the specific home page product)
    return rows[0];
}


// Export an asynchronous function to create a new home page product
export const createHomePageProduct = async (name, description, product) => {
    // Extract the product ID from the provided product object
    const productId = product.id;
    // Define the SQL query to insert a new record into the homePageProduct table
    const query = `INSERT INTO homePageProduct (name, description, productId) VALUES (?, ?, ?)`;
    // Define the values to be inserted into the table
    const values = [name, description, productId];
    // Execute the SQL query to insert the new record
    const [result] = await pool.query(query, values);
    // Retrieve the ID of the newly inserted record
    const id = result.insertId;
    // Retrieve the newly created home page product using the ID
    const homePageProduct = await getHomePageProduct(id);
    // Return the newly created home page product
    return homePageProduct;
}

// Export an asynchronous function to retrieve all home page products
export const getAllHomePageProducts = async () => {
    // Define the SQL query to select all records from the homePageProduct table
    const query = `SELECT * FROM homePageProduct`;
    // Execute the SQL query to retrieve all home page products
    const [rows] = await pool.query(query);
    // Return all retrieved home page products
    return rows;
}

// Export an asynchronous function to retrieve a specific boat setup by ID
export const getBoatSetup = async (id) => {
    // Define the SQL query to select a specific record from the boatCalculator table by its ID
    const query = `SELECT * FROM boatCalculator WHERE id = ?`;
    // Define the values for the query (boat setup ID)
    const values = id;
    // Execute the SQL query to retrieve the boat setup
    const [rows] = await pool.query(query, values);
    // Return the first record from the result set (the specific boat setup)
    return rows[0];
}

// Export an asynchronous function to retrieve a boat setup by user ID
export const getBoatSetupWithUserId = async (id) => {
    // Define the SQL query to select a specific record from the boatCalculator table by user ID
    const query = `SELECT * FROM boatCalculator WHERE userId = ?`;
    // Define the values for the query (user ID)
    const values = id;
    // Execute the SQL query to retrieve the boat setup
    const [rows] = await pool.query(query, values);
    // Return the first record from the result set (the boat setup for the specified user ID)
    return rows[0];
}


// Export an asynchronous function to create a new boat setup record
export const createBoatSetupTable = async (setupData) => {
    // Define the SQL query to insert a new record into the boatCalculator table
    // It includes placeholders for all columns in the table
    const query = `
        INSERT INTO boatCalculator (
            userId, boatLength, interiorLights, underwaterLights, cockpitLights, 
            overheadLights, accentLights, dockingLights, navLights, deckLights, 
            hardtopLights, hardtopAccentLights, helmOverheadLights, speakerLights, 
            cupholderLights, aftSpreaderLights, forwardSpreaderLights, spotlightLights, 
            storageLights, cabinLights, headLights, liveWellPump, baitWellPump, 
            forwardPump, aftPump, freshwaterPump, wasteWaterPump, windshieldWipersControl, 
            windshieldWiperSprayControl, anchorControl, towerControl, sunshadeControl, 
            sunroofControl, airConditioningControl, wirelessInterface, momentaryRGBSwitchPrice, 
            momentaryRGBSwitchHarnessPrice, awgPowerCablePrice, powerInjectorPrice, 
            oneWayTeeConnectorPrice, twoWayTeeConnectorPrice, fourWayTeeConnectorPrice, 
            backboneCable10mPrice, backboneCable8mPrice, backboneCable5mPrice, 
            backboneCable2mPrice, backboneCableHalfMeterPrice, dropCablePrice, 
            terminatorFemalePrice, terminatorMalePrice, sixOutputDigitalSwitchingBoxPrice, 
            twentySevenOutputDigitalSwitchingBoxPrice, wirelessInterfacePrice, 
            sixWayKeypadPrice, twelveWayKeypadPrice
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Define the values to be inserted into the table based on the provided setupData object
    const values = [
        setupData.userId, setupData.boatLength, setupData.interiorLights, setupData.underwaterLights,
        setupData.cockpitLights, setupData.overheadLights, setupData.accentLights, setupData.dockingLights,
        setupData.navLights, setupData.deckLights, setupData.hardtopLights, setupData.hardtopAccentLights,
        setupData.helmOverheadLights, setupData.speakerLights, setupData.cupholderLights,
        setupData.aftSpreaderLights, setupData.forwardSpreaderLights, setupData.spotlightLights,
        setupData.storageLights, setupData.cabinLights, setupData.headLights, setupData.liveWellPump,
        setupData.baitWellPump, setupData.forwardPump, setupData.aftPump, setupData.freshwaterPump,
        setupData.wasteWaterPump, setupData.windshieldWipersControl, setupData.windshieldWiperSprayControl,
        setupData.anchorControl, setupData.towerControl, setupData.sunshadeControl, setupData.sunroofControl,
        setupData.airConditioningControl, setupData.wirelessInterface, setupData.momentaryRGBSwitchPrice,
        setupData.momentaryRGBSwitchHarnessPrice, setupData.awgPowerCablePrice, setupData.powerInjectorPrice,
        setupData.oneWayTeeConnectorPrice, setupData.twoWayTeeConnectorPrice, setupData.fourWayTeeConnectorPrice,
        setupData.backboneCable10mPrice, setupData.backboneCable8mPrice, setupData.backboneCable5mPrice,
        setupData.backboneCable2mPrice, setupData.backboneCableHalfMeterPrice, setupData.dropCablePrice,
        setupData.terminatorFemalePrice, setupData.terminatorMalePrice,
        setupData.sixOutputDigitalSwitchingBoxPrice, setupData.twentySevenOutputDigitalSwitchingBoxPrice,
        setupData.wirelessInterfacePrice, setupData.sixWayKeypadPrice, setupData.twelveWayKeypadPrice
    ];

    // Execute the SQL query with the specified values to insert a new boat setup record
    const [result] = await pool.query(query, values);

    // Retrieve the ID of the newly inserted record
    const id = result.insertId;

    // Fetch the newly created boat setup using its ID
    const boatSetup = await getBoatSetup(id);

    // Return the newly created boat setup
    return boatSetup;
}
