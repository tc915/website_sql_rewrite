import { motion } from "framer-motion";
import Footer from "../partials/Footer";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import Contact from "./Contact";

const fadeInVariants = {
    initial: {
        opacity: 0,
        transform: 'translateY(-5rem)'
    },
    animate: {
        opacity: 1,
        transform: 'translateY(0rem)',
        transition: {
            duration: 0.5
        }
    }
}

const buttonVariants = {
    hover: {
        transform: 'translateY(2px)',
        transition: {
            duration: 0.15
        }
    },
    click: {
        opacity: 0.5,
        transition: {
            duration: 0.1
        }
    }
}

const About = () => {

    const { darkMode, setDarkMode } = useContext(UserContext);

    const [inAboutPage, setInAboutPage] = useState(true);
    const [aboutPageEmailSentPopup, setAboutPageEmailSentPopup] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (aboutPageEmailSentPopup) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [aboutPageEmailSentPopup]);

    return (
        <>
            <div className={`fixed top-0 left-0 z-[99] w-full h-screen bg-black/50 ${aboutPageEmailSentPopup ? 'flex justify-center items-center' : 'hidden'}`}>
                <div className="bg-[#131313] border-4 border-[#FF7F11] flex flex-col justify-center items-center w-[20rem] h-[10rem] rounded-xl">
                    <p className="text-white font-semibold text-2xl">Email Sent</p>
                    <button className="bg-white px-6 rounded-lg py-2 font-semibold text-xl mt-4"
                        onClick={() => setAboutPageEmailSentPopup(false)}
                    >Ok</button>
                </div>
            </div>
            <motion.div className={`pt-44 ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >
                <div className={`w-full h-[41rem] flex lgMobile:flex-col ${darkMode ? 'text-white' : 'text-black'}`}>
                    <div className="w-1/2 lgMobile:w-full">
                        <h1 className="font-bold text-7xl lgMobile:text-4xl pl-44 lgMobile:pl-10 mt-24">About Us</h1>
                        <p className="pl-44 lgMobile:pl-10 pr-20 lgMobile:pr-10 text-2xl mt-6">Interactive Technologies, Inc. is always willing to
                            push the boundaries and experiment with
                            cutting edge technology. We make simple ideas
                            into full-fledged products that bring forth a
                            customer's vision to completeion.</p>
                        <Link to={'/contact'}>
                            <motion.button className="px-6 py-2 rounded-full text-2xl ml-44 lgMobile:ml-10 mt-6 bg-[#f77d1b] text-white font-semibold"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="click"
                            >Contact Us</motion.button></Link>
                    </div>
                    <div className="w-1/2 lgMobile:w-full flex justify-center items-center">
                        <div className="bg-black w-3/4 lgMobile:w-full h-2/3 mb-32 mr-16 lgMobile:ml-8 lgMobile:mr-8 lgMobile:h-[15rem] lgMobile:mt-16"></div>
                    </div>
                </div>
                <div className={`w-full h-[41rem] flex lgMobile:flex-col ${darkMode ? 'text-white' : 'text-black'}`}>
                    <div className="w-1/2 lgMobile:w-full flex justify-center items-center">
                        <div className="bg-black w-2/3 h-2/3 mb-32"></div>
                    </div>
                    <div className="w-1/2 lgMobile:w-full">
                        <h1 className="font-bold text-7xl lgMobile:text-4xl pr-44 lgMobile:pr-0 lgMobile:pl-10 mt-36">History</h1>
                        <p className="pr-44 lgMobile:pr-10 lgMobile:pl-10 text-2xl mt-6">Interactive Technologies, Inc. is always willing to
                            push the boundaries and experiment with
                            cutting edge technology. We make simple ideas
                            into full-fledged products that bring forth a
                            customer's vision to completeion.</p>
                    </div>
                </div>
                <div className="lgMobile:mt-36">
                    <Contact inAboutPage={inAboutPage} setAboutPageEmailSentPopup={setAboutPageEmailSentPopup} />
                </div>
            </motion.div >
        </>
    );
}

export default About;