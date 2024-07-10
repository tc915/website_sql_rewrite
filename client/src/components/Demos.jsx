import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

    const { darkMode, user } = useContext(UserContext);
    const navigate = useNavigate();
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
        wasteWater: false
    });

    const [boatControlStates, setBoatControlStates] = useState({
        windshieldWipers: false,
        windshieldWiperSpray: false,
        anchor: false,
        tower: false,
        sunshade: false,
        sunroof: false,
        airConditioning: false
    })

    const [productData, setProductData] = useState({
        momentaryRGBSwitch: {
            name: 'Momentary RGB Switch (22mm)',
            weight: 16.22,
            cost: 6,
            units: 'each'
        },
        momentaryRGBSwitchHarness: {
            name: 'Momentary RGB Switch Harness (22mm)',
            weight: 8.79,
            cost: 5,
            units: 'each'
        },
        awgPowerCable: {
            name: '16 AWG GPTM Cable',
            weight: 7.25,
            cost: 0.144,
            units: { unit: 'foot' }
        },
        powerInjector: {
            name: 'NMEA 2000 Power Injector',
            weight: 120,
            cost: 22.97,
            units: 'each'
        },
        backboneCable10m: {
            name: 'NMEA 2000 32ft Backbone Cable',
            weight: 1575.36,
            cost: 47.00,
            units: 'each'
        },
        backboneCable8m: {
            name: 'NMEA 2000 25.6ft Backbone Cable',
            weight: 1260.288,
            cost: 37.60,
            units: 'each'
        },
        backboneCable5m: {
            name: 'NMEA 2000 16ft Backbone Cable',
            weight: 787.68,
            cost: 33.76,
            units: 'each'
        },
        backboneCable2m: {
            name: 'NMEA 2000 6.4ft Backbone Cable',
            weight: 315.072,
            cost: 29.99,
            units: 'each'
        },
        backboneCableHalfMeter: {
            name: 'NMEA 2000 1.6ft Backbone Cable',
            weight: 78.768,
            cost: 20.27,
            units: 'each'
        },
        dropCable: {
            name: 'NMEA 2000 Drop Cable',
            weight: 239.98,
            cost: 23.98,
            units: 'each'
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
            cost: 29.48,
            units: 'each'
        },
        fourWayTeeConnector: {
            name: 'NMEA 2000 Four Way Tee Connector',
            weight: 25,
            cost: 38.01,
            units: 'each'
        },
        sixOutputDigitalSwitchingBox: {
            name: '6 Output Digital Switching Box',
            weight: 600,
            cost: 436.21,
            units: 'each'
        },
        twentySevenOutputDigitalSwitchingBox: {
            name: '27 Output Digital Switching Box',
            weight: 1040,
            cost: 1572.39,
            units: 'each'
        },
        wirelessInterface: {
            name: 'Wireless Interface',
            weight: 685,
            cost: 1468,
            units: 'each'
        },
        sixWayKeypad: {
            name: '6 Way Waterproof Keypad',
            weight: 115,
            cost: 323.55,
            units: 'each'
        },
        twelveWayKeypad: {
            name: '12 Way Waterproof Keypad',
            weight: 115,
            cost: 450.81,
            units: 'each'
        }
    })

    const [switchOnCount, setSwitchOnCount] = useState(0);
    const [boatLength, setBoatLength] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [manualTotalCost, setManualTotalCost] = useState(0);
    const [cablingCost, setCablingCost] = useState(0);
    const [numDevices, setNumDevices] = useState(0);
    const [num12ButtonKeypads, setNum12ButtonKeypads] = useState(0);
    const [num6ButtonKeypads, setNum6ButtonKeypads] = useState(0);
    const [numsixOutputDigitalSwitchingBox, setNumsixOutputDigitalSwitchingBox] = useState(0);
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
    const [totalWeight, setTotalWeight] = useState(0);
    const [addToTotalCostAmount, setAddToTotalCostAmount] = useState('');
    const [subtractToTotalCostAmount, setSubtractToTotalCostAmount] = useState('');
    const [showChangeComponentPricing, setShowChangeComponentPricing] = useState(false);
    const [showEditTotalCost, setShowEditTotalCost] = useState(false);
    const [boatSetupData, setBoatSetupData] = useState({});
    const [showSaveSuccessfulPopup, setShowSaveSuccessfulPopup] = useState(false);

    const lightTypes = Object.keys(lightStates)
    const pumpTypes = Object.keys(pumpStates)
    const boatControlTypes = Object.keys(boatControlStates)

    const productKeys = Object.keys(productData)

    const [changingProductPriceList, setChangingProductPricingList] = useState(Array(productKeys.length).fill(false))

    const countSwitchesOn = (switchStates) => {
        let count = 0;
        for (let key in switchStates) {
            if (switchStates[key]) {
                count++;
            }
        }
        return count;
    }

    const clearInputs = () => {
        for (let i = 0; i < lightTypes.length; i++) {
            lightStates[lightTypes[i]] = false
        }
        for (let i = 0; i < pumpTypes.length; i++) {
            pumpStates[pumpTypes[i]] = false
        }
        for (let i = 0; i < boatControlTypes.length; i++) {
            boatControlStates[boatControlTypes[i]] = false
        }
        setSwitchOnCount(0);
        setWirelessInterfaceBool(false)
        setBoatLength('')
        setNumDevices(0);
    }

    const addAllInputs = () => {
        const newLightStates = { ...lightStates };
        const newPumpStates = { ...pumpStates };
        const newBoatControlStates = { ...boatControlStates };

        lightTypes.forEach(light => {
            newLightStates[light] = true;
        });

        pumpTypes.forEach(pump => {
            newPumpStates[pump] = true;
        });

        boatControlTypes.forEach(control => {
            newBoatControlStates[control] = true;
        });

        setLightStates(newLightStates);
        setPumpStates(newPumpStates);
        setBoatControlStates(newBoatControlStates);
    };


    useEffect(() => {
        const newSwitchOnCount = countSwitchesOn(lightStates) + countSwitchesOn(pumpStates) + countSwitchesOn(boatControlStates);
        setSwitchOnCount(newSwitchOnCount);
    }, [lightStates, pumpStates, boatControlStates]);

    useEffect(() => {
        let newNum6ButtonKeypads = 0
        let newNum12ButtonKeypads = 0
        let newNumsixOutputDigitalSwitchingBox = 0
        let newNumDDS = 0
        if (switchOnCount > 0 || boatLength > 0) {
            let keypadRemainder = switchOnCount % 12;
            if (keypadRemainder <= 6 && keypadRemainder > 0) {
                newNum6ButtonKeypads = 1
            }
            else if (keypadRemainder > 6 || keypadRemainder === 0) {
                newNum12ButtonKeypads = Math.round(switchOnCount / 12)
                newNum6ButtonKeypads = 0
            }
            let outputBoxRemainder = switchOnCount % 27;
            if (outputBoxRemainder <= 6 && outputBoxRemainder !== 0) {
                newNumsixOutputDigitalSwitchingBox = 1
                newNumDDS = Math.floor(switchOnCount / 27)
            } else if (outputBoxRemainder > 6 || outputBoxRemainder === 0) {
                newNumsixOutputDigitalSwitchingBox = 0
                newNumDDS = Math.ceil(switchOnCount / 27)
            } else {
                newNumsixOutputDigitalSwitchingBox = 0
                newNumDDS = Math.floor(switchOnCount / 27)
            }
            setNum12ButtonKeypads(newNum12ButtonKeypads)
            setNum6ButtonKeypads(newNum6ButtonKeypads)
            setNumsixOutputDigitalSwitchingBox(newNumsixOutputDigitalSwitchingBox)
            setNumDDS(newNumDDS)
        } else if (switchOnCount === 0) {
            setNum6ButtonKeypads(0);
            setNum12ButtonKeypads(0);
            setNumsixOutputDigitalSwitchingBox(0);
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
        } else {
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
        setNumDevices(numsixOutputDigitalSwitchingBox + numDDS + num12ButtonKeypads + num6ButtonKeypads + numWirelessInterface)
    }, [numsixOutputDigitalSwitchingBox, num6ButtonKeypads, wirelessInterfaceBool])

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
        } else {
            setNum4WayTeeConnectors(0);
            setNum2WayTeeConnectors(0);
            setNum1WayTeeConnectors(0);
        }
    }, [numDevices])

    useEffect(() => {
        if (switchOnCount > 0 && boatLength > 0) {
            let newPowerCablesCost = (productData.awgPowerCable.cost * (0.6 * boatLength) * switchOnCount);
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
            let newNmeaCablesCost = (productData.powerInjector.cost + (newTeeConnectorsCost + (numDevices * productData.dropCable.cost)) + newBackboneCablesCost)
            setCablingCost(newPowerCablesCost + newNmeaCablesCost)
            setPowerCablesCost(newPowerCablesCost);
            setBackBoneCablesCost(newBackboneCablesCost);
            setTeeConnectorsCost(newTeeConnectorsCost);
            setNmeaCablesCost(newNmeaCablesCost);
        } else {
            setCablingCost(0);
            setPowerCablesCost(0);
            setBackBoneCablesCost(0);
            setTeeConnectorsCost(0);
            setNmeaCablesCost(0);
        }

    }, [wirelessInterfaceBool, num4WayTeeConnectors, num2WayTeeConnectors, num1WayTeeConnectors, num10mBackboneCables, switchOnCount, productData])

    useEffect(() => {
        let newCostOfOutputBoxes = (
            (numsixOutputDigitalSwitchingBox * productData.sixOutputDigitalSwitchingBox.cost) +
            (numDDS * productData.twentySevenOutputDigitalSwitchingBox.cost)
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
    }, [cablingCost, numsixOutputDigitalSwitchingBox, num6ButtonKeypads, wirelessInterfaceBool])

    useEffect(() => {
        setManualTotalCost(0)
        if (totalCost > 0) {
            let backboneCablesWeight = (
                (num10mBackboneCables * productData.backboneCable10m.weight) +
                (num8mBackboneCables * productData.backboneCable8m.weight) +
                (num5mBackboneCables * productData.backboneCable5m.weight) +
                (num2mBackboneCables * productData.backboneCable2m.weight) +
                (numHalfMeterBackboneCables * productData.backboneCableHalfMeter.weight)
            )
            let teeConnectorsWeight = (
                (num1WayTeeConnectors * productData.oneWayTeeConnector.weight) +
                (num2WayTeeConnectors * productData.twoWayTeeConnector.weight) +
                (num4WayTeeConnectors * productData.fourWayTeeConnector.weight)
            )
            let powerCablesWeight = (productData.awgPowerCable.weight * (0.6 * boatLength) * switchOnCount)
            let nmeaComponentsWeight = (productData.powerInjector.weight + (teeConnectorsWeight + (numDevices * productData.dropCable.weight)) + backboneCablesWeight)
            let totalCablesWeight = powerCablesWeight + nmeaComponentsWeight;
            let weightOfKeypads = (
                (num6ButtonKeypads * productData.sixWayKeypad.weight) +
                (num12ButtonKeypads * productData.twelveWayKeypad.weight)
            )
            let weightOfOutputBoxes = (
                (numsixOutputDigitalSwitchingBox * productData.sixOutputDigitalSwitchingBox.weight) +
                (numDDS * productData.twentySevenOutputDigitalSwitchingBox.weight)
            )
            let weightOfWirelessInterface = false;
            if (wirelessInterfaceBool) {
                weightOfWirelessInterface = true;
            }
            setTotalWeight((totalCablesWeight + weightOfKeypads + weightOfOutputBoxes + weightOfWirelessInterface) * 2.205)
        } else {
            setTotalWeight(0)
        }
    }, [totalCost])


    const splitCamelCase = (str) => {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    }

    const saveTotalCostChanges = () => {
        const addAmount = addToTotalCostAmount;
        const subtractAmount = subtractToTotalCostAmount;
        if (!isNaN(addAmount && addAmount > 0)) {
            setManualTotalCost(prevCost => (prevCost || totalCost) + addAmount);
        }
        if (!isNaN(subtractAmount) && subtractAmount > 0) {
            setManualTotalCost(prevCost => (prevCost || totalCost) - subtractAmount);
        }
        setAddToTotalCostAmount('')
        setSubtractToTotalCostAmount('')
    }

    const saveProductPriceChange = (productIndex, newPrice) => {
        if (newPrice > 0) {
            const updatedProductData = { ...productData }
            const productKey = productKeys[productIndex]
            updatedProductData[productKey] = {
                ...updatedProductData[productKey],
                cost: newPrice
            }
            setProductData(updatedProductData)
        }
    }

    const saveBuildSetup = async () => {
        if (user) {
            const setupData = {
                userId: user.id,
                boatLength,
                interiorLights: lightStates.interior,
                underwaterLights: lightStates.underwater,
                cockpitLights: lightStates.cockpit,
                overheadLights: lightStates.overhead,
                accentLights: lightStates.accent,
                dockingLights: lightStates.docking,
                navLights: lightStates.nav,
                deckLights: lightStates.deck,
                hardtopLights: lightStates.hardtop,
                hardtopAccentLights: lightStates.hardtopAccent,
                helmOverheadLights: lightStates.helmOverhead,
                speakerLights: lightStates.speaker,
                cupholderLights: lightStates.cupholder,
                aftSpreaderLights: lightStates.aftSpreader,
                forwardSpreaderLights: lightStates.forwardSpreader,
                spotlightLights: lightStates.spotlight,
                storageLights: lightStates.storage,
                cabinLights: lightStates.cabin,
                headLights: lightStates.head,
                liveWellPump: pumpStates.liveWell,
                baitWellPump: pumpStates.baitWell,
                forwardPump: pumpStates.forward,
                aftPump: pumpStates.aft,
                freshwaterPump: pumpStates.freshwater,
                wasteWaterPump: pumpStates.wasteWater,
                windshieldWipersControl: boatControlStates.windshieldWipers,
                windshieldWiperSprayControl: boatControlStates.windshieldWiperSpray,
                anchorControl: boatControlStates.anchor,
                towerControl: boatControlStates.tower,
                sunshadeControl: boatControlStates.sunshade,
                sunroofControl: boatControlStates.sunroof,
                airConditioningControl: boatControlStates.airConditioning,
                wirelessInterface: wirelessInterfaceBool,
                momentaryRGBSwitchPrice: productData.momentaryRGBSwitch.cost,
                momentaryRGBSwitchHarnessPrice: productData.momentaryRGBSwitchHarness.cost,
                awgPowerCablePrice: productData.awgPowerCable.cost,
                powerInjectorPrice: productData.powerInjector.cost,
                oneWayTeeConnectorPrice: productData.oneWayTeeConnector.cost,
                twoWayTeeConnectorPrice: productData.twoWayTeeConnector.cost,
                fourWayTeeConnectorPrice: productData.fourWayTeeConnector.cost,
                backboneCable10mPrice: productData.backboneCable10m.cost,
                backboneCable8mPrice: productData.backboneCable8m.cost,
                backboneCable5mPrice: productData.backboneCable5m.cost,
                backboneCable2mPrice: productData.backboneCable2m.cost,
                backboneCableHalfMeterPrice: productData.backboneCableHalfMeter.cost,
                dropCablePrice: productData.dropCable.cost,
                terminatorFemalePrice: productData.terminatorFemale.cost,
                terminatorMalePrice: productData.terminatorMale.cost,
                sixOutputDigitalSwitchingBoxPrice: productData.sixOutputDigitalSwitchingBox.cost,
                twentySevenOutputDigitalSwitchingBoxPrice: productData.twentySevenOutputDigitalSwitchingBox.cost,
                wirelessInterfacePrice: productData.wirelessInterface.cost,
                sixWayKeypadPrice: productData.sixWayKeypad.cost,
                twelveWayKeypadPrice: productData.twelveWayKeypad.cost
            }
            await axios.post('/save-boat-setup', setupData)
            setShowSaveSuccessfulPopup(true)
        } else {
            navigate('/login')
        }
    }

    useEffect(() => {
        if (user) {
            try {
                const getBoatSetupData = async () => {
                    const { data } = await axios.get(`/boat-setup/${user.id}`)
                    setBoatSetupData(data)
                }
                getBoatSetupData()
            } catch (err) {
                console.log(err)
            }
        }
    }, [user])

    useEffect(() => {
        const isEmpty = obj => Object.keys(obj).length === 0;
        if (!isEmpty(boatSetupData)) {
            setBoatLength(boatSetupData.boatLength)
            if (boatSetupData.wirelessInterface) {
                setWirelessInterfaceBool(true)
            }

            const newLightStates = { ...lightStates };
            const newBoatControlStates = { ...boatControlStates };
            const newPumpStates = { ...pumpStates };
            const newProductData = { ...productData };

            lightTypes.forEach(light => {
                const parameterName = light + 'Lights'
                if (boatSetupData[parameterName]) {
                    newLightStates[light] = true;
                }
            });

            pumpTypes.forEach(pump => {
                const parameterName = pump + 'Pump'
                if (boatSetupData[parameterName]) {
                    newPumpStates[pump] = true;
                }
            })

            boatControlTypes.forEach(control => {
                const parameterName = control + 'Control'
                if (boatSetupData[parameterName]) {
                    newBoatControlStates[control] = true;
                }
            })

            productKeys.forEach(product => {
                const parameterName = product + 'Price'
                if (boatSetupData[parameterName] !== productData[product].cost) {
                    newProductData[product].cost = boatSetupData[parameterName]
                }
            })
            setLightStates(newLightStates);
            setPumpStates(newPumpStates);
            setBoatControlStates(newBoatControlStates);
            setProductData(newProductData);
        }
    }, [boatSetupData])

    return (
        <>
            <div className={`fixed top-0 left-0 z-[99] bg-black/50 w-full h-screen flex justify-center items-center ${showSaveSuccessfulPopup ? '' : 'hidden'}`}>
                <div className="w-[25rem] h-[15rem] bg-[#131313] border-4 border-[#FF7F11] flex flex-col justify-center items-center rounded-xl">
                    <p className="text-white font-semibold text-3xl">Setup Saved</p>
                    <button className="bg-white px-6 py-1 text-2xl font-semibold rounded-xl mt-6"
                        onClick={() => setShowSaveSuccessfulPopup(false)}
                    >Ok</button>
                </div>
            </div>
            <motion.div className={`pt-32 lgMobile:pt-[14rem] ${darkMode ? 'bg-[#131313] text-white' : 'bg-white text-black'}`}
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >
                <div className="w-fit h-[5rem] p-4 px-12 relative">
                    <p className="text-xl">Boat Length</p>
                    <label className="absolute right-14 top-[57%] text-xl">ft</label>
                    <input type="number" placeholder="Boat length (ft.)" className={`outline-none border-2 px-2 py-1 pr-8 text-xl ${darkMode ? 'bg-transparent text-white border-white' : 'border-black'}`}
                        value={boatLength}
                        onChange={(ev) => setBoatLength(Number(ev.target.value))}
                    />
                </div>

                <div className="w-full h-full mt-8 print:hidden">
                    <p className="text-2xl font-semibold border-2 rounded-xl text-center py-2">{`Switch Count: ${switchOnCount} / ${lightTypes && lightTypes.length > 0 ? lightTypes.length + pumpTypes.length + boatControlTypes.length : 0}`}</p>
                </div>
                <div className="w-full px-12 py-12 flex flex-wrap print:block">
                    <div className={`print:hidden w-[25rem] h-[30rem] mr-6 border-4 rounded-xl overflow-auto p-10 ${darkMode ? 'border-white' : 'border-black'}`}>
                        <p className={`w-full text-2xl font-semibold mb-4 border-b-2 pb-2 ${darkMode ? 'border-white' : 'border-black'}`}>Lights</p>
                        {lightTypes.map((lightType) => (
                            <div className="flex mb-4 w-full" key={lightType}>
                                <p className="mr-auto">{splitCamelCase(lightType.charAt(0).toUpperCase() + lightType.slice(1))} Lights</p>
                                <button className={`border-2 px-2 rounded-xl mr-4 ${lightStates[lightType] ? 'bg-[#FF7F11] text-white border-transparent' : ''} ${darkMode ? 'border-white' : 'border-black'}`}
                                    onClick={() => setLightStates(prev => ({ ...prev, [lightType]: !prev[lightType] }))}
                                >{lightStates[lightType] ? 'On' : 'Off'}</button>
                            </div>
                        ))}
                    </div>
                    <div className={`print:hidden w-[25rem] h-[30rem] mr-6 border-4 rounded-xl overflow-auto p-10 ${darkMode ? 'border-white' : 'border-black'}`}>
                        <p className={`w-full text-2xl font-semibold mb-4 border-b-2 pb-2 ${darkMode ? 'border-white' : 'border-black'}`}>Pumps</p>
                        {pumpTypes.map((pumpType) => (
                            <div className="flex mb-4" key={pumpType}>
                                <p className="mr-auto">{splitCamelCase(pumpType.charAt(0).toUpperCase() + pumpType.slice(1))} Pump</p>
                                <button className={`border-2 px-2 rounded-xl mr-4 ${pumpStates[pumpType] ? 'bg-[#FF7F11] text-white border-transparent' : ''} ${darkMode ? 'border-white' : 'border-black'}`}
                                    onClick={() => setPumpStates(prev => ({ ...prev, [pumpType]: !prev[pumpType] }))}
                                >{pumpStates[pumpType] ? 'On' : 'Off'}</button>
                            </div>
                        ))}
                    </div>
                    <div className={`print:hidden w-[25rem] h-[30rem] mr-6 border-4 rounded-xl overflow-auto p-10 ${darkMode ? 'border-white' : 'border-black'}`}>
                        <p className={`w-full text-2xl font-semibold mb-4 border-b-2 pb-2 ${darkMode ? 'border-white' : 'border-black'}`}>Boat Controls</p>
                        {boatControlTypes.map((controlType) => (
                            <div className="flex mb-4" key={controlType}>
                                <p className="mr-auto">{splitCamelCase(controlType.charAt(0).toUpperCase() + controlType.slice(1))} Control</p>
                                <button className={`border-2 px-2 rounded-xl mr-4 ${boatControlStates[controlType] ? 'bg-[#FF7F11] text-white border-transparent' : ''} ${darkMode ? 'border-white' : 'border-black'}`}
                                    onClick={() => setBoatControlStates(prev => ({ ...prev, [controlType]: !prev[controlType] }))}
                                >{boatControlStates[controlType] ? 'On' : 'Off'}</button>
                            </div>
                        ))}
                    </div>
                    <div className="w-1/4 lgMobile:w-full mt-8 print:w-full">
                        <ul className="lgMobile:space-y-4">
                            {boatLength > 0 && <li className="w-full flex"><span className="mr-auto">Number of NMEA 2000 Power Injectors:</span><div>1</div></li>}
                            {boatLength > 0 && <li className="w-full flex"><span className="mr-auto">Number of NMEA 2000 6.5ft drop cables:</span><div>1</div></li>}
                            {boatLength > 0 && switchOnCount > 0 && <li className="w-full flex"><span className="mr-auto">Total Length of 16AWG Power Cables:</span><span>{`${(switchOnCount * (boatLength * 0.6)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}ft`}</span></li>}
                            {num10mBackboneCables > 0 && <li className="w-full flex"><span className="mr-auto">Number of NMEA 2000 32ft backbone cables:</span><span>{num10mBackboneCables}</span></li>}
                            {num8mBackboneCables > 0 && <li className="w-full flex"><span className="mr-auto">Number of NMEA 2000 25.6ft backbone cables:</span><span>{num8mBackboneCables}</span></li>}
                            {num5mBackboneCables > 0 && <li className="w-full flex"><span className="mr-auto">Number of NMEA 2000 16ft backbone cables:</span><span>{num5mBackboneCables}</span></li>}
                            {num2mBackboneCables > 0 && <li className="w-full flex"><span className="mr-auto">Number of NMEA 2000 6.4ft backbone cables:</span><span>{num2mBackboneCables}</span></li>}
                            {numHalfMeterBackboneCables > 0 && <li className="w-full flex"><span className="mr-auto">Number of NMEA 2000 1.6ft backbone cables:</span><span>{numHalfMeterBackboneCables}</span></li>}
                        </ul>
                        <ul className="my-4">
                            {num6ButtonKeypads > 0 && <li className="w-full flex"><span className="mr-auto">Number of 6 Way Keypads:</span><span>{num6ButtonKeypads}</span></li>}
                            {num12ButtonKeypads > 0 && <li className="w-full flex"><span className="mr-auto">Number of 12 Way Keypads:</span><span>{num12ButtonKeypads}</span></li>}
                            {numsixOutputDigitalSwitchingBox > 0 && <li className="w-full flex"><span className="mr-auto">Number of 6 Output Digital Switching Boxes:</span><span>{numsixOutputDigitalSwitchingBox}</span></li>}
                            {numDDS > 0 && <li className="w-full flex"><span className="mr-auto">Number of 27 Output Digital Switching Boxes:</span><span>{numDDS}</span></li>}
                            {num1WayTeeConnectors > 0 && <li className="w-full flex"><span className="mr-auto">Number of 1 Way Tee Connectors:</span><span>{num1WayTeeConnectors}</span></li>}
                            {num2WayTeeConnectors > 0 && <li className="w-full flex"><span className="mr-auto">Number of 2 Way Tee Connectors:</span><span>{num2WayTeeConnectors}</span></li>}
                            {num4WayTeeConnectors > 0 && <li className="w-full flex"><span className="mr-auto">Number of 4 Way Tee Connectors:</span><span>{num4WayTeeConnectors}</span></li>}
                            <li className="w-full flex"><span className="mr-auto">Wireless Interface?:</span><span>{wirelessInterfaceBool ? 'Yes' : 'No'}</span></li>
                        </ul>
                        {cablingCost > 0 && <p className="font-semibold w-full flex"><span className="mr-auto">Total Cabling Cost:</span><span>{`$${cablingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span></p>}
                        {costOfKeypads > 0 && <p className="font-semibold w-full flex"><span className="mr-auto">Keypads Cost:</span><span>{`$${costOfKeypads.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span></p>}
                        {costOfOutputBoxes > 0 && <p className="font-semibold w-full flex"><span className="mr-auto">Digital Switching Boxes Cost:</span><span>{`$${costOfOutputBoxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span></p>}
                        {costOfWirelessInterface > 0 && <p className="font-semibold w-full flex"><span className="mr-auto">Wireless Interface Cost:</span><span>{`$${costOfWirelessInterface.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span></p>}

                        {totalCost > 0 && <p className="text-xl font-bold w-full flex"><span className="mr-auto">Total Cost:</span><span>{`$${manualTotalCost !== 0 ? Number(manualTotalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span></p>}

                        {totalWeight > 0 && <p className="text-xl font-bold w-full flex"><span className="mr-auto">Total Weight:</span><span>{` ${(totalWeight / 1000).toFixed(3)} lbs.`}</span></p>}
                        <button className={`${darkMode ? 'border-white' : 'border-black'} border-2 mt-4 w-full rounded-full py-1 font-semibold text-lg print:hidden ${showEditTotalCost ? 'hidden' : ''}`}
                            onClick={() => setShowEditTotalCost(true)}
                        >Edit Total Cost</button>
                        <div className={`print:hidden mt-4 flex flex-col ${showEditTotalCost ? '' : 'hidden'}`}>
                            <p className="font-semibold text-xl">Amount to add to total</p>
                            <input type="number" className="border-2 outline-none border-black p-1 mb-2" placeholder="$0.00"
                                value={addToTotalCostAmount}
                                onChange={(ev) => setAddToTotalCostAmount(Number(ev.target.value))}
                            />
                            <p className="font-semibold text-xl">Amount to subtract from total</p>
                            <input type="number" className="border-2 outline-none border-black p-1" placeholder="$0.00"
                                value={subtractToTotalCostAmount}
                                onChange={(ev) => setSubtractToTotalCostAmount(Number(ev.target.value))}
                            />
                            <button className="mt-4 border-2 border-black px-4 py-1 rounded-full font-semibold"
                                onClick={() => {
                                    saveTotalCostChanges();
                                    setShowEditTotalCost(false)
                                }}
                            >Save Changes</button>
                        </div>
                    </div>
                    <div className="w-full flex mt-6 print:hidden">
                        <p className="text-xl font-semibold mr-2">Wireless Interface?</p>
                        <button className={`border-2 px-2 rounded-xl mr-4 h-[2rem] ${wirelessInterfaceBool ? 'bg-[#FF7F11] text-white border-white' : ''} ${darkMode ? 'border-white' : 'border-black'}`}
                            onClick={() => setWirelessInterfaceBool(!wirelessInterfaceBool)}
                        >{wirelessInterfaceBool ? 'On' : 'Off'}</button>
                    </div>
                    <div>
                        <button className={`${darkMode ? 'border-white' : 'border-black'} mt-6 border-2 px-4 py-1 rounded-full font-semibold mr-2 print:hidden`}
                            onClick={() => clearInputs()}
                        >Clear Inputs</button>
                        <button className={`${darkMode ? 'border-white' : 'border-black'} mt-6 border-2 px-4 py-1 rounded-full font-semibold mr-2 print:hidden`}
                            onClick={() => addAllInputs()}
                        >Add All Options</button>
                        <button className={`${darkMode ? 'border-white' : 'border-black'} mt-6 border-2 px-4 py-1 rounded-full font-semibold print:hidden ${showChangeComponentPricing ? 'bg-[#FF7F11] text-white border-0' : ''}`}
                            onClick={() => setShowChangeComponentPricing(!showChangeComponentPricing)}
                        >{showChangeComponentPricing ? 'Close Component Pricing' : 'Change Component Pricing'}</button>
                        <button className={`print:hidden ml-2 font-semibold border-2 px-4 py-1 rounded-full ${darkMode ? 'border-white' : 'border-black'}`}
                            onClick={() => window.print()}
                        >Print Build</button>
                        <button className={`print:hidden ml-2 font-semibold border-2 px-4 py-1 rounded-full ${darkMode ? 'border-white' : 'border-black'}`}
                            onClick={() => saveBuildSetup()}
                        >Save Build</button>
                    </div>
                    <div className={`w-full mt-6 text-lg print:hidden ${showChangeComponentPricing ? '' : 'hidden'}`}>
                        <p className="font-semibold mb-4">Component Pricing:</p>
                        {productKeys && productKeys.length > 0 && productKeys.map((product, index) => {
                            const [newPrice, setNewPrice] = useState(0);
                            return (
                                <ul className="">
                                    <li className="mb-4 w-1/3">
                                        <div className="flex">
                                            <p className={`mr-auto ${changingProductPriceList[index] ? 'hidden' : ''}`}>{`- ${productData[product].name}: $${productData[product].units !== 'each' ? `${productData[product].cost} / ${productData[product].units.unit}` : (productData[product].cost).toFixed(2)}`}</p>
                                            <input type="number" placeholder="New price" className={`${changingProductPriceList[index] ? `border-2 p-1 mr-auto ${darkMode ? 'border-white' : 'border-black'}` : 'hidden'}`}
                                                onChange={(ev) => setNewPrice(Number(ev.target.value))}
                                            />
                                            <button className={`${darkMode ? 'border-white' : 'border-black'} border-2 ml-4 px-4 rounded-full ${changingProductPriceList[index] ? 'hidden' : ''}`}
                                                onClick={() => {
                                                    const anyTrue = changingProductPriceList.some(value => value)
                                                    if (!anyTrue) {
                                                        const updatedList = [...changingProductPriceList];
                                                        updatedList[index] = true;
                                                        setChangingProductPricingList(updatedList);
                                                    }
                                                }}
                                            >Change price</button>
                                            <button className={`border-2 px-2 rounded-full py-1 ${changingProductPriceList[index] ? '' : 'hidden'} bg-[#FF7F11] text-white border-transparent`}
                                                onClick={() => {
                                                    saveProductPriceChange(index, newPrice)
                                                    const updatedList = [...changingProductPriceList]
                                                    updatedList[index] = false;
                                                    setChangingProductPricingList(updatedList)
                                                }}
                                            >Save New Price</button>
                                        </div>
                                    </li>
                                </ul>
                            )
                        })}
                    </div>
                </div>

            </motion.div>
        </>
    );
}

export default Demos;