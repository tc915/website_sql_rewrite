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
            <motion.div className={`pt-44 tablet:pt-12 flex lgMobile:flex-col mdMobile:flex-col h-[200rem] ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >
                <div className="w-1/2 lgMobile:w-full mdMobile:w-full flex flex-col p-5 tablet:p-0 pl-24 tablet:pl-6 lgMobile:pl-4 mdMobile:pl-4">
                    <div className="h-[35rem]">
                        <h1 className="text-transparent font-md text-8xl tablet:text-4xl lgMobile:text-6xl mdMobile:text-6xl ml-20 lgMobile:ml-6 mdMobile:ml-6 pt-20 bg-gradient-to-r from-[#facc22] to-[#FF7F11] inline-block bg-clip-text">Services</h1>
                        <p className={`mt-6 px-20 lgMobile:px-6 mdMobile:px-6 text-2xl tablet:text-sm lgMobile:text-xl mdMobile:text-xl ${darkMode ? 'text-white' : 'text-black'}`}>
                            Interactive Technologies, Inc. is a  hub for production and development services, offering a wide array of solutions from initial concept to final product delivery. We excel in transforming ideas into reality with our state-of-the-art design, engineering, and manufacturing capabilities. With a commitment to innovation and quality, we empower our clients to achieve excellence in their respective markets.</p>
                    </div>
                    <div className="w-full h-[45rem] tablet:h-[30rem] p-24 tablet:p-6 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative lgMobile:mt-10 mdMobile:mt-10">
                        <h2 className="text-7xl tablet:text-2xl lgMobile:text-2xl mdMobile:text-2xl font-md tracking-widest">Enclosure Design</h2>
                        <p className="text-white mt-14 text-xl tablet:text-sm lgMobile:text-lg mdMobile:text-lg">
                            Mechanical enclosure design specializes in creating robust and aesthetically pleasing housings for our diverse range of products. We prioritize functionality and durability, ensuring each design meets the specific needs of our clients while adhering to the highest standards of safety and quality. Our enclosures are engineered to protect and enhance the performance of the components they house, reflecting our commitment to excellence and innovation in every product we deliver.</p>
                        <Link to={'/services/enclosure-design'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl tablet:text-lg px-10 tablet:px-6 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[34rem] tablet:h-[30rem] lgMobile:h-[45rem] mdMobile:h-[45rem] mt-10 p-24 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-5xl tablet:text-2xl lgMobile:text-2xl mdMobile:text-2xl font-md tracking-widest">Garmin / Simrad Custom GUI</h2>
                        <p className="text-white mt-10 text-xl tablet:text-sm lgMobile:text-lg mdMobile:text-lg">
                            We take pride in offering custom Graphical User Interface (GUI) solutions for Garmin and Simrad devices. Our tailored interfaces are designed to enhance user experience, providing intuitive navigation and seamless operation. We focus on delivering clear, user-friendly layouts that integrate the latest features and functionalities, ensuring that every interaction with your Garmin or Simrad device is both enjoyable and efficient. Choose us for a personalized touch that sets your marine electronics apart.</p>
                        <Link to={'/services/custom-GUI'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl tablet:text-lg px-10 tablet:px-6 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[38rem] mt-10 p-24 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-5xl lgMobile:text-2xl mdMobile:text-2xl font-md tracking-widest">PCB / Electrical Design</h2>
                        <p className="text-white mt-10 text-2xl lgMobile:text-lg mdMobile:text-lg">
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
                <div className="w-1/2 lgMobile:w-full mdMobile:w-full p-5 pr-24 lgMobile:pr-6 mdMobile:pr-6">
                    <div className="w-full h-[50rem] p-24 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-9xl lgMobile:text-5xl mdMobile:text-5xl font-thin tracking-widest">R&D</h2>
                        <p className="text-white mt-14 text-xl lgMobile:text-lg mdMobile:text-lg">
                            Our Research and Development (R&D) is the driving force behind our innovative production solutions. We’re dedicated to exploring new frontiers in technology and materials to enhance the quality and efficiency of our products. Our R&D efforts focus on sustainable practices, ensuring that we not only meet but exceed industry standards while fostering environmental stewardship. Partner with us for products that are at the cutting edge of the market, crafted with expertise and a vision for the future.</p>
                        <Link to={'/services/research-and-development'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl px-10 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[27.5rem] lgMobile:h-[42rem] mdMobile:h-[42rem] mt-10 p-24 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-4xl lgMobile:text-2xl mdMobile:text-2xl font-md tracking-widest">Embedded Firmware</h2>
                        <p className="text-white mt-8 text-lg mdMobile:mb-10">
                            Embedded firmware is the heartbeat of modern devices, meticulously crafted to ensure seamless performance and reliability. It’s engineered to provide the precision and control needed for optimal functionality, with a focus on real-time processing and responsiveness. Our firmware solutions are customizable, scalable, and designed to meet the rigorous demands of various applications, ensuring your products are not just smart, but also secure and future-ready.</p>
                        <Link to={'/services/embedded-firmware'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl px-10 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[45rem] lgMobile:h-[40rem] mdMobile:h-[40rem] mt-10 p-24 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-7xl lgMobile:text-2xl mdMobile:text-2xl font-md tracking-widest">App Development</h2>
                        <p className="text-white mt-10 text-2xl lgMobile:text-lg mdMobile:text-lg">
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
                <div className="lgMobile:block mdMobile:block hidden">
                    <Footer />
                </div>
            </motion.div>
            <div className="lgMobile:hidden mdMobile:hidden block">
                <Footer />
            </div>
        </>
    );
}

export default Services;