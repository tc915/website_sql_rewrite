import { motion, animate, transform, stagger, useAnimation } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";

const navVariants = {
    hover: {
        color: '#FF7F11',
        transform: 'translateY(1px)',
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

const Header = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { user, setUser, darkMode, setDarkMode } = useContext(UserContext);

    const [isLogoutPopup, setLogoutPopup] = useState(false);

    useEffect(() => {
        if (isLogoutPopup) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [isLogoutPopup]);




    const logout = async () => {
        setUser(null);
        await axios.post('/logout');
        navigate('/')
    }



    return (
        <motion.header
            className={`flex justify-between items-center h-[8em] p-2 w-full z-[10] fixed bg-black`}>
            <div className={`absolute top-0 left-0 z-[99] bg-black/50 w-full h-screen ${isLogoutPopup ? '' : 'hidden'} flex justify-center items-center`}>
                <div className="text-white rounded-lg bg-black border-4 border-[#FF7F11] w-1/4 h-1/6 px-24 py-4 flex flex-col items-center justify-center relative">
                    <p className="text-2xl font-semibold">Log out?</p>
                    <button className="bg-white text-lg w-full text-gray-800 font-bold rounded-lg mt-4"
                        onClick={() => {
                            logout();
                            setLogoutPopup(false);
                        }}
                    >Yes</button>
                    <button className="absolute top-2 right-2"
                        onClick={() => setLogoutPopup(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#fff"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                    </button>
                </div>
            </div>
            <Link to={'/'} className="text-4xl font-bold ml-[2rem] text-white">
                <img className="w-[28%]" src="/iTi_logo_color.png" />
            </Link>
            <nav className="mt-10">
                <ul className={`text-xl xl:text-lg ${user ? 'mr-[14rem]' : 'mr-[15rem]'} rounded-3xl flex`}>
                    <Link to={'/services'}>
                        <motion.li className={`mr-8 xl:mr-10`}
                            style={{ color: location.pathname === '/services' ? '#FF7F11' : '#fff' }}
                            variants={navVariants}
                            whileHover="hover"
                            whileTap="click"
                        >Services</motion.li>
                    </Link>
                    <Link to={'/industries'}>
                        <motion.li className={`mr-8 xl:mr-10`}
                            style={{ color: location.pathname === '/industries' ? '#FF7F11' : '#fff' }}
                            variants={navVariants}
                            whileHover="hover"
                            whileTap="click"
                        >Industries</motion.li>
                    </Link>
                    <Link to={'/products'}>
                        <motion.li className={`mr-8 xl:mr-10`}
                            style={{ color: location.pathname === '/products' ? '#FF7F11' : '#fff' }}
                            variants={navVariants}
                            whileHover="hover"
                            whileTap="click"
                        >Products</motion.li>
                    </Link>
                    <Link to={'/demos'}>
                        <motion.li className={`mr-8 xl:mr-10`}
                            style={{ color: location.pathname === '/demos' ? '#FF7F11' : '#fff' }}
                            variants={navVariants}
                            whileHover="hover"
                            whileTap="click"
                        >Demos</motion.li>
                    </Link>
                    <Link to={'/about'}>
                        <motion.li className={`mr-8 xl:mr-10 text-nowrap`}
                            style={{ color: location.pathname === '/about' ? '#FF7F11' : '#fff' }}
                            variants={navVariants}
                            whileHover="hover"
                            whileTap="click"
                        >About Us</motion.li>
                    </Link>
                </ul>
            </nav>
            <div className="flex items-center mt-10 mr-5 text-white">
                <div className="font-semibold flex items-center mr-[3rem] text-2xl xl:text-xl text-nowrap">
                    {user && (
                        <>
                            <motion.button className=""
                                onClick={() => setLogoutPopup(true)}
                                variants={navVariants}
                                whileHover="hover"
                                whileTap="click"
                            >Log out</motion.button>
                            <Link to={`/${user.username}/info`}>
                                <svg className="ml-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#FFFFFF"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" /></svg>
                            </Link>

                        </>
                    )}
                    {!user && (
                        <>
                            <Link to='/login' className="">Login</Link>
                            <svg className="ml-2" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF"><path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-160v-94q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5t127.92 44.69q31.3 14.13 50.19 40.97Q800-292 800-254v94H160Zm60-60h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm260-321q39 0 64.5-25.5T570-631q0-39-25.5-64.5T480-721q-39 0-64.5 25.5T390-631q0 39 25.5 64.5T480-541Zm0-90Zm0 411Z" /></svg>
                        </>
                    )}
                    <button className="ml-2">
                        <Link to={`/cart`}>
                            <motion.svg xmlns="http://www.w3.org/2000/svg" height="45px" viewBox="0 -960 960 960" width="45px" fill="#fff" className="outline-none"
                                initial={{ opacity: 1 }}
                                whileHover={{
                                    fill: '#FF7F11'
                                }}
                                whileTap={{
                                    opacity: 0.5,
                                    transition: {
                                        duration: 0.1
                                    }
                                }}
                            ><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" /></motion.svg></Link>
                    </button>
                    <button className="ml-2 bg-[#333333] rounded-full p-1"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#ffd817" className={`${darkMode ? 'hidden' : ''}`}><path d="M450-770v-150h60v150h-60Zm256 106-42-42 106-107 42 43-106 106Zm64 214v-60h150v60H770ZM450-40v-150h60v150h-60ZM253-665 148-770l42-42 106 106-43 41Zm518 517L664-254l41-41 108 104-42 43ZM40-450v-60h150v60H40Zm151 302-43-42 105-105 22 20 22 21-106 106Zm289-92q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Z" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FFFFFF" className={`${darkMode ? '' : 'hidden'}`}><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q8 0 17 .5t23 1.5q-36 32-56 79t-20 99q0 90 63 153t153 63q52 0 99-18.5t79-51.5q1 12 1.5 19.5t.5 14.5q0 150-105 255T480-120Z" /></svg>
                    </button>
                </div>
            </div>

        </motion.header>
    );
}

export default Header;