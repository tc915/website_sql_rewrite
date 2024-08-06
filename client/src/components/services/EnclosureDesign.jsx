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

const EnclosureDesign = () => {
    const { darkMode, setDarkMode } = useContext(UserContext);
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`pt-44 md:pt-36 sm:pt-36 xsm:pt-36 xxsm:pt-36 laptop:pt-36 smLaptop:pt-36 tablet:pt-24 ${darkMode ? 'bg-[#131313] text-white' : 'bg-white text-black'}`}>
            <div className="xlMobile:hidden lgMobile:hidden mdMobile:hidden">
                <ServicesNav location={location} />
            </div>
            <div className="flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col h-[36rem] tablet:h-[25rem]">
                <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full">
                    <p className="mt-16 tablet:mt-10 ml-[15rem] sm:ml-[9.75rem] xsm:ml-36 xxsm:ml-36 laptop:ml-32 smLaptop:ml-24 tablet:ml-12 xlMobile:ml-12 lgMobile:ml-6 mdMobile:ml-6 tracking-[0.3em] text-white bg-[#FF7F11] w-fit px-2 tablet:text-[1rem] font-shanti">SERVICES</p>
                    <h1 className="text-6xl md:text-[3.2rem] sm:text-[3.2rem] xsm:text-5xl xxsm:text-5xl laptop:text-[2.6rem] smLaptop:text-4xl tablet:text-3xl xlMobile:text-5xl lgMobile:text-3xl mdMobile:text-3xl mt-4 xlMobile:mt-10 ml-[15rem] sm:ml-[9.75rem] xsm:ml-36 xxsm:ml-36 laptop:ml-32 smLaptop:ml-24 tablet:ml-12 xlMobile:ml-12 lgMobile:ml-6 mdMobile:ml-6 font-ruda">Enclosure Design</h1>
                    <p className="ml-[15rem] sm:ml-[9.75rem] xsm:ml-36 xxsm:ml-36 laptop:ml-32 smLaptop:ml-24 tablet:ml-12 xlMobile:ml-12 lgMobile:ml-6 mdMobile:ml-6 mt-4 text-xl xxsm:leading-6 laptop:text-[1rem] laptop:leading-5 smLaptop:text-[1rem] smLaptop:leading-6 tablet:text-sm xlMobile:text-2xl lgMobile:text-lg mdMobile:text-lg pr-16 tablet:pr-6 xlMobile:pr-12 lgMobile:pr-6 mdMobile:pr-6 font-shanti">
                        Mechanical enclosure design specializes in creating robust and aesthetically pleasing housings for our diverse range of products. We prioritize functionality and durability, ensuring each design meets the specific needs of our clients while adhering to the highest standards of safety and quality. Our enclosures are engineered to protect and enhance the performance of the components they house, reflecting our commitment to excellence and innovation in every product we deliver.
                    </p>
                    <Link to={'/contact'}>
                        <motion.button className="ml-[15rem] sm:ml-[9.75rem] xsm:ml-36 xxsm:ml-36 laptop:ml-32 smLaptop:ml-24 tablet:ml-12 xlMobile:ml-12 lgMobile:ml-6 mdMobile:ml-6 mt-6 xlMobile:mt-10 px-16 tablet:px-10 py-4 xxsm:py-2 laptop:py-2 smLaptop:py-2 tablet:py-2 bg-[#FF7F11] text-white rounded-full text-[1.2em] tablet:text-sm xlMobile:text-3xl font-semibold font-hind"
                            variants={buttonVariants}
                            whileHover="hover"
                        >Start a Project</motion.button>
                    </Link>
                </div>
                <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full flex justify-center items-center">
                    <div className="bg-black w-2/3 sm:w-full xsm:w-full xxsm:w-full laptop:w-full smLaptop:w-full tablet:w-full h-2/3 tablet:h-[20rem] mr-24 tablet:mr-12 smLaptop:mr-16"></div>
                </div>
            </div>
            <div className="w-full h-[36rem] mdMobile:h-[42rem] mt-[6rem] xxsm:mt-16 laptop:mt-0 tablet:mt-20 xlMobile:mt-56 mb-[3rem] xlMobile:mb-[30rem] lgMobile:mb-[20rem] mdMobile:mb-[20rem] flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col">
                <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full flex justify-center items-center">
                    <div className="bg-black w-2/3 sm:w-full xsm:w-full xxsm:w-full laptop:w-full smLaptop:w-full tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full h-2/3 tablet:h-[20rem] xlMobile:h-[18rem] lgMobile:h-[15rem] mdMobile:h-[15rem] ml-24 tablet:ml-12 xlMobile:ml-12 lgMobile:ml-6 mdMobile:ml-6 xlMobile:mr-12 lgMobile:mr-6 mdMobile:mr-6 mb-10"></div>
                </div>
                <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full lg:-mt-6 md:-mt-4 sm:-mt-4 xsm:-mt-10">
                    <h1 className="text-6xl xxsm:text-5xl laptop:text-5xl smLaptop:text-4xl tablet:text-3xl xlMobile:text-5xl lgMobile:text-3xl mdMobile:text-3xl mt-20 xlMobile:mt-10 mr-[15rem] lg:mr-36 md:mr-20 sm:mr-10 xsm:mr-10 xxsm:mr-20 laptop:mr-10 smLaptop:mr-24 tablet:mr-12 xlMobile:mr-12 lgMobile:mr-6 mdMobile:mr-6 ml-10 xlMobile:ml-12 lgMobile:ml-6 mdMobile:ml-6 font-hind">The Value of Enclosure Design</h1>
                    <p className="mr-[10rem] lg:mr-36 md:mr-20 sm:mr-10 xsm:mr-10 xxsm:mr-6 laptop:mr-10 smLaptop:mr-8 tablet:mr-12 xlMobile:mr-12 lgMobile:mr-6 mdMobile:mr-6 mt-6 text-xl xxsm:leading-6 laptop:text-[1rem] laptop:leading-5 smLaptop:text-[1rem] smLaptop:leading-6 tablet:text-sm xlMobile:text-2xl lgMobile:text-lg mdMobile:text-lg pr-16 tablet:pr-0 xlMobile:pr-12 lgMobile:pr-6 mdMobile:pr-6 ml-10 lgMobile:ml-6 mdMobile:ml-6 font-shanti">
                        Our Research and Development (R&D) is the driving force behind our innovative production solutions. We’re dedicated to exploring new frontiers in technology and materials to enhance the quality and efficiency of our products. Our R&D efforts focus on sustainable practices, ensuring that we not only meet but exceed industry standards while fostering environmental stewardship. Partner with us for products that are at the cutting edge of the market, crafted with expertise and a vision for the future.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EnclosureDesign;