import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { motion } from "framer-motion";
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

const Demos = () => {

    const { darkMode } = useContext(UserContext);
    const [lightStates, setLightStates] = useState({
        interior: false,
        underwater: false,
        cockpit: false,
        overhead: false,
        accent: false,
        docking: false,
        nav: false,
        deck: false,
        hardtop: false,
        hardtopAccent: false,
        helmOverhead: false,
        speaker: false,
        cupholder: false,
        aftSpreader: false,
        forwardSpreader: false,
        spotlight: false,
        storage: false,
        cabin: false,
        head: false
    });

    const lightTypes = Object.keys(lightStates)

    return (
        <motion.div className={`pt-32 h-screen ${darkMode ? 'bg-[#131313] text-white' : 'bg-white text-black'}`}
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
        >
            <div className="w-[30rem] h-full px-10 py-24 flex flex-wrap">
                {lightTypes.map((lightType) => (
                    <div className="flex mb-4" key={lightType}>
                        <p className="mr-4">{lightType.charAt(0).toUpperCase() + lightType.slice(1)} Lights</p>
                        <button className={`border-2 border-black px-2 rounded-xl mr-4 ${lightStates[lightType] ? 'bg-blue-300' : ''}`}
                            onClick={() => setLightStates(prev => ({ ...prev, [lightType]: !prev[lightType] }))}
                        >{lightStates[lightType] ? 'On' : 'Off'}</button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export default Demos;