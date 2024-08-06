import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

const ServicesNav = ({ location }) => {
    const { darkMode, setDarkMode } = useContext(UserContext);
    return (
        <div className={`border-b-4 w-full h-[5rem] ${darkMode ? 'text-white' : 'text-black'} text-xl sm:text-[1.1rem] xsm:text-[1rem] laptop:text-[1.2rem] smLaptop:text-[1.15rem] tablet:text-sm lgMobile:text-[1rem] lgMobile:mt-4 font-bold py-1 sm:px-4 xxsm:px-10 laptop:px-10 smLaptop:px-10 tablet:px-6 flex items-center justify-center font-hind`}>
            <Link to={'/services/research-and-development'} className={`mr-6 smLaptop:mr-1 tablet:mr-0 lgMobile:mr-2 transition-all duration-200 ${darkMode ? 'hover:bg-white' : 'hover:bg-black/25'} py-2 px-4 tablet:px-0 lgMobile:px-0 lgMobile:py-0 rounded-full tablet:rounded-none ${location.pathname === '/services/research-and-development' ? 'bg-gradient-to-l from-[#FF7F11] to-[#facc22] bg-clip-text text-transparent' : 'hover:text-black'}`}>Research & Development</Link>
            <Link to={'/services/enclosure-design'} className={`mr-6 smLaptop:mr-1 tablet:mr-0 lgMobile:mr-2 transition-all duration-200 ${darkMode ? 'hover:bg-white' : 'hover:bg-black/25'} py-2 px-4 tablet:xr-0 rounded-full tablet:rounded-none ${location.pathname === '/services/enclosure-design' ? 'bg-gradient-to-l from-[#FF7F11] to-[#facc22] bg-clip-text text-transparent' : 'hover:text-black'}`}>Enclosure Design</Link>
            <Link to={'/services/embedded-firmware'} className={`mr-6 smLaptop:mr-1 tablet:mr-0 lgMobile:mr-2 transition-all duration-200 ${darkMode ? 'hover:bg-white' : 'hover:bg-black/25'} py-2 px-4 tablet:px-0 rounded-full tablet:rounded-none ${location.pathname === '/services/embedded-firmware' ? 'bg-gradient-to-l from-[#FF7F11] to-[#facc22] bg-clip-text text-transparent' : 'hover:text-black'}`}>Embedded Firmware</Link>
            <Link to={'/services/custom-GUI'} className={`mr-6 smLaptop:mr-1 tablet:mr-0 transition-all duration-200 ${darkMode ? 'hover:bg-white' : 'hover:bg-black/25'} py-2 px-4 tablet:px-0 rounded-full tablet:rounded-none ${location.pathname === '/services/custom-GUI' ? 'bg-gradient-to-l from-[#FF7F11] to-[#facc22] bg-clip-text text-transparent' : 'hover:text-black'}`}>Custom GUI</Link>
            <Link to={'/services/app-development'} className={`mr-6 smLaptop:mr-1 tablet:mr-0 lgMobile:mr-2 transition-all duration-200 ${darkMode ? 'hover:bg-white' : 'hover:bg-black/25'} py-2 px-4 tablet:px-0 rounded-full tablet:rounded-none ${location.pathname === '/services/app-development' ? 'bg-gradient-to-l from-[#FF7F11] to-[#facc22] bg-clip-text text-transparent' : 'hover:text-black'}`}>App Development</Link>
            <Link to={'/services/electrical-design'} className={`mr-6 smLaptop:mr-1 tablet:mr-0 lgMobile:mr-2 transition-all duration-200 ${darkMode ? 'hover:bg-white' : 'hover:bg-black/25'} py-2 px-4 tablet:px-0 rounded-full tablet:rounded-none ${location.pathname === '/services/electrical-design' ? 'bg-gradient-to-l from-[#FF7F11] to-[#facc22] bg-clip-text text-transparent' : 'hover:text-black'}`}>Electrical Design</Link>
        </div>
    );
}

export default ServicesNav;