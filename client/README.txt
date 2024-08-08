This is the front-end that uses REACT with VITE

Dependencies:

    '@react-oauth/google': React library that simplifies the integration of Google OAuth authentification

    '@stripe/react-stripe-js': React library to facilitate the integration of Stripe's payment processing capabilities

    "@stripe/stripe-js": General purpose JavaScript library for Stripe integration

    axios: JavaScript library for making HTTP requests from both browser and Node.js environments

    dotenv: Used for environment variables on the font-end. Must use VITE_REACT_APP prefix to all environment variables

    framer-motion: Animation library for React

    js-cookie: Handles cookies on the browser and simplifies process of creating, reading, and deleting cookies

    jsonwebtoken: JavaScript library used for creating and verifying JSON Web Tokens in cookies

    jwt-decode: Used for decoding JSON Web Tokens to extract information

    react-router: Library for managing navigation and routing in React applications

    react-router-dom: Provides DOM-specific routing functionality for React applicatoins using 'react-router'

    react-textarea-autosize: Library for using a text area HTML element that automatically increases its height when text overflows instead of having scrolling overflow


important scripts to run in powershell (MUST BE RAN WHEN IN THE CLIENT DIRECTORY):

    'npm run build': Used to build the React app into a single index.html that can access the rest of the website. (Note: This compiles the code to be as short as possible so any debugging in the browser is impossible)

    'npm run dev': Used to run the React app locally and see design, format, etc. (Note: Using this can debug potential front-end issues but not for anything that has to do with the backend because browsers block any requests from 'http:' because they aren't secure. To debug anything to do with the backend, build with 'npm run build', upload to front-end hosting site, and debug from there.)

    'npm install ???': Used to install dependencies found on https://npmjs.com


important notes: 

   ------------ tailwind.config.js --------------
        Tailwindcss is used to make CSS styling inline with HTML elements. Visit https://tailwindcss.com/docs/installation to see different styling rules. Tailwind is used by adding the prop ' className="???" ' to any element. It works by having premade styling classes that you attach to HTML elements. To have custom parameters instead of the pre-made classes, use brackets [], ex: className="text-[#FF7F11]" for custom text color or className="w-[15.25rem]" for custom width.

        The tailwind.config.js file is where you can configure the rules of styling and add your own classes for use with Tailwind (Note: Most added configuration is custom colors, screen sizes, and font-families. Font-families still needed to be imported in 'index.css').



    ------------ miscellaneous ---------------
        
        'main.jsx': root of the React app that contains the Router

        'App.jsx': Mainly used for the routing of the React app

        --components folder is for any main sections of the website

        --partials folder is for any component that is not an entire page and is placed on top of or in other components, ex: Nav bars, footers, etc.

        'index.html': The root HTML file of the React app where you can change the title of the tab in the browser, icons, and anything you can usually change in the Head element of a website

        'App.css': Used for any styling that Tailwind doesn't have or can't change

        'UserContext.jsx': Used for storing User information throughout the entire React App, saving and accessing cookies, and changing the theme of the Website. Anything you want to be kept throughout the entire App should be stored in this file and passed down to other components for use. Use the function useContext(UserContext) in any component (jsx file) to extract anything declared in this file, ex: 'const { user, setUser } = useContext(UserContext)'


