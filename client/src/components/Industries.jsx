import { motion, useMotionValue, useTransform } from "framer-motion";
import Footer from "../partials/Footer";
import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

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

const imgVariants = {
    hidden: {
        opacity: 0.6
    },
    hover: {
        opacity: 1
    }
}


const Industries = () => {

    const { darkMode, setDarkMode } = useContext(UserContext);

    const x1 = useMotionValue(0);
    const y1 = useMotionValue(0);

    const x2 = useMotionValue(0);
    const y2 = useMotionValue(0);

    const x3 = useMotionValue(0);
    const y3 = useMotionValue(0);

    const handleMouseMove1 = (event) => {
        x1.set(event.clientX / -25);
        y1.set(event.clientY / -25);
    };

    const handleMouseMove2 = (event) => {
        x2.set(event.clientX / -25);
        y2.set(event.clientY / -25);
    };

    const handleMouseMove3 = (event) => {
        x3.set(event.clientX / -25);
        y3.set(event.clientY / -25);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return (
        <motion.div className={`pt-44 xlMobile:pt-64 lgMobile:pt-56 flex flex-col items-center overflow-x-hidden ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
        >
            <div className="w-3/4 h-auto grid grid-cols-1 gap-4 xlMobile:gap-10 mb-44">
                <Link to={'/industries/marine'}>
                    <div onMouseMove={handleMouseMove1} className="h-[24rem] flex justify-center items-center cursor-pointer overflow-hidden relative">
                        <motion.img src="marine_service_unsplash.jpg" alt="Boat on lake" className="absolute h-full w-full object-cover min-h-[120%] min-w-[120%]"
                            style={{ x: x1, y: y1 }}
                            variants={imgVariants}
                            initial="hidden"
                            whileHover="hover"
                        />
                        <p className="z-1 absolute text-5xl xlMobile:font-[700] font-semibold text-white pointer-events-none font-ruda">Marine</p>
                    </div>
                </Link>
                <Link to={'/industries/automotive'}>
                    <div onMouseMove={handleMouseMove2} className="h-[24rem] flex justify-center items-center cursor-pointer overflow-hidden relative">
                        <motion.img src="automotive_service_unsplash.jpg" alt="Boat on lake" className="absolute h-full w-full object-cover min-h-[120%] min-w-[120%]"
                            style={{ x: x2, y: y2 }}
                            variants={imgVariants}
                            initial="hidden"
                            whileHover="hover"
                        />
                        <p className="z-1 absolute text-5xl xlMobile:font-[700] font-semibold text-white pointer-events-none font-ruda">Automotive</p>
                    </div>
                </Link>
                <Link to={'/industries/mobile'}>
                    <div onMouseMove={handleMouseMove3} className="h-[24rem] flex justify-center items-center cursor-pointer overflow-hidden relative">
                        <motion.img src="appDevelopment_service_unsplash.jpg" alt="Boat on lake" className="absolute h-full w-full object-cover min-h-[120%] min-w-[120%]"
                            style={{ x: x3, y: y3 }}
                            variants={imgVariants}
                            initial="hidden"
                            whileHover="hover"
                        />
                        <p className="z-1 absolute text-5xl xlMobile:font-[700] font-semibold text-white pointer-events-none font-ruda">Mobile</p>
                    </div>
                </Link>

            </div>
            <Footer />
        </motion.div>
    );
}

export default Industries;