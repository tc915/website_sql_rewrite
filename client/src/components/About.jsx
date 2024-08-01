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
            <div className={`fixed top-0 left-0 z-[99] w-full xlMobile:w-[33rem] h-screen bg-black/50 flex justify-center items-center ${aboutPageEmailSentPopup ? '' : 'hidden'}`}>
                <div className="bg-[#131313] border-4 border-[#FF7F11] flex flex-col justify-center items-center w-[20rem] h-[10rem] rounded-xl">
                    <p className="text-white font-semibold text-2xl">Email Sent</p>
                    <button className="bg-white px-6 rounded-lg py-2 font-semibold text-xl mt-4"
                        onClick={() => setAboutPageEmailSentPopup(false)}
                    >Ok</button>
                </div>
            </div>
            <motion.div className={`pt-44 tablet:pt-32 ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >
                <div className={`w-full h-[41rem] tablet:h-[32rem] flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col ${darkMode ? 'text-white' : 'text-black'}`}>
                    <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full">
                        <h1 className="font-[900] font-ruda text-7xl tablet:text-4xl xlMobile:text-6xl lgMobile:text-4xl mdMobile:text-4xl pl-44 tablet:pl-12 xlMobile:pl-12 lgMobile:pl-10 mdMobile:pl-10 mt-24 tablet:mt-12">About Us</h1>
                        <p className="pl-44 tablet:pl-12 xlMobile:pl-12 tablet:leading-[1.75rem] lgMobile:pl-10 mdMobile:pl-10 pr-20 tablet:pr-10 xlMobile:pr-12 lgMobile:pr-10 mdMobile:pr-10 text-2xl tablet:text-[1rem] mt-6 font-shanti">Interactive Technologies, Inc. is always willing to
                            push the boundaries and experiment with
                            cutting edge technology. We make simple ideas
                            into full-fledged products that bring forth a
                            customer's vision to completeion.</p>
                        <Link to={'/contact'}>
                            <motion.button className="font-hind px-6 py-2 rounded-full text-2xl tablet:text-lg ml-44 tablet:ml-12 xlMobile:ml-12 lgMobile:ml-10 mdMobile:ml-10 mt-6 xlMobile:mt-10 bg-[#f77d1b] text-white font-semibold"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="click"
                            >Contact Us</motion.button></Link>
                    </div>
                    <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full flex justify-center items-center">
                        <div className="bg-black w-3/4 tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full h-2/3 mb-32 mr-16 tablet:mr-12 xlMobile:ml-12 lgMobile:ml-8 mdMobile:ml-8 lgMobile:mr-8 mdMobile:mr-8 tablet:h-[20rem] xlMobile:h-[15rem] lgMobile:h-[15rem] mdMobile:h-[15rem] tablet:-mt-0 xlMobile:mt-20 lgMobile:mt-16 mdMobile:mt-16"></div>
                    </div>
                </div>
                <div className={`w-full h-[41rem] flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col ${darkMode ? 'text-white' : 'text-black'}`}>
                    <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full flex justify-center items-center">
                        <div className="bg-black w-2/3 tablet:w-[85%] h-2/3 tablet:h-[20rem] mb-32"></div>
                    </div>
                    <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full">
                        <h1 className="font-[900] text-7xl tablet:text-4xl xlMobile:text-6xl lgMobile:text-4xl mdMobile:text-4xl pr-44 tablet:pr-12 xlMobile:pr-12 lgMobile:pr-0 mdMobile:pr-0 xlMobile:pl-12 lgMobile:pl-10 mdMobile:pl-10 mt-36 font-ruda">History</h1>
                        <p className="pr-44 tablet:pr-12 xlMobile:pr-12 lgMobile:pr-10 mdMobile:pr-10 xlMobile:pl-12 lgMobile:pl-10 mdMobile:pl-10 text-2xl tablet:text-[1rem] mt-6 tablet:leading-[1.75rem] font-shanti">Interactive Technologies, Inc. is always willing to
                            push the boundaries and experiment with
                            cutting edge technology. We make simple ideas
                            into full-fledged products that bring forth a
                            customer's vision to completeion.</p>
                    </div>
                </div>
                <div className="xlMobile:-mt-32 lgMobile:mt-36 mdMobile:mt-36">
                    <Contact inAboutPage={inAboutPage} setAboutPageEmailSentPopup={setAboutPageEmailSentPopup} />
                </div>
            </motion.div >
        </>
    );
}

export default About;