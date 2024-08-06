import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [guestCookie, setGuestCookie] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [navTotalCartCount, setNavTotalCartCount] = useState(0);

    useEffect(() => {
        const signGuestToken = async () => {
            let token = Cookies.get('cartToken');
            if (!token) {
                const res = await axios.post('/sign-guest-token', {}, { withCredentials: true });
                token = res.data;
            }
            setGuestCookie(token);
        }
        signGuestToken();
        const verifyUserToken = async () => {
            try {
                const res = await axios.get('/verify-token');
                setUser(res.data)
            } catch (err) {
                console.log(err);
            }
        }
        verifyUserToken();
        const signThemeToken = async () => {
            let token = Cookies.get('themeToken');
            if (!token) {
                await axios.post('/sign-theme-token', {}, { withCredentials: true });
            }
        }
        signThemeToken();
        const verifyThemeToken = async () => {
            try {
                const { data } = await axios.get('/verify-theme-token');
                setDarkMode(data.darkMode);
            } catch (err) {
                console.log(err);
            }
        }
        verifyThemeToken();
    }, []);

    useEffect(() => {
        const updateThemeToken = async () => {
            await axios.post('/update-theme-token', { darkMode }, { withCredentials: true });
        }
        updateThemeToken();
    }, [darkMode])

    return (
        <UserContext.Provider value={{ user, setUser, guestCookie, setGuestCookie, darkMode, setDarkMode, navTotalCartCount, setNavTotalCartCount }}>
            {children}
        </UserContext.Provider>
    );
}