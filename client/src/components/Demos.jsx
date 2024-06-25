import { useContext, useEffect, useState } from "react";
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

    const [switchOnCount, setSwitchOnCount] = useState(0);
    const [boatLength, setBoatLength] = useState(0);

    const lightTypes = Object.keys(lightStates)

    useEffect(() => {
        let newSwitchOnCount = 0
        for (let i = 0; i < lightTypes.length; i++) {
            if (lightStates[lightTypes[i]]) {
                newSwitchOnCount++
            }
        }
        setSwitchOnCount(newSwitchOnCount)
    }, [lightStates])

    return (
        <motion.div className={`pt-32 h-screen ${darkMode ? 'bg-[#131313] text-white' : 'bg-white text-black'}`}
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
        >
            <div className="w-fit h-[5rem] p-4 relative">
                <p>Boat Length</p>
                <label className="absolute right-6 top-[57%]">ft</label>
                <input type="number" placeholder="Boat length (ft.)" className={`outline-none border-2 px-2 py-1 pr-8 ${darkMode ? 'bg-transparent text-white border-white' : 'border-black'}`}
                    onChange={(ev) => setBoatLength(ev.target.value)}
                />
            </div>

            <div className="w-full px-12 py-12 flex flex-wrap">
                <p className={`w-full text-2xl font-semibold mb-4 border-b-2 pb-2 ${darkMode ? 'border-white' : 'border-black'}`}>Lights</p>
                {lightTypes.map((lightType) => (
                    <div className="flex mb-4" key={lightType}>
                        <p className="mr-4">{lightType.charAt(0).toUpperCase() + lightType.slice(1)} Lights</p>
                        <button className={`border-2 px-2 rounded-xl mr-4 ${lightStates[lightType] ? 'bg-blue-300' : ''} ${darkMode ? 'border-white' : 'border-black'}`}
                            onClick={() => setLightStates(prev => ({ ...prev, [lightType]: !prev[lightType] }))}
                        >{lightStates[lightType] ? 'On' : 'Off'}</button>
                    </div>
                ))}
                <div className="w-full h-full mt-8">
                    <p className="text-2xl font-semibold border-2 rounded-xl text-center py-2 mb-4">{`Boat Length: ${boatLength} ft`}</p>
                    <p className="text-2xl font-semibold border-2 rounded-xl text-center py-2">{`Switch Count: ${switchOnCount} / ${lightTypes && lightTypes.length > 0 ? lightTypes.length : 0}`}</p>
                </div>
            </div>

        </motion.div>
    );
}

export default Demos;