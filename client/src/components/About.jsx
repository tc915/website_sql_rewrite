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

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, []);

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
            <motion.div className={`pt-44 sm:pt-36 xsm:pt-36 tablet:pt-32 ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >
                <div className={`w-full h-[41rem] sm:h-[35rem] xsm:h-[35rem] xxsm:h-[35rem] laptop:h-[35rem] smLaptop:h-[30rem] tablet:h-[32rem] flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col ${darkMode ? 'text-white' : 'text-black'}`}>
                    <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full">
                        <h1 className="font-[900] font-ruda text-7xl xsm:text-6xl xxsm:text-6xl laptop:text-6xl smLaptop:text-5xl tablet:text-4xl xlMobile:text-6xl lgMobile:text-4xl mdMobile:text-4xl pl-44 xsm:pl-36 xxsm:pl-32 laptop:pl-24 smLaptop:pl-24 tablet:pl-12 xlMobile:pl-12 lgMobile:pl-10 mdMobile:pl-10 mt-24 xxsm:mt-10 laptop:mt-14 smLaptop:mt-10 tablet:mt-12">About Us</h1>
                        <p className="pl-44 xsm:pl-36 xxsm:pl-32 laptop:pl-24 smLaptop:pl-24 tablet:pl-12 xlMobile:pl-12 tablet:leading-[1.75rem] lgMobile:pl-10 mdMobile:pl-10 pr-20 tablet:pr-10 xlMobile:pr-12 lgMobile:pr-10 mdMobile:pr-10 text-2xl laptop:text-xl smLaptop:text-xl tablet:text-[1rem] mt-6 font-shanti">Interactive Technologies, Inc. is always willing to
                            push the boundaries and experiment with
                            cutting edge technology. We make simple ideas
                            into full-fledged products that bring forth a
                            customer's vision to completeion.</p>
                        <Link to={'/contact'}>
                            <motion.button className="font-hind px-6 py-2 rounded-full text-2xl tablet:text-lg ml-44 xsm:ml-36 xxsm:ml-32 laptop:ml-24 smLaptop:ml-24 tablet:ml-12 xlMobile:ml-12 lgMobile:ml-10 mdMobile:ml-10 mt-6 xlMobile:mt-10 bg-[#f77d1b] text-white font-semibold"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="click"
                            >Contact Us</motion.button></Link>
                    </div>
                    <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full flex justify-center items-center sm:pr-10">
                        <div className="bg-black w-3/4 sm:w-full sm:mt-32 xsm:w-full xsm:mt-28 xxsm:w-full laptop:w-full smLaptop:w-full tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full h-2/3 mb-32 mr-16 smLaptop:mr-24 tablet:mr-12 xlMobile:ml-12 lgMobile:ml-8 mdMobile:ml-8 lgMobile:mr-8 mdMobile:mr-8 smLaptop:h-[18rem] tablet:h-[20rem] xlMobile:h-[15rem] lgMobile:h-[15rem] mdMobile:h-[15rem] smLaptop:mt-14 tablet:-mt-0 xlMobile:mt-20 lgMobile:mt-16 mdMobile:mt-16"></div>
                    </div>
                </div>
                <div className={`w-full h-[41rem] flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col ${darkMode ? 'text-white' : 'text-black'}`}>
                    <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full flex justify-center items-center">
                        <div className="bg-black w-2/3 sm:w-full xsm:w-full xxsm:w-full laptop:w-full sm:ml-28 xsm:ml-28 xxsm:ml-24 laptop:ml-24 smLaptop:w-full smLaptop:ml-24 tablet:w-[85%] h-2/3 sm:h-[25rem] xsm:h-[24rem] xxsm:h-[24rem] laptop:h-[22rem] smLaptop:h-[18rem] tablet:h-[20rem] mb-32"></div>
                    </div>
                    <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full sm:pl-12 xsm:pl-12 sm:-mt-6 xsm:-mt-10 xxsm:pl-14 laptop:pl-14 smLaptop:pl-14">
                        <h1 className="font-[900] text-7xl xxsm:text-6xl laptop:text-6xl smLaptop:text-5xl tablet:text-4xl xlMobile:text-6xl lgMobile:text-4xl mdMobile:text-4xl pr-44 laptop:pr-24 smLaptop:pr-24 tablet:pr-12 xlMobile:pr-12 lgMobile:pr-0 mdMobile:pr-0 xlMobile:pl-12 lgMobile:pl-10 mdMobile:pl-10 mt-36 font-ruda">History</h1>
                        <p className="pr-44 xxsm:pr-32 laptop:pr-24 smLaptop:pr-24 tablet:pr-12 xlMobile:pr-12 lgMobile:pr-10 mdMobile:pr-10 xlMobile:pl-12 lgMobile:pl-10 mdMobile:pl-10 text-2xl xxsm:leading-6 laptop:text-xl smLaptop:text-xl tablet:text-[1rem] mt-6 tablet:leading-[1.75rem] font-shanti">Interactive Technologies, Inc. is always willing to
                            push the boundaries and experiment with
                            cutting edge technology. We make simple ideas
                            into full-fledged products that bring forth a
                            customer's vision to completeion.</p>
                    </div>
                </div>
                <div className="laptop:-mt-44 smLaptop:-mt-44 xlMobile:-mt-32 lgMobile:mt-36 mdMobile:mt-36">
                    <Contact inAboutPage={inAboutPage} setAboutPageEmailSentPopup={setAboutPageEmailSentPopup} />
                </div>
            </motion.div >
        </>
    );
}

export default About;