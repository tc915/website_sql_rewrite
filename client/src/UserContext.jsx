import { createContext, useState, useEffect } from "react"; // Import React's createContext, useState, and useEffect hooks.
import axios from 'axios'; // Import axios for making HTTP requests.
import Cookies from 'js-cookie'; // Import js-cookie for managing cookies.

export const UserContext = createContext(); // Create a new context object for managing user-related state.

export const UserContextProvider = ({ children }) => { // Define a provider component that wraps children components with context data.
    const [user, setUser] = useState(null); // State for storing user data, initially set to null.
    const [guestCookie, setGuestCookie] = useState(null); // State for storing guest cookie data, initially set to null.
    const [darkMode, setDarkMode] = useState(false); // State for managing dark mode, initially set to false.
    const [navTotalCartCount, setNavTotalCartCount] = useState(0); // State for storing the total cart count, initially set to 0.

    useEffect(() => { // Effect that runs on component mount.
        const signGuestToken = async () => { // Function to obtain or create a guest token.
            let token = Cookies.get('cartToken'); // Check if the 'cartToken' cookie exists.
            if (!token) { // If no token is found.
                const res = await axios.post('/sign-guest-token', {}, { withCredentials: true }); // Request a new guest token from the server.
                token = res.data; // Store the received token.
            }
            setGuestCookie(token); // Update state with the guest token.
        }
        signGuestToken(); // Call the function to sign or retrieve guest token.


        const verifyUserToken = async () => { // Function to verify the user's authentication token.
            try {
                const res = await axios.get('/verify-token'); // Request user data from the server.
                setUser(res.data); // Update state with the received user data.
            } catch (err) {
                console.log(err); // Log any errors encountered.
            }
        }
        verifyUserToken(); // Call the function to verify the user token.


        const signThemeToken = async () => { // Function to sign or create a theme token.
            let token = Cookies.get('themeToken'); // Check if the 'themeToken' cookie exists.
            if (!token) { // If no token is found.
                await axios.post('/sign-theme-token', {}, { withCredentials: true }); // Request a new theme token from the server.
            }
        }
        signThemeToken(); // Call the function to sign or retrieve theme token.


        const verifyThemeToken = async () => { // Function to verify the theme token and set dark mode.
            try {
                const { data } = await axios.get('/verify-theme-token'); // Request theme data from the server.
                setDarkMode(data.darkMode); // Update dark mode state with the received data.
            } catch (err) {
                console.log(err); // Log any errors encountered.
            }
        }
        verifyThemeToken(); // Call the function to verify the theme token.


    }, []); // Empty dependency array means this effect runs once on component mount.

    useEffect(() => { // Effect that runs whenever darkMode state changes.
        const updateThemeToken = async () => { // Function to update the theme token on the server.
            await axios.post('/update-theme-token', { darkMode }, { withCredentials: true }); // Send the current dark mode state to the server.
        }
        updateThemeToken(); // Call the function to update the theme token.

    }, [darkMode]); // Dependency array includes darkMode, so this effect runs whenever darkMode changes.

    return (
        <UserContext.Provider value={{ user, setUser, guestCookie, setGuestCookie, darkMode, setDarkMode, navTotalCartCount, setNavTotalCartCount }}>
            {children} {/* Render the children components with access to the context data. */}
        </UserContext.Provider>
    );
}
