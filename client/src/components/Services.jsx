import { motion } from "framer-motion";
import Footer from "../partials/Footer";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

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
        transform: 'translateY(3px)',
        color: '#fff'
    },
    click: {
        opacity: 0.5,
        transition: {
            duration: 0.1
        }
    }
}

const Services = () => {

    const { darkMode, setDarkMode } = useContext(UserContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <motion.div className={`pt-44 flex h-[200rem] ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >
                <div className="w-1/2 flex flex-col p-5 pl-24">
                    <div className="h-[35rem]">
                        <h1 className="text-transparent font-tmd text-8xl ml-20 pt-20 bg-gradient-to-r from-[#facc22] to-[#FF7F11] inline-block bg-clip-text">Services</h1>
                        <p className={`mt-6 px-20 text-2xl ${darkMode ? 'text-white' : 'text-black'}`}>
                            Interactive Technologies, Inc. is a  hub for production and development services, offering a wide array of solutions from initial concept to final product delivery. We excel in transforming ideas into reality with our state-of-the-art design, engineering, and manufacturing capabilities. With a commitment to innovation and quality, we empower our clients to achieve excellence in their respective markets.</p>
                    </div>
                    <div className="w-full h-[45rem] p-24 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-7xl font-md tracking-widest">Enclosure Design</h2>
                        <p className="text-white mt-14 text-xl">
                            Mechanical enclosure design specializes in creating robust and aesthetically pleasing housings for our diverse range of products. We prioritize functionality and durability, ensuring each design meets the specific needs of our clients while adhering to the highest standards of safety and quality. Our enclosures are engineered to protect and enhance the performance of the components they house, reflecting our commitment to excellence and innovation in every product we deliver.</p>
                        <Link to={'/services/enclosure-design'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl px-10 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[34rem] mt-10 p-24 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-5xl font-md tracking-widest">Garmin / Simrad Custom GUI</h2>
                        <p className="text-white mt-10 text-xl">
                            We take pride in offering custom Graphical User Interface (GUI) solutions for Garmin and Simrad devices. Our tailored interfaces are designed to enhance user experience, providing intuitive navigation and seamless operation. We focus on delivering clear, user-friendly layouts that integrate the latest features and functionalities, ensuring that every interaction with your Garmin or Simrad device is both enjoyable and efficient. Choose us for a personalized touch that sets your marine electronics apart.</p>
                        <Link to={'/services/custom-GUI'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl px-10 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[38rem] mt-10 p-24 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-5xl font-md tracking-widest">PCB / Electrical Design</h2>
                        <p className="text-white mt-10 text-2xl">
                            Our PCB and Electrical Design services are at the forefront of innovation, delivering high-quality, precision-engineered circuitry tailored to the specific needs of each product. We emphasize compact, efficient designs that maximize functionality while minimizing space, ensuring our clients receive the most advanced and reliable electronic components.</p>
                        <Link to={'/services/electrical-design'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl px-10 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                </div>
                <div className="w-1/2 p-5 pr-24">
                    <div className="w-full h-[50rem] p-24 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-9xl font-thin tracking-widest">R&D</h2>
                        <p className="text-white mt-14 text-xl">
                            Our Research and Development (R&D) is the driving force behind our innovative production solutions. We’re dedicated to exploring new frontiers in technology and materials to enhance the quality and efficiency of our products. Our R&D efforts focus on sustainable practices, ensuring that we not only meet but exceed industry standards while fostering environmental stewardship. Partner with us for products that are at the cutting edge of the market, crafted with expertise and a vision for the future.</p>
                        <Link to={'/services/research-and-development'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl px-10 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[27.5rem] mt-10 p-24 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-4xl font-md tracking-widest">Embedded Firmware</h2>
                        <p className="text-white mt-8 text-lg">
                            Embedded firmware is the heartbeat of modern devices, meticulously crafted to ensure seamless performance and reliability. It’s engineered to provide the precision and control needed for optimal functionality, with a focus on real-time processing and responsiveness. Our firmware solutions are customizable, scalable, and designed to meet the rigorous demands of various applications, ensuring your products are not just smart, but also secure and future-ready.</p>
                        <Link to={'/services/embedded-firmware'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl px-10 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[45rem] mt-10 p-24 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-7xl font-md tracking-widest">App Development</h2>
                        <p className="text-white mt-10 text-2xl">
                            Phone App Development is dedicated to crafting exceptional mobile applications that cater to the unique needs of our clients. We combine sleek design with powerful functionality, creating apps that offer a seamless and engaging user experience. With a focus on cross-platform compatibility and user-centric interfaces, our apps are tools meant for convenience and connectivity.</p>
                        <Link to={'/services/app-development'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl px-10 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                </div>
            </motion.div>
            <Footer />
        </>
    );
}

export default Services;