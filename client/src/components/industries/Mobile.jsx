import { useContext, useEffect } from "react";
import { UserContext } from "../../UserContext";
import Footer from "../../partials/Footer";

const Mobile = () => {
    const { darkMode } = useContext(UserContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className={`w-full h-screen pt-32 ${darkMode ? 'bg-[#131313] text-white' : 'bg-white text-black'}`}>
                <h1>Mobile Page</h1>
            </div>
            <Footer />
        </>
    );
}

export default Mobile;