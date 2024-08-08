import './App.css'; // Import the CSS file for styling the App component.
import { Route, Routes, useLocation } from 'react-router-dom'; // Import Route, Routes, and useLocation from react-router-dom for routing.
import axios from 'axios'; // Import axios for making HTTP requests.
import Header from './partials/Header'; // Import the Header component.
import Home from './components/Home'; // Import the Home component.
import Login from './components/Login'; // Import the Login component.
import Products from './components/Products'; // Import the Products component.
import Register from './components/Register'; // Import the Register component.
import { UserContextProvider } from './UserContext'; // Import UserContextProvider to provide user context to the application.
import ProductDetails from './components/ProductDetails'; // Import the ProductDetails component.
import { useEffect, useState } from 'react'; // Import useEffect and useState from React for managing component side-effects and state.
import Contact from './components/Contact'; // Import the Contact component.
import Services from './components/Services'; // Import the Services component.
import Cart from './components/Cart'; // Import the Cart component.
import Industries from './components/Industries'; // Import the Industries component.
import About from './components/About'; // Import the About component.
import { AnimatePresence } from 'framer-motion'; // Import AnimatePresence from framer-motion for animations.
import EnclosureDesign from './components/services/EnclosureDesign'; // Import the EnclosureDesign component.
import ResearchDevelopment from './components/services/ResearchDevelopment'; // Import the ResearchDevelopment component.
import EmbeddedFirmware from './components/services/EmbeddedFirmware'; // Import the EmbeddedFirmware component.
import CustomGUI from './components/services/CustomGUI'; // Import the CustomGUI component.
import AppDevelopment from './components/services/AppDevelopment'; // Import the AppDevelopment component.
import ElectricalDesign from './components/services/ElectricalDesign'; // Import the ElectricalDesign component.
import Checkout from './components/Checkout'; // Import the Checkout component.
import EmailVerification from './components/EmailVerification'; // Import the EmailVerification component.
import VerificationPage from './components/VerificationPage'; // Import the VerificationPage component.
import ForgotPassword from './components/ForgotPassword'; // Import the ForgotPassword component.
import ResetPassword from './components/ResetPassword'; // Import the ResetPassword component.
import Marine from './components/industries/Marine'; // Import the Marine component.
import Automotive from './components/industries/Automotive'; // Import the Automotive component.
import Mobile from './components/industries/Mobile'; // Import the Mobile component.
import UserInfo from './components/UserInfo'; // Import the UserInfo component.
import Demos from './components/Demos'; // Import the Demos component.
import ICandyDemo from './components/demos/ICandyDemo'; // Import the ICandyDemo component.
import { loadStripe } from '@stripe/stripe-js'; // Import loadStripe from @stripe/stripe-js for Stripe integration.
import { Elements } from '@stripe/react-stripe-js'; // Import Elements from @stripe/react-stripe-js to wrap components that use Stripe.

let baseURL; // Variable to hold the base URL for API requests.

if (process.env.NODE_ENV === "development") { // Check if the environment is development.
    baseURL = "http://localhost:4000"; // Set base URL to localhost for development.
} else { // If not in development.
    baseURL = 'https://ideasthatfloat-server-lnr7.onrender.com'; // Set base URL to production server.
}

axios.defaults.baseURL = baseURL; // Set the default base URL for axios requests.
axios.defaults.withCredentials = true; // Ensure that cookies are sent with requests.

function App() { // Define the App component.

    const location = useLocation(); // Get the current location from react-router-dom.
    const [scrollY, setScrollY] = useState(0); // State to track the vertical scroll position.
    const [navBackgroundOpaque, setNavBackgroundOpaque] = useState(false); // State to control the opacity of the navigation background.
    const [prevLoginPath, setPrevLoginPath] = useState(''); // State to track the previous login path.

    const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_PUBLISHABLE_KEY); // Load Stripe with the publishable key from environment variables.

    useEffect(() => { // Effect to handle scroll position.
        const setScrollPosition = () => {
            setScrollY(window.scrollY); // Update scrollY state with current scroll position.
        };
        window.addEventListener('scroll', setScrollPosition); // Add event listener for scroll.
        return () => {
            window.removeEventListener('scroll', setScrollPosition); // Clean up event listener on unmount.
        };
    }, [scrollY]); // Dependency array includes scrollY, effect runs on scrollY change.

    return (
        <Elements stripe={stripePromise}> {/* Wrap the application with Stripe Elements provider */}
            <UserContextProvider> {/* Provide user context to the application */}
                <Header navBackgroundOpaque={navBackgroundOpaque} prevLoginPath={prevLoginPath} setPrevLoginPath={setPrevLoginPath} /> {/* Render the Header component with props */}
                <AnimatePresence mode='wait' key={location.pathname}> {/* Handle animation transitions between routes */}
                    <Routes location={location} key={location.key}> {/* Define routing for the application */}
                        <Route path='/' element={<Home scrollY={scrollY} />} /> {/* Route for the home page */}
                        <Route path='/products' element={<Products />} /> {/* Route for the products page */}
                        <Route path='/login' element={<Login prevLoginPath={prevLoginPath} setPrevLoginPath={setPrevLoginPath} />} /> {/* Route for the login page */}
                        <Route path='/register' element={<Register />} /> {/* Route for the register page */}
                        <Route path='/products/:id' element={<ProductDetails />} /> {/* Route for product details with dynamic id */}
                        <Route path='/contact' element={<Contact />} /> {/* Route for the contact page */}
                        <Route path="/services" element={<Services />} /> {/* Route for the services page */}
                        <Route path='/cart' element={<Cart prevLoginPath={prevLoginPath} setPrevLoginPath={setPrevLoginPath} />} /> {/* Route for the cart page */}
                        <Route path='/industries' element={<Industries />} /> {/* Route for the industries page */}
                        <Route path='/about' element={<About />} /> {/* Route for the about page */}
                        <Route path='/services/research-and-development' element={<ResearchDevelopment />} /> {/* Route for the research and development service */}
                        <Route path='/services/enclosure-design' element={<EnclosureDesign />} /> {/* Route for the enclosure design service */}
                        <Route path='/services/embedded-firmware' element={<EmbeddedFirmware />} /> {/* Route for the embedded firmware service */}
                        <Route path='/services/custom-GUI' element={<CustomGUI />} /> {/* Route for the custom GUI service */}
                        <Route path='/services/app-development' element={<AppDevelopment />} /> {/* Route for the app development service */}
                        <Route path='/services/electrical-design' element={<ElectricalDesign />} /> {/* Route for the electrical design service */}
                        <Route path='/cart/checkout' element={<Checkout />} /> {/* Route for the checkout page */}
                        <Route path='/register/verify-email' element={<EmailVerification />} /> {/* Route for email verification */}
                        <Route path='/register/verify-email/:token' element={<VerificationPage />} /> {/* Route for verification page with token */}
                        <Route path='/login/forgot-password' element={<ForgotPassword />} /> {/* Route for forgot password page */}
                        <Route path='/login/reset-password/:username/:token' element={<ResetPassword />} /> {/* Route for reset password page with username and token */}
                        <Route path='/industries/marine' element={<Marine />} /> {/* Route for marine industry */}
                        <Route path='/industries/automotive' element={<Automotive />} /> {/* Route for automotive industry */}
                        <Route path='/industries/mobile' element={<Mobile />} /> {/* Route for mobile industry */}
                        <Route path='/:username/info' element={<UserInfo />} /> {/* Route for user info with dynamic username */}
                        <Route path='/demos' element={<Demos />} /> {/* Route for demos page */}
                        <Route path='/demos/iCandy' element={<ICandyDemo />} /> {/* Route for iCandy demo */}
                        <Route path='/cart/checkout/success/:sessionId' element={<CheckoutComplete />} /> {/* Route for checkout complete page with session ID */}
                    </Routes>
                </AnimatePresence>
            </UserContextProvider>
        </Elements>
    );
}

export default App; // Export the App component as default.
