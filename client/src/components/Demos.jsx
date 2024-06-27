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

    const [pumpStates, setPumpStates] = useState({
        liveWell: false,
        baitWell: false,
        forward: false,
        aft: false,
        freshwater: false,
        waterWater: false
    });

    const [boatControlStates, setBoatControlStates] = useState({
        windshieldWipers: false,
        wiperSpray: false,
        anchor: false,
        tower: false,
        sunshade: false,
        sunroof: false,
        airConditioning: false
    })

    const productData = {
        momentarySwitch: {
            name: 'Momentary RGB Switch (22mm)',
            weight: 16.22,
            cost: 6,
            units: 'each'
        },
        momentarySwitchHarness: {
            name: 'Momentary RGB Switch Harness (22mm)',
            weight: 8.79,
            cost: 5,
            units: 'each'
        },
        awgGPTM: {
            name: '16 AWG GPTM Cable',
            weight: 7.25,
            cost: 0.144,
            units: 'foot'
        },
        powerInjector: {
            name: 'NMEA 2000 Power Injector',
            weight: 120,
            cost: 22.97,
            units: 'each'
        },
        tConnector: {
            name: 'NMEA 2000 T-Connector',
            weight: 29.15,
            cost: 24.99,
            units: 'each'
        },
        backboneCable10m: {
            name: 'NMEA 2000 Backbone Cable',
            weight: 1575.36,
            cost: 47,
            units: { length: 32, unit: 'feet' }
        },
        backboneCable8m: {
            name: 'NMEA 2000 Backbone Cable',
            weight: 1260.288,
            cost: 37.60,
            units: { length: 25.6, unit: 'feet' }
        },
        backboneCable5m: {
            name: 'NMEA 2000 Backbone Cable',
            weight: 787.68,
            cost: 33.76,
            units: { length: 16, unit: 'feet' }
        },
        backboneCable2m: {
            name: 'NMEA 2000 Backbone Cable',
            weight: 315.072,
            cost: 29.99,
            units: { length: 6.4, unit: 'feet' }
        },
        backboneCableHalfMeter: {
            name: 'NMEA 2000 Backbone Cable',
            weight: 78.768,
            cost: 20.27,
            units: { length: 1.6, unit: 'feet' }
        },
        dropCable: {
            name: 'NMEA 2000 Drop Cable',
            weight: 239.98,
            cost: 23.98,
            units: { length: 6.5, unit: 'feet' }
        },
        terminatorFemale: {
            name: 'NMEA 2000 Terminator (Female)',
            weight: 7.57,
            cost: 16.99,
            units: 'each'
        },
        terminatorMale: {
            name: 'NMEA 2000 Terminator (Male)',
            weight: 7.9,
            cost: 16.99,
            units: 'each'
        },
        oneWayTeeConnector: {
            name: 'NMEA 2000 One Way Tee Connector',
            weight: 14.73,
            cost: 19.18,
            units: 'each'
        },
        twoWayTeeConnector: {
            name: 'NMEA 2000 Two Way Tee Connector',
            weight: 90.7185,
            cost: 38.01,
            units: 'each'
        },
        fourWayTeeConnector: {
            name: 'NMEA 2000 Four Way Tee Connector',
            weight: 25,
            cost: 29.48,
            units: 'each'
        },
        contact6Plus: {
            name: 'CZone Contact 6+',
            weight: 600,
            cost: 436.21,
            units: 'each'
        },
        controlX: {
            name: 'CZone Control X',
            weight: 792,
            cost: 1250.99,
            units: 'each'
        },
        controlXPlus: {
            name: 'CZone Control X+',
            weight: 810,
            cost: 1287.55,
            units: "each"
        },
        cZoneSI: {
            name: 'CZone SI',
            weight: 281,
            cost: 556.98,
            units: 'each'
        },
        cZoneDDS: {
            name: 'CZone DDS',
            weight: 1040,
            cost: 1572.39,
            units: 'each'
        },
        wirelessInterface: {
            name: 'CZone Wireless Interface',
            weight: 685,
            cost: 1468,
            units: 'each'
        },
        sixWayKeypad: {
            name: 'CZone 6 Way Waterproof Keypad',
            weight: 115,
            cost: 323.55,
            units: 'each'
        },
        twelveWayKeypad: {
            name: 'CZone 12 Way Waterproof Keypad',
            weight: 115,
            cost: 450.81,
            units: 'each'
        }

    }

    const [switchOnCount, setSwitchOnCount] = useState(0);
    const [boatLength, setBoatLength] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [cablingCost, setCablingCost] = useState(0);
    const [numDevices, setNumDevices] = useState(0);
    const [num12ButtonKeypads, setNum12ButtonKeypads] = useState(0);
    const [num6ButtonKeypads, setNum6ButtonKeypads] = useState(0);
    const [numContact6Plus, setNumContact6Plus] = useState(0);
    const [numDDS, setNumDDS] = useState(0);
    const [num10mBackboneCables, setNum10mBackboneCables] = useState(0);
    const [num8mBackboneCables, setNum8mBackboneCables] = useState(0);
    const [num5mBackboneCables, setNum5mBackboneCables] = useState(0);
    const [num2mBackboneCables, setNum2mBackboneCables] = useState(0);
    const [numHalfMeterBackboneCables, setNumHalfMeterBackboneCables] = useState(0);
    const [wirelessInterfaceBool, setWirelessInterfaceBool] = useState(false);
    const [num4WayTeeConnectors, setNum4WayTeeConnectors] = useState(0);
    const [num2WayTeeConnectors, setNum2WayTeeConnectors] = useState(0);
    const [num1WayTeeConnectors, setNum1WayTeeConnectors] = useState(0);
    const [backboneCablesCost, setBackBoneCablesCost] = useState(0);
    const [powerCablesCost, setPowerCablesCost] = useState(0);
    const [teeConnectorsCost, setTeeConnectorsCost] = useState(0);
    const [nmeaCablesCost, setNmeaCablesCost] = useState(0);
    const [costOfOutputBoxes, setCostOfOutputBoxes] = useState(0);
    const [costOfKeypads, setCostOfKeypads] = useState(0);
    const [costOfWirelessInterface, setCostOfWirelessInterface] = useState(0);

    const lightTypes = Object.keys(lightStates)
    const pumpTypes = Object.keys(pumpStates)
    const boatControlTypes = Object.keys(boatControlStates)

    const countSwitchesOn = (switchStates) => {
        let count = 0;
        for (let key in switchStates) {
            if (switchStates[key]) {
                count++;
            }
        }
        return count;
    }

    useEffect(() => {
        const newSwitchOnCount = countSwitchesOn(lightStates) + countSwitchesOn(pumpStates) + countSwitchesOn(boatControlStates);
        setSwitchOnCount(newSwitchOnCount);
    }, [lightStates, pumpStates, boatControlStates]);


    useEffect(() => {
        if (switchOnCount > 0 || boatLength > 0) {
            let keypadRemainder = switchOnCount % 12;
            if (keypadRemainder <= 6 && keypadRemainder > 0) {
                setNum6ButtonKeypads(1)
            }
            if (keypadRemainder > 6 || keypadRemainder === 0) {
                setNum12ButtonKeypads(Math.round(switchOnCount / 12))
                setNum6ButtonKeypads(0)
            }
            let outputBoxRemainder = switchOnCount % 27;
            if (outputBoxRemainder <= 6 && outputBoxRemainder !== 0) {
                setNumContact6Plus(1);
            } else if (outputBoxRemainder === 7 || outputBoxRemainder === 0) {
                setNumContact6Plus(0);
                setNumDDS(Math.ceil(switchOnCount / 27))
            } else if (Math.round(switchOnCount / 27) > 1) {
                setNumContact6Plus(1)
            }
        } else if (switchOnCount === 0) {
            setNum6ButtonKeypads(0);
            setNum12ButtonKeypads(0);
            setNumContact6Plus(0);
            setNumDDS(0)
        }
    }, [switchOnCount, boatLength])

    useEffect(() => {
        if (boatLength > 0) {
            let boatLengthRemainder = (boatLength - 10) % 32;
            let tenMeterCables = 0;
            let eightMeterCables = 0;
            let fiveMeterCables = 0;
            let twoMeterCables = 0;
            let halfMeterCables = 0;
            if (Math.floor((boatLength - 10) / 32) >= 1) {
                tenMeterCables = Math.floor((boatLength - 10) / 32);
            }
            if (boatLengthRemainder > 0) {
                if (boatLengthRemainder <= 1.6) {
                    halfMeterCables = 1;
                } else if (boatLengthRemainder <= 6.4) {
                    twoMeterCables = 1;
                } else if (boatLengthRemainder <= 16) {
                    fiveMeterCables = 1;
                } else if (boatLengthRemainder <= 25.6) {
                    eightMeterCables = 1;
                } else {
                    tenMeterCables += 1;
                }
            }
            setNum10mBackboneCables(tenMeterCables);
            setNum8mBackboneCables(eightMeterCables);
            setNum5mBackboneCables(fiveMeterCables);
            setNum2mBackboneCables(twoMeterCables);
            setNumHalfMeterBackboneCables(halfMeterCables);
        } else if (boatLength === 0) {
            setNum10mBackboneCables(0);
            setNum8mBackboneCables(0);
            setNum5mBackboneCables(0);
            setNum2mBackboneCables(0);
            setNumHalfMeterBackboneCables(0);
        }
    }, [boatLength])

    useEffect(() => {
        let numWirelessInterface;
        if (wirelessInterfaceBool) {
            numWirelessInterface = 1;
        } else {
            numWirelessInterface = 0;
        }
        setNumDevices(numContact6Plus + numDDS + num12ButtonKeypads + num6ButtonKeypads + numWirelessInterface)
    }, [numContact6Plus, num6ButtonKeypads, wirelessInterfaceBool])

    useEffect(() => {
        if (numDevices > 0) {
            let numDevicesRemainder = numDevices % 4;
            let oneWayTeeConnectors = 0;
            let twoWayTeeConnectors = 0;
            let fourWayTeeConnectors = 0;
            if (Math.floor(numDevices / 4) >= 1) {
                fourWayTeeConnectors = Math.floor(numDevices / 4);
            }
            if (numDevicesRemainder > 0) {
                if (numDevicesRemainder <= 1) {
                    oneWayTeeConnectors = 1;
                } else if (numDevicesRemainder <= 2) {
                    twoWayTeeConnectors = 1;
                } else {
                    fourWayTeeConnectors += 1;
                }
            }
            setNum4WayTeeConnectors(fourWayTeeConnectors);
            setNum2WayTeeConnectors(twoWayTeeConnectors);
            setNum1WayTeeConnectors(oneWayTeeConnectors);
        } else if (numDevices === 0) {
            setNum4WayTeeConnectors(0);
            setNum2WayTeeConnectors(0);
            setNum1WayTeeConnectors(0);
        }
    }, [numDevices])

    useEffect(() => {
        if (switchOnCount > 0 && boatLength > 0) {
            let newPowerCablesCost = (productData.awgGPTM.cost * (0.6 * boatLength) * switchOnCount);
            let newBackboneCablesCost = (
                (num10mBackboneCables * productData.backboneCable10m.cost) +
                (num8mBackboneCables * productData.backboneCable8m.cost) +
                (num5mBackboneCables * productData.backboneCable5m.cost) +
                (num2mBackboneCables * productData.backboneCable2m.cost) +
                (numHalfMeterBackboneCables * productData.backboneCableHalfMeter.cost)
            );
            let newTeeConnectorsCost = (
                (num1WayTeeConnectors * productData.oneWayTeeConnector.cost) +
                (num2WayTeeConnectors * productData.twoWayTeeConnector.cost) +
                (num4WayTeeConnectors * productData.fourWayTeeConnector.cost)
            )
            let newNmeaCablesCost = (productData.powerInjector.cost + (numDevices * (newTeeConnectorsCost + productData.dropCable.cost)) + newBackboneCablesCost)
            setCablingCost(newPowerCablesCost + newNmeaCablesCost)
            setPowerCablesCost(newPowerCablesCost);
            setBackBoneCablesCost(newBackboneCablesCost);
            setTeeConnectorsCost(newTeeConnectorsCost);
            setNmeaCablesCost(newNmeaCablesCost);
        }

    }, [wirelessInterfaceBool, num4WayTeeConnectors, num2WayTeeConnectors, num1WayTeeConnectors, num10mBackboneCables])

    useEffect(() => {
        let newCostOfOutputBoxes = (
            (numContact6Plus * productData.contact6Plus.cost) +
            (numDDS * productData.cZoneDDS.cost)
        );
        let newCostOfKeypads = (
            (num12ButtonKeypads * productData.twelveWayKeypad.cost) +
            (num6ButtonKeypads * productData.sixWayKeypad.cost)
        );
        let newCostOfWirelessInterface;
        if (wirelessInterfaceBool) {
            newCostOfWirelessInterface = productData.wirelessInterface.cost;
        } else {
            newCostOfWirelessInterface = 0;
        }

        setTotalCost(newCostOfKeypads + newCostOfOutputBoxes + newCostOfWirelessInterface + cablingCost);
        setCostOfKeypads(newCostOfKeypads);
        setCostOfOutputBoxes(newCostOfOutputBoxes);
        setCostOfWirelessInterface(newCostOfWirelessInterface);
    }, [cablingCost])

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
                    onChange={(ev) => setBoatLength(Number(ev.target.value))}
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
                <p className={`w-full text-2xl font-semibold mb-4 border-b-2 pb-2 ${darkMode ? 'border-white' : 'border-black'}`}>Pumps</p>
                {pumpTypes.map((pumpType) => (
                    <div className="flex mb-4" key={pumpType}>
                        <p className="mr-4">{pumpType.charAt(0).toUpperCase() + pumpType.slice(1)} Pump</p>
                        <button className={`border-2 px-2 rounded-xl mr-4 ${pumpStates[pumpType] ? 'bg-blue-300' : ''} ${darkMode ? 'border-white' : 'border-black'}`}
                            onClick={() => setPumpStates(prev => ({ ...prev, [pumpType]: !prev[pumpType] }))}
                        >{pumpStates[pumpType] ? 'On' : 'Off'}</button>
                    </div>
                ))}
                <p className={`w-full text-2xl font-semibold mb-4 border-b-2 pb-2 ${darkMode ? 'border-white' : 'border-black'}`}>Boat Controls</p>
                {boatControlTypes.map((controlType) => (
                    <div className="flex mb-4" key={controlType}>
                        <p className="mr-4">{controlType.charAt(0).toUpperCase() + controlType.slice(1)} Control</p>
                        <button className={`border-2 px-2 rounded-xl mr-4 ${boatControlStates[controlType] ? 'bg-blue-300' : ''} ${darkMode ? 'border-white' : 'border-black'}`}
                            onClick={() => setBoatControlStates(prev => ({ ...prev, [controlType]: !prev[controlType] }))}
                        >{boatControlStates[controlType] ? 'On' : 'Off'}</button>
                    </div>
                ))}
                <div className="w-full flex">
                    <p className="text-xl font-semibold">Wireless Interface?</p>
                    <input type="checkbox" name=""
                        onChange={() => setWirelessInterfaceBool(!wirelessInterfaceBool)}
                    />
                </div>
                <div className="w-full h-full mt-8">
                    <p className="text-2xl font-semibold border-2 rounded-xl text-center py-2 mb-4">{`Boat Length: ${boatLength} ft`}</p>
                    <p className="text-2xl font-semibold border-2 rounded-xl text-center py-2">{`Switch Count: ${switchOnCount} / ${lightTypes && lightTypes.length > 0 ? lightTypes.length + pumpTypes.length + boatControlTypes.length : 0}`}</p>
                </div>
                <div className="w-full mt-8 mb-24">
                    <ul>
                        {num10mBackboneCables > 0 && <li>{`Number of 10m backbone cables: ${num10mBackboneCables}`}</li>}
                        {num8mBackboneCables > 0 && <li>{`Number of 8m backbone cables: ${num8mBackboneCables}`}</li>}
                        {num5mBackboneCables > 0 && <li>{`Number of 5m backbone cables: ${num5mBackboneCables}`}</li>}
                        {num2mBackboneCables > 0 && <li>{`Number of 2m backbone cables: ${num2mBackboneCables}`}</li>}
                        {numHalfMeterBackboneCables > 0 && <li>{`Number of 0.5m backbone cables: ${numHalfMeterBackboneCables}`}</li>}
                    </ul>
                    <ul className="mt-4">
                        {num6ButtonKeypads > 0 && <li>{`Number of 6 Way Keypads: ${num6ButtonKeypads}`}</li>}
                        {num12ButtonKeypads > 0 && <li>{`Number of 12 Way Keypads: ${num12ButtonKeypads}`}</li>}
                        {numContact6Plus > 0 && <li>{`Number of CZone Contact 6+ Output Boxes : ${numContact6Plus}`}</li>}
                        {numDDS > 0 && <li>{`Number of CZone DDS Output Boxes : ${numDDS}`}</li>}
                        {num1WayTeeConnectors > 0 && <li>{`Number of 1 Way Tee Connectors : ${num1WayTeeConnectors}`}</li>}
                        {num2WayTeeConnectors > 0 && <li>{`Number of 2 Way Tee Connectors : ${num2WayTeeConnectors}`}</li>}
                        {num4WayTeeConnectors > 0 && <li>{`Number of 4 Way Tee Connectors : ${num4WayTeeConnectors}`}</li>}
                        <li>{`Wireless Interface?: ${wirelessInterfaceBool ? 'Yes' : 'No'}`}</li>
                    </ul>
                    {cablingCost > 0 && <p className="font-semibold">{`Total Cabling Cost: $${cablingCost.toFixed(2)}`}</p>}
                    {costOfKeypads > 0 && <p className="font-semibold">{`CZone Keypads Cost: $${costOfKeypads.toFixed(2)}`}</p>}
                    {costOfOutputBoxes > 0 && <p className="font-semibold">{`CZone Output Boxes Cost: $${costOfOutputBoxes.toFixed(2)}`}</p>}
                    {costOfWirelessInterface > 0 && <p className="font-semibold">{`Wireless Interface Cost: $${costOfWirelessInterface.toFixed(2)}`}</p>}

                    {totalCost > 0 && <p className="text-xl font-bold">{`Total Cost: $${totalCost.toFixed(2)}`}</p>}

                </div>
            </div>

        </motion.div>
    );
}

export default Demos;