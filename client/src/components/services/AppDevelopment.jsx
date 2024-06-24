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

const AddDevelopment = () => {
    const { darkMode, setDarkMode } = useContext(UserContext);
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className={`pt-44 ${darkMode ? 'text-white bg-[#131313]' : 'text-black bg-white'}`}>
            <ServicesNav location={location} />
            <div className="flex h-[36rem]">
                <div className="w-1/2">
                    <p className="mt-16 ml-[15rem] tracking-[0.3em] text-white bg-[#FF7F11] w-fit px-2">SERVICES</p>
                    <h1 className="text-6xl mt-4 ml-[15rem]">App Development</h1>
                    <p className="ml-[15rem] mt-4 text-xl pr-16">
                        Phone App Development is dedicated to crafting exceptional mobile applications that cater to the unique needs of our clients. We combine sleek design with powerful functionality, creating apps that offer a seamless and engaging user experience. With a focus on cross-platform compatibility and user-centric interfaces, our apps are tools meant for convenience and connectivity.
                    </p>
                    <Link to={'/contact'}>
                        <motion.button className="ml-[15rem] mt-6 px-16 py-4 bg-[#FF7F11] text-white rounded-full text-[1.2em] font-semibold"
                            variants={buttonVariants}
                            whileHover="hover"
                        >Start a Project</motion.button>
                    </Link>
                </div>
                <div className="w-1/2 flex justify-center items-center">
                    <div className="bg-black w-2/3 h-2/3 mr-24"></div>
                </div>
            </div>
            <div className="w-full h-[36rem] mt-[6rem] mb-[3rem] flex">
                <div className="w-1/2 flex justify-center items-center">
                    <div className="bg-black w-2/3 h-2/3 ml-24 mb-10"></div>
                </div>
                <div className="w-1/2">
                    <h1 className="text-6xl mt-20 mr-[15rem] ml-10">The Value of App Development</h1>
                    <p className="mr-[10rem] mt-6 text-xl pr-16 ml-10">
                        Our Research and Development (R&D) is the driving force behind our innovative production solutions. We’re dedicated to exploring new frontiers in technology and materials to enhance the quality and efficiency of our products. Our R&D efforts focus on sustainable practices, ensuring that we not only meet but exceed industry standards while fostering environmental stewardship. Partner with us for products that are at the cutting edge of the market, crafted with expertise and a vision for the future.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AddDevelopment;