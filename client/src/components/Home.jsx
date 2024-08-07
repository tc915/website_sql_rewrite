import { AnimatePresence, motion, transform, useMotionValue } from "framer-motion"
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"
import Footer from "../partials/Footer";
import { UserContext } from "../UserContext";
import TextAreaAutosize from 'react-textarea-autosize';
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

const buttonVariants = {
    hover: {
        transform: 'translateY(2px)',
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


const Product = ({ product, index, darkMode, chooseProductFunc, setChooseProductPopup, productsPageIndex, productsPageImages, setProductsPageImages }) => {


    useEffect(() => {
        if (product.thumbnailImageId) {
            const imageDetails = {
                imgSrc: product.thumbnailImageId,
                imgId: product.thumbnailImageId
            }
            setProductsPageImages(prevImages => {
                const newImages = [...prevImages];
                newImages[index] = imageDetails;
                return newImages;
            })
        }
    }, [product])

    return (
        <button className="border-4 border-[#FF7F11] rounded-xl h-full w-[20rem] tablet:w-[15rem] min-w-[20rem] tablet:min-w-[15rem] mr-6 flex flex-col items-center"
            onClick={() => {
                chooseProductFunc(product, productsPageIndex);
                setChooseProductPopup(false);
            }}
        >
            <img src={`https://ideasthatfloat-server-lnr7.onrender.com/uploads/${product.thumbnailImageId}`} className='h-[60%] mt-10 object-cover' />
            <p className="mt-auto font-hind mb-4 font-semibold text-xl tablet:text-sm text-center px-10">{product.name}</p>
        </button>
    )
}

const Home = ({ scrollY }) => {

    const { user, darkMode, setDarkMode } = useContext(UserContext);

    const landingPageQuotes = ["Pushing The Boundaries of Technology, One Idea at a Time", "Innovating Today, Shaping Tomorrow", "Empowering Progress Through Innovation", "Creating Tomorrow’s Solutions, Today", "Revolutionizing Technology for a Brighter Future", "Transforming Ideas into Reality", "Leading the Way in Technological Advancement", "Innovation at the Speed of Thought", "Designing the Future with Every Breakthrough", "Driving Change Through Cutting-Edge Technology"]

    const [productNum, setProductNum] = useState(1);
    const [userChangeProductNum, setUserChangeProcuctNum] = useState(false);
    const [inProducts, setInProducts] = useState(false);
    const [adminPrivileges, setAdminPrivilegs] = useState(false);
    const [thinkTankText, setThinkTankText] = useState('');
    const [thinkTankImage, setThinkTankImage] = useState({});
    const [editThinkTank, setEditThinkTank] = useState(false);
    const [thinkTankImageFilename, setThinkTankImageFilename] = useState('');
    const [thinkTankImageId, setThinkTankImageId] = useState('');
    const [thinkTankContent, setThinkTankContent] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [thinkTankImgSrc, setThinkTankImgSrc] = useState({});


    const [editProducts, setEditProducts] = useState(false);
    const [productsPage, setProductsPage] = useState('product1');
    const [productsPageIndex, setProductsPageIndex] = useState(0);

    const [productsPageNames, setProductsPageNames] = useState(['', '', '', '', ''])
    const [productsPageDescriptions, setProductsPageDescriptions] = useState(['', '', '', '', ''])

    const [productsSectionProducts, setProductsSectionProducts] = useState([null, null, null, null, null]);

    const [productsPageImages, setProductsPageImages] = useState([]);


    const [chooseProductPopup, setChooseProductPopup] = useState(false);
    const chooseProductPopupRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [showcaseProducts, setShowcaseProducts] = useState([]);
    const [landingPageQuote, setLandingPageQuote] = useState("");

    const [savedProductPopup, setSavedProductPopup] = useState(false);

    const [widths, setWidths] = useState(["2em", "2em", "2em", "2em", "2em"]);
    const [colors, setColors] = useState(["#404040", "#404040", "#404040", "#404040", "#404040"]);

    useEffect(() => {
        setWidths(widths.map((width, index) => (productNum === index + 1 ? "6em" : "2em")));
        setColors(colors.map((color, index) => (productNum === index + 1 ? "#FF7F11" : "#404040")));
    }, [productNum]);

    useEffect(() => {
        const randomNum = Math.floor(Math.random() * landingPageQuotes.length)
        setLandingPageQuote(landingPageQuotes[randomNum])
    }, [])

    useEffect(() => {
        if (!userChangeProductNum && inProducts) {
            const timer = setTimeout(() => {
                if (productNum >= 1 && productNum < 5) {
                    setProductNum(productNum + 1)
                } else if (productNum === 5) {
                    setProductNum(1)
                }
            }, 5000);
            return () => clearTimeout(timer)
        } else {
            return
        }
    }, [productNum, inProducts])

    const scrollPoints = {
        'tablet': [{ start: 0, end: 999 }, { start: 1000, end: 1499 }, { start: 1500, end: 1999 }, { start: 2000, end: 2499 }, { start: 2500, end: 4306 }],
        'smLaptop': [{ start: 0, end: 1199 }, { start: 1200, end: 1799 }, { start: 1800, end: 2499 }, { start: 2500, end: 3099 }, { start: 3100, end: 5503 }],
        'laptop': [{ start: 0, end: 1099 }, { start: 1100, end: 1799 }, { start: 1800, end: 2499 }, { start: 2500, end: 3199 }, { start: 3200, end: 5552 }],
        'xxsm': [{ start: 0, end: 1199 }, { start: 1200, end: 1899 }, { start: 1900, end: 2599 }, { start: 2600, end: 3199 }, { start: 3200, end: 5610 }],
        'xsm': [{ start: 0, end: 1299 }, { start: 1300, end: 1999 }, { start: 2000, end: 2699 }, { start: 2700, end: 3299 }, { start: 3300, end: 5663 }],
        'sm': [{ start: 0, end: 1299 }, { start: 1300, end: 1999 }, { start: 2000, end: 2699 }, { start: 2700, end: 3399 }, { start: 3400, end: 5703 }],
        'md': [{ start: 0, end: 1499 }, { start: 1500, end: 2299 }, { start: 2300, end: 3199 }, { start: 3200, end: 3899 }, { start: 3900, end: 6659 }],
        'lg': [{ start: 0, end: 1499 }, { start: 1500, end: 2299 }, { start: 2300, end: 3199 }, { start: 3200, end: 3899 }, { start: 3900, end: 6712 }],
        'xl': [{ start: 0, end: 1699 }, { start: 1700, end: 2499 }, { start: 2500, end: 3399 }, { start: 3400, end: 4099 }, { start: 4100, end: 6832 }],
        'normal': [{ start: 0, end: 1999 }, { start: 2000, end: 2899 }, { start: 2900, end: 3899 }, { start: 3900, end: 4799 }, { start: 4800, end: 8034 }],
        'xxl': [{ start: 0, end: 2499 }, { start: 2500, end: 3899 }, { start: 3900, end: 5199 }, { start: 5200, end: 6499 }, { start: 6500, end: 10848 }]
    }

    let screenTypeName;

    if (window.innerWidth <= 768 && window.innerWidth > 425) {
        screenTypeName = 'tablet'
    } else if (window.innerWidth <= 950 && window.innerWidth > 768) {
        screenTypeName = 'smLaptop'
    } else if (window.innerWidth <= 1024 && window.innerWidth > 950) {
        screenTypeName = 'laptop'
    } else if (window.innerWidth <= 1110 && window.innerWidth > 1024) {
        screenTypeName = 'xxsm'
    } else if (window.innerWidth <= 1190 && window.innerWidth > 1110) {
        screenTypeName = 'xsm'
    } else if (window.innerWidth <= 1250 && window.innerWidth > 1190) {
        screenTypeName = 'sm'
    } else if (window.innerWidth <= 1360 && window.innerWidth > 1250) {
        screenTypeName = 'md'
    } else if (window.innerWidth <= 1440 && window.innerWidth > 1360) {
        screenTypeName = 'lg'
    } else if (window.innerWidth <= 1620 && window.innerWidth > 1440) {
        screenTypeName = 'xl'
    } else if (window.innerWidth <= 1920 && window.innerWidth > 1620) {
        screenTypeName = 'normal'
    } else if (window.innerWidth > 1920) {
        screenTypeName = 'xxl'
    }

    useEffect(() => {
        if (screenTypeName === 'tablet') {
            if (scrollY >= 3100 && scrollY <= 3400) {
                setInProducts(true)
            } else if (inProducts && scrollY < 3100 || inProducts && scrollY > 3400) {
                setInProducts(false)
                setUserChangeProcuctNum(false)
            }
        } else if (screenTypeName === 'smLaptop') {
            if (scrollY >= 3400 && scrollY <= 3700) {
                setInProducts(true)
            } else if (inProducts && scrollY < 3400 || inProducts && scrollY > 3700) {
                setInProducts(false)
                setUserChangeProcuctNum(false)
            }
        } else if (screenTypeName === 'laptop') {
            if (scrollY >= 3800 && scrollY <= 4300) {
                setInProducts(true)
            } else if (inProducts && scrollY < 3800 || inProducts && scrollY > 4300) {
                setInProducts(false)
                setUserChangeProcuctNum(false)
            }
        } else if (screenTypeName === 'xxsm') {
            if (scrollY >= 3800 && scrollY <= 4300) {
                setInProducts(true)
            } else if (inProducts && scrollY < 3800 || inProducts && scrollY > 4300) {
                setInProducts(false)
                setUserChangeProcuctNum(false)
            }
        } else if (screenTypeName === 'xsm') {
            if (scrollY >= 4100 && scrollY <= 4600) {
                setInProducts(true)
            } else if (inProducts && scrollY < 4100 || inProducts && scrollY > 4600) {
                setInProducts(false)
                setUserChangeProcuctNum(false)
            }
        } else if (screenTypeName === 'sm') {
            if (scrollY >= 4300 && scrollY <= 4900) {
                setInProducts(true)
            } else if (inProducts && scrollY < 3600 || inProducts && scrollY > 3900) {
                setInProducts(false)
                setUserChangeProcuctNum(false)
            }
        } else if (screenTypeName === 'md') {
            if (scrollY >= 4400 && scrollY <= 4900) {
                setInProducts(true)
            } else if (inProducts && scrollY < 4400 || inProducts && scrollY > 4900) {
                setInProducts(false)
                setUserChangeProcuctNum(false)
            }
        } else if (screenTypeName === 'lg') {
            if (scrollY >= 5000 && scrollY <= 5700) {
                setInProducts(true)
            } else if (inProducts && scrollY < 5000 || inProducts && scrollY > 5700) {
                setInProducts(false)
                setUserChangeProcuctNum(false)
            }
        } else if (screenTypeName === 'xl') {
            if (scrollY >= 5100 && scrollY <= 5800) {
                setInProducts(true)
            } else if (inProducts && scrollY < 5100 || inProducts && scrollY > 5800) {
                setInProducts(false)
                setUserChangeProcuctNum(false)
            }
        } else if (screenTypeName === 'normal') {
            if (scrollY >= 6100 && scrollY <= 6900) {
                setInProducts(true)
            } else if (inProducts && scrollY < 6100 || inProducts && scrollY > 6900) {
                setInProducts(false)
                setUserChangeProcuctNum(false)
            }
        } else if (screenTypeName === 'xxl') {
            if (scrollY >= 7400 && scrollY <= 8500) {
                setInProducts(true)
            } else if (inProducts && scrollY < 7400 || inProducts && scrollY > 8500) {
                setInProducts(false)
                setUserChangeProcuctNum(false)
            }
        }
    }, [scrollY]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (user) {
            const checkAdmin = async (user) => {
                const { data } = await axios.post('/check-admin', user);
                if (data === 'admin') {
                    setAdminPrivilegs(true);
                } else {
                    setAdminPrivilegs(false);
                }
            }
            checkAdmin(user);
        }
        setAdminPrivilegs(false);
    }, [user]);

    useEffect(() => {
        if (editThinkTank || editProducts) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [editThinkTank, editProducts]);

    const saveThinkTankEdits = async () => {
        const formData = new FormData();
        formData.append('thinkTankText', thinkTankText);
        formData.append('thinkTankImage', thinkTankImage);

        try {
            const { data } = await axios.post('/save-think-tank-edit', formData);
            setThinkTankContent(data);
            setRefresh(!refresh);
            setEditThinkTank(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const getThinkTankContent = async () => {
            try {
                const { data } = await axios.get('/get-think-tank-content');
                setThinkTankContent(data);
            } catch (err) {
                console.log(err);
            }
        }
        getThinkTankContent();
    }, [refresh]);

    useEffect(() => {
        if (thinkTankContent) {
            setThinkTankText(thinkTankContent.message);
            setThinkTankImageFilename(thinkTankContent.imageFileName);
            setThinkTankImageId(thinkTankContent.imageId);
        }
    }, [thinkTankContent]);

    useEffect(() => {
        const chooseProductPopupDiv = chooseProductPopupRef.current;

        const handleWheel = (e) => {
            e.preventDefault();
            chooseProductPopupDiv.scrollLeft += e.deltaY;
        };

        chooseProductPopupDiv.addEventListener('wheel', handleWheel);

        return () => {
            chooseProductPopupDiv.removeEventListener('wheel', handleWheel);
        }
    }, []);

    useEffect(() => {
        const getProducts = async () => {
            const { data } = await axios.get('/get-products');
            setProducts(data);
        }
        getProducts();
    }, []);

    const chooseProductFunc = (productDoc, index) => {
        setProductsSectionProducts(prevProducts => {
            const newProducts = [...prevProducts];
            newProducts[index] = productDoc;
            return newProducts;
        })
    }

    const saveProductsSection = async () => {
        const productData = { productsPageNames, productsPageDescriptions, productsSectionProducts };
        try {
            const { data } = await axios.post('/save-products-section', productData);
            setShowcaseProducts(data);
            setSavedProductPopup(true);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (showcaseProducts && showcaseProducts.length === 0) {
            try {
                const getShowcaseProducts = async () => {
                    const { data } = await axios.get('/showcase-products');
                    setShowcaseProducts(data);
                }
                getShowcaseProducts();
            } catch (err) {
                console.log(err);
            }
        }
    }, []);

    useEffect(() => {
        if (showcaseProducts && showcaseProducts.length > 0) {
            const updateProducts = async () => {
                for (let i = 0; i < showcaseProducts.length; i++) {
                    setProductsPageNames(prevNames => {
                        const newNames = [...prevNames];
                        newNames[i] = showcaseProducts[i].name;
                        return newNames;
                    });
                    setProductsPageDescriptions(prevDescriptions => {
                        const newDescriptions = [...prevDescriptions];
                        newDescriptions[i] = showcaseProducts[i].description;
                        return newDescriptions;
                    });
                    const getProduct = async () => {
                        try {
                            const { data } = await axios.get(`/product/${showcaseProducts[i].productId}`);
                            return data.productDoc;
                        } catch (err) {
                            console.log(err)
                        }
                    }
                    const product = await getProduct(i);
                    setProductsSectionProducts(prevProducts => {
                        const newProducts = [...prevProducts];
                        newProducts[i] = product;
                        return newProducts;
                    })
                }
            };
            updateProducts();
        }
    }, [showcaseProducts]);


    return (
        <>
            <div className={`fixed top-0 left-0 w-full h-screen z-[99] bg-black/50 flex justify-center items-center ${savedProductPopup ? '' : 'hidden'}`}>
                <div className="bg-[#131313] flex flex-col items-center justify-center w-[20rem] h-[10rem] rounded-xl border-4 border-[#FF7F11]">
                    <p className="text-white font-semibold text-2xl font-hind">Saved Products</p>
                    <button className="text-black font-semibold px-6 text-xl mt-6 py-1 rounded-xl bg-white font-hind"
                        onClick={() => setSavedProductPopup(false)}
                    >Ok</button>
                </div>
            </div>
            <div className={`fixed top-0 left-0 w-full h-screen z-[99] bg-black/50 justify-center items-center flex ${editThinkTank ? '' : 'hidden'} lgMobile:text-sm mdMobile:text-sm`}>
                <div className={`${darkMode ? 'bg-[#131313] text-white' : 'bg-white text-black'} w-[50rem] tablet:w-[80%] xlMobile:w-[90%] h-[33rem] tablet:h-[80%] xlMobile:h-[70%] relative flex flex-col items-center rounded-xl overflow-y-auto`}>
                    <button className="absolute top-4 right-4"
                        onClick={() => setEditThinkTank(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[50px] w-[50px] tablet:h-[32px] tablet:w-[32px]" viewBox="0 -960 960 960" fill={`${darkMode ? '#fff' : '#131313'}`}><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                    </button>
                    <h2 className="text-3xl tablet:text-lg lgMobile:text-xl mdMobile:text-xl font-semibold mt-6 font-ruda">Edit Think Tank</h2>
                    <p className="w-2/3 mt-10 text-xl tablet:text-lg lgMobile:text-lg mdMobile:text-lg font-semibold font-hind">Message:</p>
                    <TextAreaAutosize className={`bg-transparent resize-none w-2/3 border-2 rounded-xl mt-4 p-4 text-xl smLaptop:text-lg font-shanti tablet:text-lg tablet:min-h-[8rem] xlMobile:min-h-[8rem] lgMobile:text-lg mdMobile:text-lg ${darkMode ? 'outline-white' : ''}`} required placeholder="Message"
                        value={thinkTankText}
                        onChange={(ev) => setThinkTankText(ev.target.value)}
                    />
                    <p className="w-2/3 mt-10 text-xl tablet:text-lg lgMobile:text-lg mdMobile:text-lg font-semibold font-hind">Image (Required to save properly):</p>
                    <input type="file" name="imageInput" id="imageInput" className="hidden"
                        onChange={(ev) => {
                            setThinkTankImage(ev.target.files[0]);
                            setThinkTankImageFilename(ev.target.files[0].name)
                        }}
                    />
                    <div className="w-full flex tablet:flex-col xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col items-center mt-4">
                        <label htmlFor="imageInput" className="py-6 tablet:py-2 xlMobile:py-2 lgMobile:py-2 mdMobile:py-2 px-10 tablet:px-5 lgMobile:px-5 mdMobile:px-5 self-start ml-[8.3rem] tablet:ml-[35%] lgMobile:ml-28 mdMobile:ml-28 rounded-xl font-semibold text-xl font-hind lgMobile:text-lg mdMobile:text-lg border-4 border-[#FF7F11]">Choose Image</label>
                        <p className="text-lg font-shanti tablet:text-[1rem] lgMobile:text-[1rem] mdMobile:text-[1rem] ml-4">{thinkTankImageFilename}</p>
                    </div>
                    <button className="w-2/3 bg-[#FF7F11] text-white my-10 py-2 rounded-full text-xl font-semibold font-hind"
                        onClick={() => saveThinkTankEdits()}
                    >Save Edits</button>
                </div>
            </div>
            <div className={`fixed top-0 left-0 z-[99] bg-black/50 w-full h-screen flex justify-center items-center ${chooseProductPopup ? '' : 'hidden'}`}>
                <div ref={chooseProductPopupRef} className={`${darkMode ? 'bg-[#131313] text-white' : 'bg-white text-black'} w-[70rem] smLaptop:w-[90%] tablet:w-[90%] h-[30rem] tablet:h-[80%] overflow-x-auto overflow-y-hidden flex p-6 py-14 relative`}>
                    <button className="fixed top-[17rem] smLaptop:top-[6.2rem] tablet:top-12 right-[26rem] smLaptop:right-14 tablet:right-10 z-[99]"
                        onClick={() => setChooseProductPopup(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[45px] w-[45px] tablet:h-[32px] tablet:w-[32px]" viewBox="0 -960 960 960" fill={darkMode ? '#fff' : '#131313'}><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                    </button>
                    <h2 className="fixed top-[17rem] smLaptop:top-[6.4rem] tablet:top-14 left-[56rem] smLaptop:left-[44%] tablet:left-[42%] font-semibold text-xl tablet:text-lg font-hind">Choose a Product</h2>
                    {products && products.length > 0 && products.map((product, index) => (
                        <div key={index}>

                            <Product product={product} index={index} darkMode={darkMode} chooseProductFunc={chooseProductFunc} setChooseProductPopup={setChooseProductPopup} productsPageIndex={productsPageIndex} productsPageImages={productsPageImages} setProductsPageImages={setProductsPageImages} />
                        </div>
                    ))}
                </div>
            </div>
            <div className={`${editProducts ? '' : 'hidden'} flex justify-center items-center fixed top-0 left-0 w-full h-screen bg-black/50 z-[98]`}>
                <div className={`${darkMode ? 'bg-[#131313] text-white' : 'bg-white text-black'} h-[35rem] tablet:h-[90%] w-[50rem] tablet:w-[70%] rounded-2xl flex flex-col items-center relative overflow-auto`}>
                    <button className="absolute top-4 right-4"
                        onClick={() => setEditProducts(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[50px] w-[50px] tablet:h-[32px] tablet:w-[32px]" viewBox="0 -960 960 960" fill={`${darkMode ? '#fff' : '#131313'}`}><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                    </button>
                    <h2 className="font-[900] text-3xl tablet:text-xl font-ruda mt-6">Edit Products</h2>
                    <div className="h-full w-full flex">
                        <div className="h-full w-[10rem] tablet:w-[7rem] py-10 tablet:py-4">
                            <button className={`${productsPage === 'product1' ? 'bg-[#FF7F11] text-white' : (darkMode ? 'text-white' : 'text-black')} w-full text-start pl-4 rounded-e-full h-[3rem] tablet:h-[2.25rem] font-semibold text-lg tablet:text-[1rem] mb-2 font-hind`}
                                onClick={() => {
                                    setProductsPage('product1');
                                    setProductsPageIndex(0);
                                }}
                            >Product 1</button>
                            <button className={`${productsPage === 'product2' ? 'bg-[#FF7F11] text-white' : (darkMode ? 'text-white' : 'text-black')} w-full text-start pl-4 rounded-e-full h-[3rem] tablet:h-[2.25rem] font-semibold text-lg tablet:text-[1rem] mb-2 font-hind`}
                                onClick={() => {
                                    setProductsPage('product2');
                                    setProductsPageIndex(1);
                                }}
                            >Product 2</button>
                            <button className={`${productsPage === 'product3' ? 'bg-[#FF7F11] text-white' : (darkMode ? 'text-white' : 'text-black')} w-full text-start pl-4 rounded-e-full h-[3rem] tablet:h-[2.25rem] font-semibold text-lg tablet:text-[1rem] mb-2 font-hind`}
                                onClick={() => {
                                    setProductsPage('product3');
                                    setProductsPageIndex(2);
                                }}
                            >Product 3</button>
                            <button className={`${productsPage === 'product4' ? 'bg-[#FF7F11] text-white' : (darkMode ? 'text-white' : 'text-black')} w-full text-start pl-4 rounded-e-full h-[3rem] tablet:h-[2.25rem] font-semibold text-lg tablet:text-[1rem] mb-2 font-hind`}
                                onClick={() => {
                                    setProductsPage('product4');
                                    setProductsPageIndex(3);
                                }}
                            >Product 4</button>
                            <button className={`${productsPage === 'product5' ? 'bg-[#FF7F11] text-white' : (darkMode ? 'text-white' : 'text-black')} w-full text-start pl-4 rounded-e-full h-[3rem] tablet:h-[2.25rem] font-semibold text-lg tablet:text-[1rem] mb-2 font-hind`}
                                onClick={() => {
                                    setProductsPage('product5');
                                    setProductsPageIndex(4);
                                }}
                            >Product 5</button>
                        </div>
                        <div className="h-full w-[30rem] tablet:w-[60%] flex flex-col items-center">
                            {productsPage === 'product1' && (
                                <>
                                    <p className="self-start mt-16 tablet:mt-10 ml-10 text-xl tablet:text-sm font-shanti">Product Name:</p>
                                    <input type="text" className="bg-transparent font-shanti border-b-2 w-[25rem] tablet:w-[80%] mt-4 text-xl tablet:text-sm p-2 outline-none" placeholder="Name" required
                                        value={productsPageNames[0]}
                                        onChange={(ev) => {
                                            setProductsPageNames(prevNames => {
                                                const newNames = [...prevNames];
                                                newNames[0] = ev.target.value;
                                                return newNames;
                                            })
                                        }}
                                    />
                                    <p className="self-start font-shanti ml-10 text-xl tablet:text-sm mt-10">Product Description</p>
                                    <TextAreaAutosize className="bg-transparent font-shanti border-b-2 w-[25rem] tablet:w-[80%] mt-4 text-xl tablet:text-sm p-2 outline-none resize-none" placeholder="Description"
                                        value={productsPageDescriptions[0]}
                                        onChange={(ev) => {
                                            setProductsPageDescriptions(prevDescriptions => {
                                                const newDescriptions = [...prevDescriptions];
                                                newDescriptions[0] = ev.target.value;
                                                return newDescriptions;
                                            })
                                        }}
                                    />
                                    <button className="bg-[#FF7F11] text-white mt-6 w-1/3 tablet:w-[40%] rounded-full p-2 tablet:py-1 tablet:px-2  text-lg tablet:text-sm font-semibold font-hind"
                                        onClick={() => {
                                            setChooseProductPopup(true);
                                        }}
                                    >Choose product</button>
                                    <p className="tablet:text-sm font-shanti">{productsSectionProducts[0] !== null ? productsSectionProducts[0].name : ''}</p>
                                    <button className="bg-[#FF7F11] text-white mt-4 w-3/4 rounded-full p-2 tablet:p-1 text-xl tablet:text-sm font-hind font-semibold mb-10"
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            saveProductsSection();
                                        }}
                                    >Save</button>
                                </>

                            )}
                            {productsPage === 'product2' && (
                                <>
                                    <p className="self-start ml-10 mt-16 tablet:mt-10 text-xl tablet:text-sm font-shanti">Product Name:</p>
                                    <input type="text" className="bg-transparent font-shanti border-b-2 w-[25rem] tablet:w-[80%] mt-4 text-xl tablet:text-sm p-2 outline-none" placeholder="Name" required
                                        value={productsPageNames[1]}
                                        onChange={(ev) => {
                                            setProductsPageNames(prevNames => {
                                                const newNames = [...prevNames];
                                                newNames[1] = ev.target.value;
                                                return newNames;
                                            })
                                        }}
                                    />
                                    <p className="self-start font-shanti ml-10 text-xl tablet:text-sm mt-10">Product Description</p>
                                    <TextAreaAutosize className="bg-transparent font-shanti border-b-2 w-[25rem] tablet:w-[80%] mt-4 text-xl tablet:text-sm p-2 outline-none resize-none" placeholder="Description"
                                        value={productsPageDescriptions[1]}
                                        onChange={(ev) => {
                                            setProductsPageDescriptions(prevDescriptions => {
                                                const newDescriptions = [...prevDescriptions];
                                                newDescriptions[1] = ev.target.value;
                                                return newDescriptions;
                                            })
                                        }}
                                    />
                                    <button className="bg-[#FF7F11] text-white mt-6 w-1/3 tablet:w-[40%] rounded-full p-2 tablet:py-1 tablet:px-2 text-lg tablet:text-sm font-semibold font-hind"
                                        onClick={() => {
                                            setChooseProductPopup(true);
                                        }}
                                    >Choose product</button>
                                    <p className="tablet:text-sm font-shanti">{productsSectionProducts[1] !== null ? productsSectionProducts[1].name : ''}</p>
                                    <button className="bg-[#FF7F11] text-white mt-4 w-3/4 rounded-full p-2 tablet:p-1 text-xl tablet:text-sm font-semibold font-hind mb-10"
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            saveProductsSection();
                                        }}
                                    >Save</button>
                                </>

                            )}
                            {productsPage === 'product3' && (
                                <>
                                    <p className="self-start ml-10 mt-16 tablet:mt-10 text-xl tablet:text-sm font-shanti">Product Name:</p>
                                    <input type="text" className="bg-transparent border-b-2 w-[25rem] tablet:w-[80%] mt-4 text-xl font-shanti tablet:text-sm p-2 outline-none" placeholder="Name" required
                                        value={productsPageNames[2]}
                                        onChange={(ev) => {
                                            setProductsPageNames(prevNames => {
                                                const newNames = [...prevNames];
                                                newNames[2] = ev.target.value;
                                                return newNames;
                                            })
                                        }}
                                    />
                                    <p className="self-start font-shanti ml-10 text-xl tablet:text-sm mt-10">Product Description</p>
                                    <TextAreaAutosize className="bg-transparent font-shanti border-b-2 w-[25rem] tablet:w-[80%] mt-4 text-xl tablet:text-sm p-2 outline-none resize-none" placeholder="Description"
                                        value={productsPageDescriptions[2]}
                                        onChange={(ev) => {
                                            setProductsPageDescriptions(prevDescriptions => {
                                                const newDescriptions = [...prevDescriptions];
                                                newDescriptions[2] = ev.target.value;
                                                return newDescriptions;
                                            })
                                        }}
                                    />
                                    <button className="bg-[#FF7F11] text-white mt-6 w-1/3 tablet:w-[40%] rounded-full p-2 tablet:py-1 tablet:px-2 text-lg tablet:text-sm font-semibold font-hind"
                                        onClick={() => {
                                            setChooseProductPopup(true);
                                        }}
                                    >Choose product</button>
                                    <p className="tablet:text-sm font-shanti">{productsSectionProducts[2] !== null ? productsSectionProducts[2].name : ''}</p>
                                    <button className="bg-[#FF7F11] text-white mt-4 w-3/4 rounded-full p-2 tablet:p-1 text-xl tablet:text-sm font-semibold mb-10"
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            saveProductsSection();
                                        }}
                                    >Save</button>
                                </>

                            )}
                            {productsPage === 'product4' && (
                                <>
                                    <p className="self-start ml-10 mt-16 tablet:mt-10 text-xl tablet:text-sm font-shanti">Product Name:</p>
                                    <input type="text" className="bg-transparent border-b-2 w-[25rem] tablet:w-[80%] mt-4 text-xl font-shanti tablet:text-sm p-2 outline-none" placeholder="Name" required
                                        value={productsPageNames[3]}
                                        onChange={(ev) => {
                                            setProductsPageNames(prevNames => {
                                                const newNames = [...prevNames];
                                                newNames[3] = ev.target.value;
                                                return newNames;
                                            })
                                        }}
                                    />
                                    <p className="self-start font-shanti ml-10 text-xl tablet:text-sm mt-10">Product Description</p>
                                    <TextAreaAutosize className="bg-transparent font-shanti border-b-2 w-[25rem] tablet:w-[80%] mt-4 text-xl tablet:text-sm p-2 outline-none resize-none" placeholder="Description"
                                        value={productsPageDescriptions[3]}
                                        onChange={(ev) => {
                                            setProductsPageDescriptions(prevDescriptions => {
                                                const newDescriptions = [...prevDescriptions];
                                                newDescriptions[3] = ev.target.value;
                                                return newDescriptions;
                                            })
                                        }}
                                    />
                                    <button className="bg-[#FF7F11] text-white mt-6 w-1/3 tablet:w-[40%] rounded-full p-2 tablet:py-1 tablet:px-1 text-lg tablet:text-sm font-semibold font-hind"
                                        onClick={() => {
                                            setChooseProductPopup(true);
                                        }}
                                    >Choose product</button>
                                    <p className="tablet:text-sm font-shanti">{productsSectionProducts[3] !== null ? productsSectionProducts[3].name : ''}</p>
                                    <button className="bg-[#FF7F11] text-white mt-4 w-3/4 rounded-full p-2 tablet:p-1 text-xl tablet:text-sm font-semibold font-hind mb-10"
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            saveProductsSection();
                                        }}
                                    >Save</button>
                                </>

                            )}
                            {productsPage === 'product5' && (
                                <>
                                    <p className="self-start ml-10 font-shanti mt-16 tablet:mt-10 text-xl tablet:text-sm">Product Name:</p>
                                    <input type="text" className="bg-transparent font-shanti border-b-2 w-[25rem] tablet:w-[80%] mt-4 text-xl tablet:text-sm p-2 outline-none" placeholder="Name" required
                                        value={productsPageNames[4]}
                                        onChange={(ev) => {
                                            setProductsPageNames(prevNames => {
                                                const newNames = [...prevNames];
                                                newNames[4] = ev.target.value;
                                                return newNames;
                                            })
                                        }}
                                    />
                                    <p className="self-start ml-10 font-shanti text-xl tablet:text-sm mt-10">Product Description</p>
                                    <TextAreaAutosize className="bg-transparent font-shanti border-b-2 w-[25rem] tablet:w-[80%] mt-4 text-xl tablet:text-sm p-2 outline-none resize-none" placeholder="Description"
                                        value={productsPageDescriptions[4]}
                                        onChange={(ev) => {
                                            setProductsPageDescriptions(prevDescriptions => {
                                                const newDescriptions = [...prevDescriptions];
                                                newDescriptions[4] = ev.target.value;
                                                return newDescriptions;
                                            })
                                        }}
                                    />
                                    <button className="bg-[#FF7F11] text-white mt-6 w-1/3 tablet:w-[40%] rounded-full p-2 tablet:py-1 tablet:px-2 text-lg tablet:text-sm font-semibold font-hind"
                                        onClick={() => {
                                            setChooseProductPopup(true);
                                        }}
                                    >Choose product</button>
                                    <p className="tablet:text-sm font-shanti">{productsSectionProducts[4] !== null ? productsSectionProducts[4].name : ''}</p>
                                    <button className="bg-[#FF7F11] text-white mt-4 w-3/4 rounded-full p-2 tablet:p-1 text-xl tablet:text-sm font-semibold font-hind mb-10"
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            saveProductsSection();
                                        }}
                                    >Save</button>
                                </>

                            )}
                        </div>
                    </div>
                </div>
            </div>
            <motion.div className={`relative w-full lgMobile:pt-[12rem] tablet:pt-[5rem] ${darkMode ? 'bg-[#131313]' : 'bg-white'} lgMobile:overflow-x-hidden mdMobile:overflow-x-hidden`}
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >
                <motion.div className={`w-full xlMobile:w-full mdMobile:w-[30rem] lgMobile:w-[30rem] xlMobile:overflow-hidden lgMobile:overflow-hidden mdMobile:overflow-hidden`}>
                    <img className="-z-[5] w-full object-cover xlMobile:h-[56rem] lgMobile:h-[38rem] mdMobile:h-[45rem]" src="motherboard_bg_unsplash.jpg" />
                    <div className="w-full h-[20rem] absolute -mt-[52rem] xl:-mt-[53rem] sm:-mt-[50rem] xsm:-mt-[54rem] xxsm:-mt-[52rem] laptop:-mt-[50rem] xlMobile:-mt-[35rem] lgMobile:-mt-[36rem] lgMobile:w-[85%] text-white pl-[9.5rem] md:pl-[6rem] sm:pl-[6rem] xsm:pl-[7rem] xxsm:pl-[7rem] xxsm:pr-[10rem] laptop:pl-[5rem] laptop:pr-[10rem] smLaptop:pl-[5rem] tablet:pl-[5rem] xlMobile:pl-[3rem] xlMobile:pr-[2rem] lgMobile:pl-[3rem] mdMobile:pl-[3rem] mdMobile:pr-[5rem] mdMobile:w-full mdMobile:-mt-[30rem]">
                        <h1 className="font-[900] text-5xl xl:mt-36 lg:mt-44 md:mt-[15rem] md:text-5xl sm:mt-[18rem] sm:text-5xl xsm:mt-[24rem] xsm:text-4xl xxsm:mt-[24rem] xxsm:text-4xl laptop:mt-[25rem] laptop:text-4xl smLaptop:mt-[30rem] smLaptop:text-3xl xl:pr-[15rem] lg:pr-[15rem] md:pr-[10rem] sm:pr-[10rem] xsm:pr-[15rem] smLaptop:pr-[12rem] tablet:mt-[28rem] tablet:text-xl xlMobile:text-4xl lgMobile:text-xl lgMobile:mt-24 mdMobile:text-xl font-ruda">{landingPageQuote}</h1>
                        <div className="flex mt-16 xlMobile:mt-10 xlMobile:flex-col lgMobile:mt-8 lgMobile:flex-col mdMobile:flex-col">
                            <Link to={'/contact'}><motion.button className="py-2 px-10 lgMobile:py-2 lgMobile:px-8 mdMobile:px-10 text-xl xlMobile:text-2xl lgMobile:text-xl mdMobile:text-lg rounded-full bg-[#FF7F11] font-hind font-[600]"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="click"
                            >Start a Project</motion.button></Link>
                            <Link to={'/products'}><motion.button className="py-2 px-6 lgMobile:py-2 lgMobile:px-8 mdMobile:px-10 ml-8 xlMobile:ml-0 xlMobile:mt-8 lgMobile:ml-0 mdMobile:ml-0 mdMobile:mt-6 lgMobile:mt-6 text-xl xlMobile:text-2xl lgMobile:text-lg mdMobile:text-lg rounded-full border-2 border-white font-hind font-[600]"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="click"
                            >Our Products</motion.button></Link>
                        </div>
                    </div>
                    <div className="flex xlMobile:flex-col xlMobile:-mt-[20rem] lgMobile:flex-col mdMobile:flex-col">
                        <div className="w-[40%] xlMobile:w-[10%] lgMobile:w-[10%] mdMobile:w-[10%] px-32 lg:pr-0 md:pr-0 sm:pr-0 xsm:pr-0 xxsm:pr-0 laptop:px-24 laptop:pr-0 smLaptop:px-20 smLaptop:pr-0 tablet:px-24 py-56 md:py-36 sm:py-36 xsm:py-36 xxsm:py-36 laptop:py-32 smLaptop:py-32 tablet:py-24 xlMobile:px-12 lgMobile:px-10 mdMobile:px-6 lgMobile:py-24 mdMobile:py-20">
                            <div className="sticky h-[65vh] lg:h-[50vh] md:h-[54vh] sm:h-[45vh] xsm:h-[42vh] xxsm:h-[40vh] laptop:h-[30vh] smLaptop:h-[50vh] top-[28vh] laptop:top-[32vh] smLaptop:top-[32vh] xlMobile:hidden lgMobile:hidden mdMobile:hidden">
                                <h2 className={`font-[900] font-ruda text-6xl sm:text-[3.25rem] xsm:text-5xl xxsm:text-5xl laptop:text-5xl smLaptop:text-4xl lgMobile:text-2xl lgMobile:w-[20rem] tablet:text-3xl tablet:w-[15rem] ${darkMode ? 'text-white' : 'text-black'}`}>What We Do</h2>
                                <ul className="text-5xl sm:text-[2.65rem] xsm:text-4xl xxsm:text-4xl laptop:text-4xl smLaptop:text-3xl lgMobile:text-3xl tablet:text-2xl font-[600] font-hind mt-14 md:mt-10 sm:mt-10 xsm:mt-10 xxsm:mt-10 laptop:mt-6 smLaptop:mt-8 tablet:mt-6 text-[#767676]">
                                    <li className={`mb-5 xsm:mb-4 xxsm:mb-3 laptop:mb-3 smLaptop:mb-2 tablet:mb-1 p-2 ${screenTypeName === 'tablet' ? scrollY >= scrollPoints.tablet[0].start && scrollY < scrollPoints.tablet[0].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : '' : screenTypeName === 'smLaptop' ? scrollY >= scrollPoints.smLaptop[0].start && scrollY < scrollPoints.smLaptop[0].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'laptop' ? scrollY >= scrollPoints.laptop[0].start && scrollY < scrollPoints.laptop[0].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xxsm' ? scrollY >= scrollPoints.xxsm[0].start && scrollY < scrollPoints.xxsm[0].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xsm' ? scrollY >= scrollPoints.xsm[0].start && scrollY < scrollPoints.xsm[0].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'sm' ? scrollY >= scrollPoints.sm[0].start && scrollY < scrollPoints.sm[0].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'md' ? scrollY >= scrollPoints.md[0].start && scrollY < scrollPoints.md[0].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'lg' ? scrollY >= scrollPoints.lg[0].start && scrollY < scrollPoints.lg[0].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xl' ? scrollY >= scrollPoints.xl[0].start && scrollY < scrollPoints.xl[0].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'normal' ? scrollY >= scrollPoints.normal[0].start && scrollY < scrollPoints.normal[0].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xxl' ? scrollY >= scrollPoints.xxl[0].start && scrollY < scrollPoints.xxl[0].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : ""}`}>Ideation</li>
                                    <li className={`mb-5 xsm:mb-4 xxsm:mb-3 laptop:mb-3 smLaptop:mb-2 tablet:mb-1 p-2 ${screenTypeName === 'tablet' ? scrollY >= scrollPoints.tablet[1].start && scrollY < scrollPoints.tablet[1].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : '' : screenTypeName === 'smLaptop' ? scrollY >= scrollPoints.smLaptop[1].start && scrollY < scrollPoints.smLaptop[1].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'laptop' ? scrollY >= scrollPoints.laptop[1].start && scrollY < scrollPoints.laptop[1].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xxsm' ? scrollY >= scrollPoints.xxsm[1].start && scrollY < scrollPoints.xxsm[1].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xsm' ? scrollY >= scrollPoints.xsm[1].start && scrollY < scrollPoints.xsm[1].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'sm' ? scrollY >= scrollPoints.sm[1].start && scrollY < scrollPoints.sm[1].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'md' ? scrollY >= scrollPoints.md[1].start && scrollY < scrollPoints.md[1].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'lg' ? scrollY >= scrollPoints.lg[1].start && scrollY < scrollPoints.lg[1].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xl' ? scrollY >= scrollPoints.xl[1].start && scrollY < scrollPoints.xl[1].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'normal' ? scrollY >= scrollPoints.normal[1].start && scrollY < scrollPoints.normal[1].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xxl' ? scrollY >= scrollPoints.xxl[1].start && scrollY < scrollPoints.xxl[1].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : ""}`}>Mechanical</li>
                                    <li className={`mb-5 xsm:mb-4 xxsm:mb-3 laptop:mb-3 smLaptop:mb-2 tablet:mb-1 p-2 ${screenTypeName === 'tablet' ? scrollY >= scrollPoints.tablet[2].start && scrollY < scrollPoints.tablet[2].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : '' : screenTypeName === 'smLaptop' ? scrollY >= scrollPoints.smLaptop[2].start && scrollY < scrollPoints.smLaptop[2].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'laptop' ? scrollY >= scrollPoints.laptop[2].start && scrollY < scrollPoints.laptop[2].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xxsm' ? scrollY >= scrollPoints.xxsm[2].start && scrollY < scrollPoints.xxsm[2].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xsm' ? scrollY >= scrollPoints.xsm[2].start && scrollY < scrollPoints.xsm[2].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'sm' ? scrollY >= scrollPoints.sm[2].start && scrollY < scrollPoints.sm[2].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'md' ? scrollY >= scrollPoints.md[2].start && scrollY < scrollPoints.md[2].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'lg' ? scrollY >= scrollPoints.lg[2].start && scrollY < scrollPoints.lg[2].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xl' ? scrollY >= scrollPoints.xl[2].start && scrollY < scrollPoints.xl[2].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'normal' ? scrollY >= scrollPoints.normal[2].start && scrollY < scrollPoints.normal[2].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xxl' ? scrollY >= scrollPoints.xxl[2].start && scrollY < scrollPoints.xxl[2].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : ""}`}>Electrical</li>
                                    <li className={`mb-5 xsm:mb-4 xxsm:mb-3 laptop:mb-3 smLaptop:mb-2 tablet:mb-1 p-2 ${screenTypeName === 'tablet' ? scrollY >= scrollPoints.tablet[3].start && scrollY < scrollPoints.tablet[3].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : '' : screenTypeName === 'smLaptop' ? scrollY >= scrollPoints.smLaptop[3].start && scrollY < scrollPoints.smLaptop[3].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'laptop' ? scrollY >= scrollPoints.laptop[3].start && scrollY < scrollPoints.laptop[3].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xxsm' ? scrollY >= scrollPoints.xxsm[3].start && scrollY < scrollPoints.xxsm[3].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xsm' ? scrollY >= scrollPoints.xsm[3].start && scrollY < scrollPoints.xsm[3].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'sm' ? scrollY >= scrollPoints.sm[3].start && scrollY < scrollPoints.sm[3].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'md' ? scrollY >= scrollPoints.md[3].start && scrollY < scrollPoints.md[3].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'lg' ? scrollY >= scrollPoints.lg[3].start && scrollY < scrollPoints.lg[3].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xl' ? scrollY >= scrollPoints.xl[3].start && scrollY < scrollPoints.xl[3].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'normal' ? scrollY >= scrollPoints.normal[3].start && scrollY < scrollPoints.normal[3].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xxl' ? scrollY >= scrollPoints.xxl[3].start && scrollY < scrollPoints.xxl[3].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : ""}`}>Software</li>
                                    <li className={`p-2 ${screenTypeName === 'tablet' ? scrollY >= scrollPoints.tablet[4].start && scrollY < scrollPoints.tablet[4].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : '' : screenTypeName === 'smLaptop' ? scrollY >= scrollPoints.smLaptop[4].start && scrollY < scrollPoints.smLaptop[4].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'laptop' ? scrollY >= scrollPoints.laptop[4].start && scrollY < scrollPoints.laptop[4].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xxsm' ? scrollY >= scrollPoints.xxsm[4].start && scrollY < scrollPoints.xxsm[4].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xsm' ? scrollY >= scrollPoints.xsm[4].start && scrollY < scrollPoints.xsm[4].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'sm' ? scrollY >= scrollPoints.sm[4].start && scrollY < scrollPoints.sm[4].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'md' ? scrollY >= scrollPoints.md[4].start && scrollY < scrollPoints.md[4].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'lg' ? scrollY >= scrollPoints.lg[4].start && scrollY < scrollPoints.lg[4].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xl' ? scrollY >= scrollPoints.xl[4].start && scrollY < scrollPoints.xl[4].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'normal' ? scrollY >= scrollPoints.normal[4].start && scrollY < scrollPoints.normal[4].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : screenTypeName === 'xxl' ? scrollY >= scrollPoints.xxl[4].start && scrollY < scrollPoints.xxl[4].end ? 'bg-gradient-to-r from-[#FF7F11] to-[#ffdd8b] text-transparent inline-block bg-clip-text' : "" : ""}`}>Manufacturing</li>
                                </ul>
                            </div>
                        </div>
                        <div className="w-[60%] xlMobile:w-full lgMobile:w-full mdMobile:w-full">
                            <h2 className={`xlMobile:block lgMobile:block mdMobile:block hidden font-[800] font-ruda text-3xl xlMobile:text-5xl w-full text-center xlMobile:-ml-[4rem] xlMobile:-mb-10 lgMobile:-ml-[6.2rem] mdMobile:-ml-[7.25rem] -mb-24 ${darkMode ? 'text-white' : 'text-black'}`}>What We Do</h2>
                            <div className={`w-full lgMobile:w-[90%] h-screen xlMobile:h-[60rem] p-6 xlMobile:p-0 -ml-6 xlMobile:ml-0 lgMobile:mr-6 mdMobile:-ml-12 mdMobile:pr-10 tablet:ml-0 flex flex-col items-center ${darkMode ? 'text-white' : 'text-black'}`}>
                                <img src="design_unsplash.jpg" className="w-3/4 mt-24" />
                                <h3 className="w-3/4 mt-2 xlMobile:mt-6 tracking-[0.2em] text-xl tablet:text-sm font-hind">IDEATION</h3>
                                <p className="w-3/4 mt-2 xlMobile:mt-6 text-lg smLaptop:text-sm xlMobile:text-2xl font-shanti tablet:text-sm">A product always starts with an idea, whether that be a napkin sketch or a full mockup. Ideation is the core foundation to a product and determines what service it aims to bring and how it innnovates. We swiftly create working models to validate concepts, iron out flaws, and refine functionality. By emphasizing quick iterations, we ensure that prototypes aligns with your vision while addressing user needs effectively.</p>
                            </div>
                            <div className={`w-full lgMobile:w-[90%] h-screen xlMobile:h-[60rem] p-6 xlMobile:p-0 -ml-6 xlMobile:ml-0 lgMobile:mr-6 mdMobile:-ml-12 tablet:ml-0 mdMobile:pr-10 flex flex-col items-center ${darkMode ? 'text-white' : 'text-black'}`}>
                                <img src="prototyping_unsplash.jpg" className="w-3/4 mt-24" />
                                <h3 className="w-3/4 mt-2 xlMobile:mt-6 tracking-[0.2em] text-xl tablet:text-sm font-hind">MECHANICAL</h3>
                                <p className="w-3/4 font-shanti mt-2 xlMobile:mt-6 text-lg smLaptop:text-sm xlMobile:text-2xl tablet:text-sm">Mechanical needs in production are essential, ensuring products are convenient and meet user demands. Elegant designs enhance accessibility and user experience, while durability in different environments guarantee product longevity across various conditions. These elements are fundamental to a product’s success, reflecting the original vision and adapting to market expectations sustainably.</p>
                            </div>
                            <div className={`w-full lgMobile:w-[90%] h-screen xlMobile:h-[50rem] p-6 xlMobile:p-0 xlMobile:ml-0 -ml-6 lgMobile:mr-6 mdMobile:-ml-12 tablet:ml-0 mdMobile:pr-10 flex flex-col items-center ${darkMode ? 'text-white' : 'text-black'}`}>
                                <img src="electrical_unsplash.jpg" className="w-3/4 mt-24" />
                                <h3 className="w-3/4 mt-2 xlMobile:mt-6 tracking-[0.2em] text-xl tablet:text-sm font-hind">ELECTRICAL</h3>
                                <p className="w-3/4 font-shanti mt-2 xlMobile:mt-6 text-lg smLaptop:text-sm xlMobile:text-2xl tablet:text-sm">Innovative circuitry is crucial, providing longer battery life and ensuring device functionality aligns with consumer needs. Robust  protections are implemented to extend the device’s lifespan against power surges or voltage harsh situations.</p>
                            </div>
                            <div className={`w-full lgMobile:w-[90%] h-screen xlMobile:h-[55rem] p-6 xlMobile:p-0 xlMobile:ml-0 -ml-6 lgMobile:mr-6 mdMobile:-ml-12 tablet:ml-0 mdMobile:pr-10 flex flex-col items-center ${darkMode ? 'text-white' : 'text-black'}`}>
                                <img src="software_unsplash.jpg" className="w-3/4 mt-24" />
                                <h3 className="w-3/4 mt-2 xlMobile:mt-6 tracking-[0.2em] text-xl tablet:text-sm font-hind">SOFTWARE</h3>
                                <p className="w-3/4 font-shanti mt-2 xlMobile:mt-6 text-lg smLaptop:text-sm xlMobile:text-2xl tablet:text-sm">At our core, we are committed to innovation, consistently integrating cutting-edge technology into our software development process. We embrace experimentation and continuously explore new methodologies to enhance performance, ensure scalability, and maintain the utmost reliability in our products.</p>
                            </div>
                            <div className={`w-full lgMobile:w-[90%] h-screen xlMobile:h-[60rem] p-6 xlMobile:p-0 xlMobile:ml-0 -ml-6 lgMobile:mr-6 mdMobile:-ml-12 tablet:ml-0 mdMobile:pr-10 flex flex-col items-center ${darkMode ? 'text-white' : 'text-black'}`}>
                                <img src="manufacturing_unsplash.jpg" className="w-3/4 mt-24" />
                                <h3 className="w-3/4 mt-2 xlMobile:mt-6 tracking-[0.2em] text-xl tablet:text-sm font-hind">MANUFACTURING</h3>
                                <p className="w-3/4 font-shanti mt-2 xlMobile:mt-6 text-lg smLaptop:text-sm xlMobile:text-2xl tablet:text-sm">Manufacturing is a critical process in the product lifecycle, powering the transformation of concepts into market-ready goods. It encompasses design, prototyping, and production, ensuring that ideas are not only realized but optimized for consumer use. The goal is to deliver quality and innovation, seamlessly integrating functionality with user expectations. We manufacture locally in the United States in our own facility as well as overseas depending on costs and demand.</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-screen flex laptop:mt-32 tablet:mt-16 xlMobile:hidden lgMobile:hidden mdMobile:hidden relative">
                        {adminPrivileges && (
                            <button className={`absolute top-[10rem] laptop:top-[5rem] smLaptop:top-[4rem] tablet:top-[7rem] right-[10rem] laptop:right-[4rem] smLaptop:right-[4rem] tablet:right-[2rem] px-6 tablet:px-3 py-2 tablet:py-1 rounded-full border-2 font-semibold tablet:text-sm font-hind ${darkMode ? 'text-white' : 'text-black'}`}
                                onClick={() => setEditProducts(true)}
                            >Edit Products</button>
                        )}
                        <div className="w-1/2 flex items-center justify-center">
                            {productsSectionProducts.every(product => product !== null) && productsSectionProducts.map((product, index) => {
                                const matchingImage = productsPageImages.find(image => image && image.imgId === product.thumbnailImageId);
                                return (
                                    <div key={index} className={`h-2/3 w-2/3 flex justify-center items-center ${productNum === index + 1 ? '' : 'hidden'}`}>
                                        {matchingImage && <img src={`https://ideasthatfloat-server-lnr7.onrender.com/uploads/${matchingImage.imgSrc}`} className="h-[75%] object-cover"></img>}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-1/2 flex items-center justify-center py-16 pr-32">
                            <div className={`h-2/3 w-2/3 relative ${darkMode ? 'text-white' : 'text-black'}`}>
                                <h2 className="text-5xl xxsm:text-[2.8rem] laptop:text-4xl smLaptop:text-4xl tablet:text-3xl lgMobile:text-3xl mdMobile:text-2xl font-thin font-ruda">Our Products</h2>
                                <h3 className="text-3xl laptop:text-2xl font-hind smLaptop:text-xl tablet:text-lg text-[#FF7F11] mt-4">{`${productsPageNames[productNum - 1]}`}</h3>
                                <p className="mt-4 font-shanti whitespace-pre-wrap text-2xl laptop:text-xl smLaptop:text-lg tablet:text-sm">{`${productsPageDescriptions[productNum - 1]}`}</p>
                                <div className="flex flex-col justify-center mt-10">
                                    <div className="flex">
                                        {widths.map((width, index) => (
                                            <motion.div
                                                key={index}
                                                className={`h-[0.7em] rounded-full mr-2`}
                                                animate={{ width, backgroundColor: colors[index] }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        ))}
                                    </div>
                                    <Link to={`/products/${productsSectionProducts.length > 0 && productsSectionProducts[productNum - 1] ? productsSectionProducts[productNum - 1].id : '/products'}`}><motion.button className="border-2 font-hind border-[#FF7F11] px-6 rounded-full mt-10"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="click"
                                    >View Product</motion.button></Link>
                                </div>
                                <button className="absolute top-48 smLaptop:top-[9.5rem] tablet:top-1/2 -left-20"
                                    onClick={() => {
                                        setUserChangeProcuctNum(true)
                                        if (productNum > 1 && productNum <= 5) {
                                            setProductNum(productNum - 1);
                                        } else if (productNum === 1) {
                                            setProductNum(5);
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[42px] w-[42px] tablet:w-[30px] tablet:h-[30px]" viewBox="0 -960 960 960" fill="#FF7F11"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
                                </button>
                                <button className="absolute top-48 smLaptop:top-[9.5rem] tablet:top-1/2 -right-20"
                                    onClick={() => {
                                        setUserChangeProcuctNum(true)
                                        if (productNum >= 1 && productNum < 5) {
                                            setProductNum(productNum + 1);
                                        } else if (productNum === 5) {
                                            setProductNum(1);
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="42px" viewBox="0 -960 960 960" width="42px" fill="#FF7F11"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-screen flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col xlMobile:mt-[10rem] lgMobile:mt-[10rem] mdMobile:mt-[5rem] relative">
                        <button className={`absolute top-[13rem] laptop:top-[10rem] smLaptop:top-[8rem] xlMobile:-top-10 left-[5rem] tablet:left-6 xlMobile:left-[20rem] xlMobile:text-2xl tablet:top-[6rem] xlMobile:w-[10rem] lgMobile:w-[7rem] mdMobile:w-[7rem] lgMobile:-top-10 mdMobile:-top-10 smLaptop:left-[4rem] lgMobile:left-[15rem] mdMobile:left-[15rem] ${adminPrivileges ? '' : 'hidden'} ${darkMode ? 'text-white' : 'text-black'} border-2 px-8 rounded-full font-hind`}
                            onClick={() => setEditThinkTank(true)}
                        >Edit</button>
                        <div className={`w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full flex flex-col justify-center pl-32 smLaptop:pl-24 xlMobile:pl-12 ${darkMode ? 'text-white' : 'text-black'}`}>
                            <h2 className="text-5xl smLaptop:text-4xl tablet:text-3xl tablet:-ml-12 lgMobile:-ml-10 mdMobile:-ml-10 font-thin font-hind">Think Tank</h2>
                            <p className="pr-[6em] smLaptop:pr-[5.5rem] font-shanti tablet:pr-[3em] xlMobile:pr-6 lgMobile:pr-0 mdMobile:pr-0 tablet:-ml-12 lgMobile:-ml-28 mdMobile:-ml-28 lgMobile:w-full mdMobile:w-full mt-6 text-lg smLaptop:text-[1rem] tablet:text-[1rem] xlMobile:text-2xl whitespace-pre-wrap">{thinkTankText}</p>
                        </div>
                        <div className="w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-full xlMobile:px-4 lgMobile:px-4 mdMobile:px-4 xlMobile:h-[35rem] lgMobile:h-[35rem] mdMobile:h-[35rem] xlMobile:-mt-14 lgMobile:-mt-14 mdMobile:-mt-14 flex justify-center items-center">
                            <div className="w-full h-[45%] bg-black mr-24 xlMobile:mr-0 tablet:mr-10">
                                <img src={`https://ideasthatfloat-server-lnr7.onrender.com/uploads/${thinkTankImageId}`} className="object-cover h-full w-full"></img>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-screen flex xlMobile:flex-col-reverse lgMobile:flex-col-reverse mdMobile:flex-col-reverse xlMobile:mb-32 lgMobile:mb-32 mdMobile:mb-32 xlMobile:-mt-[20rem] lgMobile:-mt-[15rem] mdMobile:-mt-[15rem]">
                        <div className="w-1/2 xlMobile:w-full lgMobile:w-[24rem] mdMobile:w-[24rem] flex justify-center items-center">
                            <div className="w-full h-[45%] xlMobile:h-[15rem] lgMobile:h-[15rem] mdMobile:h-[15rem] bg-black ml-24 tablet:ml-12 xlMobile:mx-6 lgMobile:ml-4 mdMobile:ml-4 lgMobile:mr-4 mdMobile:mr-4">Building Image</div>
                        </div>
                        <div className={`w-1/2 xlMobile:w-full lgMobile:w-full mdMobile:w-[90%] flex flex-col justify-center pl-32 xl:pl-20 lg:pl-16 md:pl-16 sm:pl-16 xsm:pl-16 xxsm:pl-16 laptop:pl-20 smLaptop:pl-16 tablet:pl-8 xlMobile:pl-12 lgMobile:pl-10 mdMobile:pl-6 xlMobile:mb-10 lgMobile:mb-10 mdMobile:mb-10 ${darkMode ? 'text-white' : 'text-black'}`}>
                            <h2 className="text-5xl smLaptop:text-4xl tablet:text-3xl font-thin font-hind">About Us</h2>
                            <p className="pr-[6em] tablet:pr-[3em] xlMobile:pr-12 mt-6 text-xl smLaptop:text-[1rem] xlMobile:text-2xl font-shanti tablet:text-[1rem]">Interactive Technologies, Inc. is always
                                willing to push the boundaries and
                                experiment with cutting edge
                                technology. We make simple ideas
                                into full-fledged products that bring
                                forth a customer's vision to
                                completeion.</p>
                            <Link to={'/about'} className="text-[#FF7F11] text-xl tablet:text-lg mt-6 tablet:mt-3 font-shanti">More About Us</Link>
                        </div>

                    </div>
                    <Footer />
                </motion.div>
            </motion.div >
        </>
    )
}

export default Home