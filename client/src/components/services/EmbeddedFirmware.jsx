import { useLocation } from "react-router";
import ServicesNav from "../../partials/ServicesNav";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../../UserContext";
import Footer from "../../partials/Footer";

const buttonVariants = {
    hover: {
        scale: [1, 0.95, 1],
        transition: {
            duration: 1,
            repeat: Infinity
        }
    }
}

const EmbeddedFirmware = () => {
    const { darkMode, setDarkMode } = useContext(UserContext);
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className={`pt-44 tablet:pt-24 ${darkMode ? 'text-white bg-[#131313]' : 'text-black bg-white'}`}>
            <div className="lgMobile:hidden mdMobile:hidden">
                <ServicesNav location={location} />
            </div>
            <div className="flex lgMobile:flex-col mdMobile:flex-col h-[36rem] tablet:h-[25rem]">
                <div className="w-1/2 lgMobile:w-full mdMobile:w-full">
                    <p className="mt-16 tablet:mt-10 ml-[15rem] tablet:ml-12 lgMobile:ml-6 mdMobile:ml-6 tracking-[0.3em] text-white bg-[#FF7F11] w-fit px-2 tablet:text-[1rem]">SERVICES</p>
                    <h1 className="text-6xl tablet:text-3xl lgMobile:text-3xl mdMobile:text-3xl mt-4 ml-[15rem] tablet:ml-12 lgMobile:ml-6 mdMobile:ml-6">Embedded Firmware</h1>
                    <p className="ml-[15rem] tablet:ml-12 lgMobile:ml-6 mdMobile:ml-6 mt-4 text-xl tablet:text-sm lgMobile:text-lg mdMobile:text-lg pr-16 tablet:pr-6 lgMobile:pr-6 mdMobile:pr-6">
                        Embedded firmware is the heartbeat of modern devices, meticulously crafted to ensure seamless performance and reliability. It’s engineered to provide the precision and control needed for optimal functionality, with a focus on real-time processing and responsiveness. Our firmware solutions are customizable, scalable, and designed to meet the rigorous demands of various applications, ensuring your products are not just smart, but also secure and future-ready.
                    </p>
                    <Link to={'/contact'}>
                        <motion.button className="ml-[15rem] tablet:ml-12 lgMobile:ml-6 mdMobile:ml-6 mt-6 px-16 tablet:px-10 py-4 tablet:py-2 bg-[#FF7F11] text-white rounded-full text-[1.2em] tablet:text-sm font-semibold"
                            variants={buttonVariants}
                            whileHover="hover"
                        >Start a Project</motion.button>
                    </Link>
                </div>
                <div className="w-1/2 flex justify-center items-center">
                    <div className="bg-black w-2/3 tablet:w-full h-2/3 tablet:h-[20rem] mr-24 tablet:mr-12"></div>
                </div>
            </div>
            <div className="w-full h-[36rem] mdMobile:h-[42rem] mt-[6rem] tablet:mt-20 mb-[3rem] lgMobile:mb-[20rem] mdMobile:mb-[20rem] flex lgMobile:flex-col mdMobile:flex-col">
                <div className="w-1/2 lgMobile:w-full mdMobile:w-full flex justify-center items-center">
                    <div className="bg-black w-2/3 tablet:w-full lgMobile:w-full mdMobile:w-full h-2/3 tablet:h-[20rem] lgMobile:h-[15rem] mdMobile:h-[15rem] ml-24 tablet:ml-12 lgMobile:ml-6 mdMobile:ml-6 lgMobile:mr-6 mdMobile:mr-6 mb-10"></div>
                </div>
                <div className="w-1/2 lgMobile:w-full mdMobile:w-full">
                    <h1 className="text-5xl tablet:text-3xl lgMobile:text-3xl mdMobile:text-3xl mt-24 mr-[15rem] tablet:mr-12 lgMobile:mr-6 mdMobile:mr-6 ml-10 lgMobile:ml-6 mdMobile:ml-6">The Value of Embedded Firmware</h1>
                    <p className="mr-[10rem] tablet:mr-12 lgMobile:mr-6 mdMobile:mr-6 mt-6 text-xl tablet:text-sm lgMobile:text-lg mdMobile:text-lg pr-16 tablet:pr-0 lgMobile:pr-6 mdMobile:pr-6 ml-10 lgMobile:ml-6 mdMobile:ml-6">
                        Our Research and Development (R&D) is the driving force behind our innovative production solutions. We’re dedicated to exploring new frontiers in technology and materials to enhance the quality and efficiency of our products. Our R&D efforts focus on sustainable practices, ensuring that we not only meet but exceed industry standards while fostering environmental stewardship. Partner with us for products that are at the cutting edge of the market, crafted with expertise and a vision for the future.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EmbeddedFirmware;