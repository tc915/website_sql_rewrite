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
            <motion.div className={`pt-44 lg:pt-36 md:pt-36 sm:pt-32 xsm:pt-36 xxsm:pt-32 laptop:pt-32 smLaptop:pt-28 tablet:pt-12 flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col h-[200rem] tablet:h-[140rem] ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >
                <div className="w-1/2 xlMobile:w-[32rem] lgMobile:w-full mdMobile:w-full flex flex-col p-5 tablet:p-0 pl-24 lg:pl-16 md:pl-20 sm:pl-16 xsm:pl-16 xxsm:pl-14 smLaptop:pl-14 tablet:pl-6 xlMobile:pl-6 lgMobile:pl-4 mdMobile:pl-4">
                    <div className="h-[30rem]">
                        <h1 className="text-transparent font-md text-8xl sm:text-[5rem] xsm:text-[5rem] xxsm:text-7xl laptop:text-7xl smLaptop:text-6xl tablet:text-4xl xlMobile:text-7xl lgMobile:text-6xl mdMobile:text-6xl ml-20 laptop:ml-0 smLaptop:ml-0 tablet:ml-12 xlMobile:ml-6 lgMobile:ml-6 mdMobile:ml-6 pt-20 bg-gradient-to-r from-[#facc22] to-[#FF7F11] inline-block bg-clip-text font-ruda">Services</h1>
                        <p className={`mt-6 font-shanti px-20 xsm:pl-20 xxsm:pr-6 laptop:px-0 smLaptop:px-0 smLaptop:pr-10 tablet:px-12 xlMobile:px-6 lgMobile:px-6 mdMobile:px-6 text-2xl xxsm:text-xl laptop:text-lg smLaptop:text-lg tablet:text-[1rem] tablet:leading-[1.5rem] xlMobile:text-2xl lgMobile:text-xl mdMobile:text-xl ${darkMode ? 'text-white' : 'text-black'}`}>
                            Interactive Technologies, Inc. is a  hub for production and development services, offering a wide array of solutions from initial concept to final product delivery. We excel in transforming ideas into reality with our state-of-the-art design, engineering, and manufacturing capabilities. With a commitment to innovation and quality, we empower our clients to achieve excellence in their respective markets.</p>
                    </div>
                    <div className="w-full h-[45rem] md:h-[47rem] laptop:h-[52rem] smLaptop:h-[50rem] tablet:h-[30rem] xlMobile:h-[54rem] p-24 sm:p-20 xsm:p-16 xxsm:p-16 laptop:p-14 smLaptop:p-10 tablet:p-6 xlMobile:p-6 xlMobile:px-10 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative xl:mt-[4rem] lg:mt-[8rem] md:mt-[10rem] sm:mt-[12rem] xsm:mt-[14rem] xxsm:mt-24 smLaptop:mt-14 xlMobile:mt-32 lgMobile:mt-10 mdMobile:mt-24">
                        <h2 className="text-7xl sm:text-6xl xsm:text-6xl xxsm:text-6xl laptop:text-5xl smLaptop:text-4xl tablet:text-2xl xlMobile:text-5xl lgMobile:text-2xl mdMobile:text-2xl font-md tracking-widest font-hind">Enclosure Design</h2>
                        <p className="text-white mt-14 text-xl smLaptop:text-xl tablet:text-sm xlMobile:text-2xl lgMobile:text-lg mdMobile:text-lg font-shanti">
                            Mechanical enclosure design specializes in creating robust and aesthetically pleasing housings for our diverse range of products. We prioritize functionality and durability, ensuring each design meets the specific needs of our clients while adhering to the highest standards of safety and quality. Our enclosures are engineered to protect and enhance the performance of the components they house, reflecting our commitment to excellence and innovation in every product we deliver.</p>
                        <Link to={'/services/enclosure-design'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl tablet:text-lg xlMobile:text-3xl px-10 tablet:px-6 py-1 font-hind text-[#FF7F11] border-2 border-[#FF7F11] rounded-full"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[34rem] xl:h-[36rem] lg:h-[38rem] md:h-[45rem] sm:h-[48rem] xsm:h-[50rem] xxsm:h-[50rem] laptop:h-[55rem] smLaptop:h-[45rem] tablet:h-[30rem] xlMobile:h-[52rem] lgMobile:h-[45rem] mdMobile:h-[45rem] mt-10 p-24 sm:p-20 xsm:p-20 xxsm:p-16 laptop:p-14 smLaptop:p-10 tablet:p-6 xlMobile:p-6 xlMobile:px-10 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-5xl laptop:text-4xl smLaptop:text-4xl tablet:text-2xl xlMobile:text-4xl lgMobile:text-2xl mdMobile:text-2xl font-md tracking-widest font-hind">Garmin / Simrad Custom GUI</h2>
                        <p className="text-white mt-10 text-xl tablet:text-sm xlMobile:text-2xl lgMobile:text-lg mdMobile:text-lg font-shanti">
                            We take pride in offering custom Graphical User Interface (GUI) solutions for Garmin and Simrad devices. Our tailored interfaces are designed to enhance user experience, providing intuitive navigation and seamless operation. We focus on delivering clear, user-friendly layouts that integrate the latest features and functionalities, ensuring that every interaction with your Garmin or Simrad device is both enjoyable and efficient. Choose us for a personalized touch that sets your marine electronics apart.</p>
                        <Link to={'/services/custom-GUI'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl tablet:text-lg xlMobile:text-3xl px-10 tablet:px-6 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full font-hind"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[38rem] md:h-[42rem] sm:h-[50rem] xsm:h-[50rem] xxsm:h-[50rem] laptop:h-[45rem] smLaptop:h-[42rem] tablet:h-[30rem] xlMobile:h-[48rem] mt-10 p-24 sm:p-20 xxsm:p-16 laptop:p-14 smLaptop:p-10 tablet:p-6 xlMobile:p-6 xlMobile:px-10 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-5xl laptop:text-4xl smLaptop:text-4xl tablet:text-2xl xlMobile:text-5xl lgMobile:text-2xl mdMobile:text-2xl font-md tracking-widest font-hind">PCB / Electrical Design</h2>
                        <p className="text-white mt-10 text-2xl laptop:text-xl smLaptop:text-xl tablet:text-sm xlMobile:text-2xl lgMobile:text-lg mdMobile:text-lg font-shanti">
                            Our PCB and Electrical Design services are at the forefront of innovation, delivering high-quality, precision-engineered circuitry tailored to the specific needs of each product. We emphasize compact, efficient designs that maximize functionality while minimizing space, ensuring our clients receive the most advanced and reliable electronic components.</p>
                        <Link to={'/services/electrical-design'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl tablet:text-lg xlMobile:text-3xl px-10 tablet:px-6 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full font-hind"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                </div>
                <div className="w-1/2 smLaptop:mt-14 tablet:mt-12 xlMobile:w-[30.8rem] lgMobile:w-full mdMobile:w-full p-5 pr-24 smLaptop:pr-14 tablet:pr-6 xlMobile:pr-0 lgMobile:pr-6 mdMobile:pr-6">
                    <div className="w-full h-[50rem] tablet:h-[35rem] xlMobile:h-[55rem] p-24 sm:p-20 xsm:p-20 xxsm:p-16 laptop:p-14 smLaptop:p-10 tablet:p-6 xlMobile:p-6 xlMobile:px-10 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative xxsm:mt-10">
                        <h2 className="text-9xl md:text-8xl sm:text-8xl xsm:text-8xl xxsm:text-8xl laptop:text-7xl smLaptop:text-5xl tablet:text-5xl xlMobile:text-7xl lgMobile:text-5xl mdMobile:text-5xl font-thin tracking-widest font-hind">R&D</h2>
                        <p className="text-white mt-14 text-xl tablet:text-sm xlMobile:text-2xl lgMobile:text-lg mdMobile:text-lg font-shanti">
                            Our Research and Development (R&D) is the driving force behind our innovative production solutions. We’re dedicated to exploring new frontiers in technology and materials to enhance the quality and efficiency of our products. Our R&D efforts focus on sustainable practices, ensuring that we not only meet but exceed industry standards while fostering environmental stewardship. Partner with us for products that are at the cutting edge of the market, crafted with expertise and a vision for the future.</p>
                        <Link to={'/services/research-and-development'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl tablet:text-lg xlMobile:text-3xl px-10 tablet:px-6 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full font-hind"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[27.5rem] xl:h-[32rem] lg:h-[35rem] md:h-[42rem] sm:h-[42rem] xsm:h-[48rem] xxsm:h-[45rem] laptop:h-[48rem] smLaptop:h-[48rem] tablet:h-[35rem] xlMobile:h-[52rem] lgMobile:h-[42rem] mdMobile:h-[42rem] mt-10 p-24 sm:p-20 xsm:p-20 xxsm:p-16 laptop:p-14 smLaptop:p-10 tablet:p-6 xlMobile:p-6 xlMobile:px-10 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-4xl md:text-5xl sm:text-5xl xsm:text-5xl xxsm:text-5xl tablet:text-2xl xlMobile:text-5xl lgMobile:text-2xl mdMobile:text-2xl font-md tracking-widest font-hind">Embedded Firmware</h2>
                        <p className="text-white font-shanti mt-8 text-xl tablet:text-sm xlMobile:text-2xl mdMobile:mb-10">
                            Embedded firmware is the heartbeat of modern devices, meticulously crafted to ensure seamless performance and reliability. It’s engineered to provide the precision and control needed for optimal functionality, with a focus on real-time processing and responsiveness. Our firmware solutions are customizable, scalable, and designed to meet the rigorous demands of various applications, ensuring your products are not just smart, but also secure and future-ready.</p>
                        <Link to={'/services/embedded-firmware'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl tablet:text-lg xlMobile:text-3xl px-10 tablet:px-6 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full font-hind"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                    <div className="w-full h-[45rem] xsm:h-[50rem] xxsm:h-[52rem] laptop:h-[45rem] tablet:h-[30rem] xlMobile:h-[45rem] lgMobile:h-[40rem] mdMobile:h-[40rem] mt-10 p-24 sm:p-20 xsm:p-20 xxsm:p-16 laptop:p-14 smLaptop:p-10 tablet:p-6 xlMobile:p-6 xlMobile:px-10 lgMobile:p-6 mdMobile:p-6 text-white bg-[#1e1e1e] flex flex-col justify-center relative">
                        <h2 className="text-7xl lg:text-[3.6rem] md:text-[3.5rem] sm:text-5xl xsm:text-5xl xxsm:text-5xl laptop:text-4xl smLaptop:text-4xl tablet:text-2xl xlMobile:text-5xl lgMobile:text-2xl mdMobile:text-2xl font-md tracking-widest font-hind">App Development</h2>
                        <p className="text-white mt-10 text-2xl laptop:text-xl smLaptop:text-xl tablet:text-sm lgMobile:text-lg mdMobile:text-lg font-shanti">
                            Phone App Development is dedicated to crafting exceptional mobile applications that cater to the unique needs of our clients. We combine sleek design with powerful functionality, creating apps that offer a seamless and engaging user experience. With a focus on cross-platform compatibility and user-centric interfaces, our apps are tools meant for convenience and connectivity.</p>
                        <Link to={'/services/app-development'}>
                            <motion.button className="absolute bottom-8 right-8 text-2xl tablet:text-lg xlMobile:text-3xl px-10 tablet:px-6 py-1 text-[#FF7F11] border-2 border-[#FF7F11] rounded-full font-hind"
                                variants={buttonVariants}
                                whileHover='hover'
                                whileTap='click'
                            >Learn More</motion.button>
                        </Link>
                    </div>
                </div>
                <div className="xlMobile:block xlMobile:mt-16 lgMobile:block mdMobile:block hidden">
                    <Footer />
                </div>
            </motion.div>
            <div className="xlMobile:hidden lgMobile:hidden mdMobile:hidden block">
                <Footer />
            </div>
        </>
    );
}

export default Services;