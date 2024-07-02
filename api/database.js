import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const db_config = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}

let pool;

const establishConnection = () => {
    pool = mysql.createPool(db_config)
}

establishConnection();


export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}

export async function findUserById(id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE id = ?
        `, [id])
    return rows[0]
}

export const createUser = async (name, email, password, verificationToken) => {
    const username = email.split('@')[0]
    const [result] = await pool.query(`
        INSERT INTO users (name, username, password, email, verificationToken)
        VALUES (?, ?, ?, ?, ?)
        `, [name, username, password, email, verificationToken])
    const id = result.insertId
    const user = await findUserById(id)
    return user
}

export const findUserByEmail = async (email) => {
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE email = ?
         `, [email])
    return rows[0]
}

export const findUserByUsername = async (username) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const values = [username];
    const [rows] = await pool.query(sql, values);
    return rows[0];
};


export const findUserByVerificationToken = async (verificationToken) => {
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE verificationToken = ?
         `, [verificationToken])
    return rows[0]
}

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



export async function getProducts() {
    const [rows] = await pool.query(`SELECT * FROM products`)
    return rows
}

export async function getProduct(id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM products
        WHERE id = ?
        `, [id])
    return rows[0]
}

export async function findProductByImageFileName(thumbnailImageFileName) {
    const [rows] = await pool.query(`
        SELECT *
        FROM products
        WHERE thumbnailImageFileName = ?
        `, [thumbnailImageFileName])
    return rows.length > 0 ? rows[0] : null
}

export const createProduct = async (name, partNumber, description, thumbnailImage, detailsImage) => {

    const thumbnailImageFileName = thumbnailImage[0].originalname;
    let thumbnailImageId = thumbnailImage[0].filename;

    let detailsImageFileName;
    let detailsImageId;

    if (detailsImage && detailsImage[0]) {
        detailsImageFileName = detailsImage[0].originalname;
        detailsImageId = detailsImage[0].filename;
    }

    const [result] = await pool.query(`
        INSERT INTO products (name, partNumber, description, thumbnailImageId, detailsImageId, thumbnailImageFileName, detailsImageFileName)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [name, partNumber, description, thumbnailImageId, detailsImageId, thumbnailImageFileName, detailsImageFileName])

    const id = result.insertId
    return getProduct(id)
}


export const deleteProduct = async (productId) => {
    const query = 'DELETE FROM products WHERE id = ?'
    await pool.query(query, [productId])
}

export const deletePricings = async (productId) => {
    const query = 'DELETE FROM pricings WHERE productId = ?'
    await pool.query(query, [productId])
}

export const getPricing = async (id) => {
    const [rows] = await pool.query(`
        SELECT *
        FROM pricings
        WHERE id = ?
        `, [id])
    return rows[0]
}

export const getPricingsForProduct = async (productId) => {
    const [rows] = await pool.query(`
        SELECT *
        FROM pricings
        WHERE productId = ?
        `, [productId])
    return rows
}


export const addProductPricing = async (productPricing, productId) => {
    let query = `
        INSERT INTO pricings (min, ${productPricing.max ? 'max, ' : ''} price, productId)
        VALUES (?, ${productPricing.max ? '?, ' : ''} ?, ?)
    `;
    let values = [productPricing.min, productPricing.price, productId];
    if (productPricing.max) {
        values.splice(1, 0, productPricing.max);
    }
    const [result] = await pool.query(query, values);
    const id = result.insertId;
    const pricing = await getPricing(id);
    return pricing;
}


export const getCart = async (id) => {
    const [rows] = await pool.query(`
        SELECT *
        FROM cart
        WHERE id = ?
        `, [id])
    return rows[0]
}

export const findCartByToken = async (token) => {
    const sql = 'SELECT * FROM cart WHERE token = ?';
    const values = [token];
    const [rows] = await pool.query(sql, values);
    return rows.length > 0 ? rows[0] : null;
}


export const getCartItem = async (id) => {
    const [rows] = await pool.query(`
        SELECT *
        FROM CartItem
        WHERE id = ?
        `, [id])
    return rows[0]
}

export const deleteCartItems = async (productId) => {
    const query = `DELETE FROM CartItem WHERE productId = ?`
    const values = [productId]
    await pool.query(query, values)
}

export const createCart = async (userId, token) => {

    let sql, values;
    if (userId) {
        sql = 'INSERT INTO cart (token, userId) VALUES (?, ?)';
        values = [token, userId];
    } else {
        sql = 'INSERT INTO cart (token) VALUES (?)';
        values = [token];
    }

    const [result] = await pool.query(sql, values);
    return token;
};


export const addProductToCart = async (product, count, token) => {
    const productId = product.id
    const [rows] = await pool.query(`
        SELECT *
        FROM cart
        WHERE token = ?
        `, [token])
    const cart = rows[0]

    // Check if the product is already in the cart
    const [productRows] = await pool.query(`
        SELECT *
        FROM CartItem
        WHERE productId = ? AND cartId = ?
        `, [productId, cart.id])
    const existingProduct = productRows[0]

    if (existingProduct) {
        // If the product is already in the cart, increment the count
        const newCount = existingProduct.count + count
        await pool.query(`
            UPDATE CartItem
            SET count = ?
            WHERE id = ?
            `, [newCount, existingProduct.id])
    } else {
        // If the product is not in the cart, add it
        const [cartItemResult] = await pool.query(`
            INSERT INTO CartItem (productId, count, cartId)
            VALUES (?, ?, ?)
            `, [productId, count, cart.id])
    }

    // Update the total product count in the cart
    const [updatedRows] = await pool.query(`
        SELECT SUM(count) as totalProductCount
        FROM CartItem
        WHERE cartId = ?
        `, [cart.id])
    const totalProductCount = updatedRows[0].totalProductCount
    await pool.query(`
        UPDATE cart
        SET productCountTotal = ?
        WHERE id = ?
        `, [totalProductCount, cart.id])

    const newCart = await getCart(cart.id)
    return newCart
}



export const getProdutsInCart = async (cartId) => {
    const [rows] = await pool.query(`
        SELECT *
        FROM CartItem
        WHERE cartId = ?
        `, [cartId])
    return rows
}

export const getThinkTankContent = async () => {
    const [rows] = await pool.query(`
        SELECT *
        FROM thinkTank
        `)
    return rows[0]
}

export const createThinkTank = async (message, imageId, imageFileName) => {
    const query = `INSERT INTO thinkTank (message, imageId, imageFileName) VALUES (?, ?, ?)`
    const values = [message, imageId, imageFileName]
    const [result] = await pool.query(query, values)
    const thinkTankDoc = await getThinkTankContent();
    return thinkTankDoc
}

export const deleteAllThinkTankDocs = async () => {
    const query = `DELETE FROM thinkTank`
    await pool.query(query)
}

export const deleteHomePageProductDocs = async () => {
    const query = `DELETE FROM homePageProduct`
    await pool.query(query)
}

export const getHomePageProduct = async (id) => {
    const query = `SELECT * FROM homePageProduct WHERE id = ?`
    const values = id
    const [rows] = await pool.query(query, values)
    return rows[0]
}

export const createHomePageProduct = async (name, description, product) => {
    const productId = product.id
    const query = `INSERT INTO homePageProduct (name, description, productId) VALUES (?, ?, ?)`
    const values = [name, description, productId]
    const [result] = await pool.query(query, values)
    const id = result.insertId
    const homePageProduct = await getHomePageProduct(id)
    return homePageProduct
}

export const getAllHomePageProducts = async () => {
    const query = `SELECT * FROM homePageProduct`
    const [rows] = await pool.query(query)
    return rows
}

export const getBoatSetup = async (id) => {
    const query = `SELECT * FROM boatCalculator WHERE id = ?`
    const values = id
    const [rows] = await pool.query(query, values)
    return rows[0]
}

export const createBoatSetupTable = async (setupData) => {
    const userId = setupData.user.id;
    const query = `INSERT INTO boatCalculator (userId, boatLength, interiorLights, underwaterLights, cockpitLights, overheadLights, accentLights, dockingLights, navLights, deckLights, hardtopLights, hardtopAccentLights, helmOverheadLights, speakerLights, cupholderLights, aftSpreaderLights, forwardSpreaderLights, spotlightLights, storageLights, cabinLights, headLights, liveWellPump, baitWellPump, forwardPump, aftPump, freshwaterPump, wasteWaterPump, windshieldWipersControl, windshieldWiperSprayControl, anchorControl, towerControl, sunshadeControl, sunroofControl, airConditioningControl, wirelessInterface, momentaryRGBSwitchPrice, momentaryRGBSwitchHarnessPrice, awgPowerCablePrice, powerInjectorPrice, oneWayTeeConnectorPrice, twoWayTeeConnectorPrice, fourWayTeeConnectorPrice, backboneCable10mPrice, backboneCable8mPrice, backboneCable5mPrice, backboneCable2mPrice, backboneCableHalfMeterPrice, dropCablePrice, terminatorFemalePrice, terminatorMalePrice, sixOutputDigitalSwitchingBoxPrice, twentySevenOutputDigitalSwitchingBoxPrice, wirelessInterfacePrice, sixWayKeypadPrice, twelveWayKeypadPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const values = [userId, setupData.boatLength, setupData.interiorLights, setupData.underwaterLights, setupData.cockpitLights, setupData.overheadLights, setupData.accentLights, setupData.dockingLights, setupData.navLights, setupData.deckLights, setupData.hardtopLights, setupData.hardtopAccentLights, setupData.helmOverheadLights, setupData.speakerLights, setupData.cupholderLights, setupData.aftSpreaderLights, setupData.forwardSpreaderLights, setupData.spotlightLights, setupData.storageLights, setupData.cabinLights, setupData.headLights, setupData.liveWellPump, setupData.baitWellPump, setupData.forwardPump, setupData.aftPump, setupData.freshwaterPump, setupData.wasteWaterPump, setupData.windShieldWipersControl, setupData.windshieldWiperSprayControl, setupData.anchorControl, setupData.towerControl, setupData.sunshadeControl, setupData.sunroofControl, setupData.airConditioningControl, setupData.wirelessInterface, setupData.momentaryRGBSwitchPrice, setupData.momentaryRGBSwitchHarnessPrice, setupData.awgPowerCablePrice, setupData.powerInjectorPrice, setupData.oneWayTeeConnectorPrice, setupData.twoWayTeeConnectorPrice, setupData.fourWayTeeConnectorPrice, setupData.backboneCable10mPrice, setupData.backboneCable8mPrice, setupData.backboneCable5mPrice, setupData.backboneCable2mPrice, setupData.backboneCableHalfMeterPrice, setupData.dropCablePrice, setupData.terminatorFemalePrice, setupData.terminatorMalePrice, setupData.sixOutputDigitalSwitchingBoxPrice, setupData.twentySevenOutputDigitalSwitchingBoxPrice, setupData.wirelessInterfacePrice, setupData.sixWayKeypadPrice, setupData.twelveWayKeypadPrice]
    const [result] = await pool.query(query, values)
    const id = result.insertId
    const boatSetup = await getBoatSetup(id)
    return boatSetup
}