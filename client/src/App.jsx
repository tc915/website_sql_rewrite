import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import axios from 'axios';
import Header from './partials/Header';
import Home from './components/Home';
import Login from './components/Login';
import Products from './components/Products'
import Register from './components/Register';
import { UserContextProvider } from './UserContext';
import ProductDetails from './components/ProductDetails';
import { useEffect, useState } from 'react';
import Contact from './components/Contact';
import Services from './components/Services';
import Cart from './components/Cart';
import Industries from './components/Industries';
import About from './components/About';
import { AnimatePresence } from 'framer-motion';
import EnclosureDesign from './components/services/EnclosureDesign';
import ResearchDevelopment from './components/services/ResearchDevelopment';
import EmbeddedFirmware from './components/services/EmbeddedFirmware';
import CustomGUI from './components/services/CustomGUI';
import AppDevelopment from './components/services/AppDevelopment';
import ElectricalDesign from './components/services/ElectricalDesign';
import Checkout from './components/Checkout';
import EmailVerification from './components/EmailVerification';
import VerificationPage from './components/VerificationPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Marine from './components/industries/Marine';
import Automotive from './components/industries/Automotive';
import Mobile from './components/industries/Mobile';
import UserInfo from './components/UserInfo';
import Demos from './components/Demos';
import ICandyDemo from './components/demos/ICandyDemo';

let baseURL;

if (process.env.NODE_ENV === "development") {
    baseURL = "http://localhost:4000";
} else {
    baseURL = 'https://website-sql-rewrite.onrender.com';
}

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

function App() {

    const location = useLocation();
    const [scrollY, setScrollY] = useState(0);
    const [navBackgroundOpaque, setNavBackgroundOpaque] = useState(false);

    useEffect(() => {
        // console.log(window.scrollY)
        const setScrollPosition = () => {
            setScrollY(window.scrollY)
        }
        window.addEventListener('scroll', setScrollPosition);
        return () => {
            window.removeEventListener('scroll', setScrollPosition);
        }
    }, [scrollY]);


    return (

        <UserContextProvider>
            <Header navBackgroundOpaque={navBackgroundOpaque} />
            <AnimatePresence mode='wait' key={location.pathname}>
                <Routes location={location} key={location.key}>
                    <Route path='/' element={<Home scrollY={scrollY} />} />
                    <Route path='/products' element={<Products />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/products/:id' element={<ProductDetails />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path="/services" element={<Services />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/industries' element={<Industries />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/services/research-and-development' element={<ResearchDevelopment />} />
                    <Route path='/services/enclosure-design' element={<EnclosureDesign />} />
                    <Route path='/services/embedded-firmware' element={<EmbeddedFirmware />} />
                    <Route path='/services/custom-GUI' element={<CustomGUI />} />
                    <Route path='/services/app-development' element={<AppDevelopment />} />
                    <Route path='/services/electrical-design' element={<ElectricalDesign />} />
                    <Route path='/cart/checkout' element={<Checkout />} />
                    <Route path='/register/verify-email' element={<EmailVerification />} />
                    <Route path='/register/verify-email/:token' element={<VerificationPage />} />
                    <Route path='/login/forgot-password' element={<ForgotPassword />} />
                    <Route path='/login/reset-password/:username/:token' element={<ResetPassword />} />
                    <Route path='/industries/marine' element={<Marine />} />
                    <Route path='/industries/automotive' element={<Automotive />} />
                    <Route path='/industries/mobile' element={<Mobile />} />
                    <Route path='/:username/info' element={<UserInfo />} />
                    <Route path='/demos' element={<Demos />} />
                    <Route path='/demos/iCandy' element={<ICandyDemo />} />
                </Routes>
            </AnimatePresence>
        </UserContextProvider>
    )
}

export default App