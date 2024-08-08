This is a web app using node.js version 20.13.1

Type "module" is being used so import statments must be in a 'import ??? from ???' format and exports must be in a 'export const ??? = variable/function' format

****NEED TO CHANGE EMAIL PARAMETERS TO THE COMPANY EMAIL. CURRENTLY USING PERSONAL EMAILS AS PLACEHOLDER FOR TESTING****

Not all environment variables are in the files. All environment variables are on Render.com where the backend is hosted

Dependencies:

    bcryptjs: This is used to hash passwords and decrypt hashed passwords

    cookie-parser: Middleware for parsing cookie headers from the front-end

    cors: Middleware for adjusting browser security settings and allowing certain resources to be shared from different origins

    crypto: Used to generate token strings to be used for cookie tokens or url parameters

    dotenv: Used to allow use of a .env file for environment variables

    express: Framework for building an API and handling requests from the front-end

    jsonwebtoken: Library to generate and verify JSON web tokens (cookies)

    multer: Middleware for handling multipart/form-data, mostly used for uploading files likes images

    mysql2: Used for interacting with a SQL database

    nodemailer: Used for sending emails

    nodemon: Used to automatically restart the app when changes are made to files

    stripe: Stripe library for using their API

    uuid: (Not used) For generating unique identifiers for documents

