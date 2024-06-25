import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [guestCookie, setGuestCookie] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const signGuestToken = async () => {
            console.log('guest cookie attempt')
            let token = Cookies.get('cartToken');
            console.log(token)
            if (!token) {
                const res = await axios.post('/sign-guest-token', {}, { withCredentials: true });
                console.log(res.data)
                token = res.data;
                Cookies.set('cartToken', token);
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
                const res = await axios.post('/sign-theme-token', {}, { withCredentials: true });
                token = res.data;
                Cookies.set('themeToken', token, { expires: 7 });
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
            const res = await axios.post('/update-theme-token', { darkMode }, { withCredentials: true });
            const token = res.data;
            Cookies.set('themeToken', token);
        }
        updateThemeToken();
    }, [darkMode])

    return (
        <UserContext.Provider value={{ user, setUser, guestCookie, setGuestCookie, darkMode, setDarkMode }}>
            {children}
        </UserContext.Provider>
    );
}