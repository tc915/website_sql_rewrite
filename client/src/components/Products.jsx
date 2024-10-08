import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import TextAreaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../partials/Footer';
import { motion } from 'framer-motion';

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


const Product = ({ product, refresh, setRefresh, adminPrivileges, user, navigate, darkMode }) => {

    const [isHoverContainer, setIsHoverContainer] = useState(false)

    const productWidgetImageVariants = {
        initial: {
            scale: 1
        },
        hover: {
            scale: 0.95
        }
    }

    const addProductToCart = async (id) => {
        const reqData = { quantity: 1 }
        const { data } = await axios.post(`/add-product-to-cart/${id}`, reqData);
        setRefresh(!refresh);
    }

    const deleteProduct = async () => {
        try {
            await axios.delete(`/delete-product/${product.id}`);
            setRefresh(!refresh)
        } catch (err) {
            if (err.response.status === 409) {
                alert(err.response.data.error)
            } else {
                console.log(err)
            }
        }
    }

    // This is a smaller component used in a larger one. This is normally used for individual elements that you want to map out multiple times
    return (
        <motion.div className={`relative ${darkMode ? 'text-white' : 'text-black'} font-semibold text-2xl h-[25rem] xxsm:h-[20rem] laptop:h-[20rem] smLaptop:h-[18rem] tablet:h-[10rem] xlMobile:h-[33rem] w-[20rem] xxsm:w-[18rem] laptop:w-[18rem] smLaptop:w-[16rem] xlMobile:w-[27rem] tablet:w-[8rem] rounded-3xl p-4 tablet:p-0`}
            onMouseEnter={() => setIsHoverContainer(true)}
            onMouseLeave={() => setIsHoverContainer(false)}
        >
            {adminPrivileges && (
                <button className='absolute top-4 tablet:-top-4 right-4 tablet:-right-4'
                    onClick={(ev) => {
                        ev.preventDefault();
                        deleteProduct();
                    }}
                >
                    <svg xmlns="https://www.w3.org/2000/svg" className="h-[40px] w-[40px] tablet:h-[20px] tablet:w-[20px] xlMobile:h-[60px] xlMobile:w-[60px]" viewBox="0 -960 960 960" fill={`${darkMode ? '#fff' : '#131313'}`}
                    ><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                </button>
            )}
            <Link to={`/products/${product.id}`}>
                <button className="w-full h-full flex flex-col items-center mb-24">
                    <motion.img src={`https://ideasthatfloat-server-lnr7.onrender.com/uploads/${product.thumbnailImageId}`} className='h-full pt-16 tablet:pt-2 object-cover'
                        variants={productWidgetImageVariants}
                        initial="initial"
                        animate={isHoverContainer ? "hover" : "initial"}
                    />
                    <h2 className='mt-4 tablet:mt-2 xlMobile:mt-6 smLaptop:text-[1rem] tablet:text-sm xlMobile:text-4xl font-hind'>{product.name}</h2>
                </button>
            </Link>
            <button className='w-5/6 xlMobile:mt-10 xlMobile:ml-[1.7rem] tablet:w-full'
                onClick={() => {
                    addProductToCart(product.id)
                }}
            >
                <img src="add_to_cart_button.png" alt="" />
            </button>
        </motion.div>
    );
};

const Products = () => {

    const { darkMode, setDarkMode, setNavTotalCartCount } = useContext(UserContext);

    const { user, setUser, guestCookie, setGuestCookie } = useContext(UserContext);
    const [adminPrivileges, setAdminPrivilegs] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [products, setProducts] = useState([]);
    const [newProductName, setNewProductName] = useState('');
    const [newProductDescription, setNewProductDescription] = useState('');
    const [newProductVariablePricing, setNewProductVariablePricing] = useState([]);
    const [newProductThumbnailImage, setNewProductThumbnailImage] = useState({});
    const [newProductDetailsImage, setNewProductDetailsImage] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [totalCartCount, setTotalCartCount] = useState(0);
    const [fileInputThumbnailText, setFileInputThumbnailText] = useState('Choose File');
    const [fileInputDetailsText, setFileInputDetailsText] = useState('Choose File');
    const [showAddPrice, setShowAddPrice] = useState(false);
    const [pricingMin, setPricingMin] = useState(0);
    const [pricingMax, setPricingMax] = useState(0);
    const [pricingPrice, setPricingPrice] = useState(0);
    const [newProductPartNumber, setNewProductPartNumber] = useState('');
    const [thumbnailFilePath, setThumbnailFilePath] = useState('');
    const [detailsFilePath, setDetailsFilePath] = useState('');

    const navigate = useNavigate();

    const addProduct = async () => {
        const formData = new FormData();
        formData.append('newProductName', newProductName);
        formData.append('newProductPartNumber', newProductPartNumber);
        formData.append('newProductDescription', newProductDescription);
        formData.append('newProductVariablePricing', JSON.stringify(newProductVariablePricing));
        formData.append('imageThumbnail', newProductThumbnailImage);
        if (newProductDetailsImage) {
            formData.append('imageDetails', newProductDetailsImage)
        }

        try {
            setShowAddProduct(false);
            await axios.post('/add-product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setRefresh(!refresh);
        } catch (err) {
            console.log(err.response);
        }
    }



    useEffect(() => {
        const getProducts = async () => {
            const { data } = await axios.get('/get-products');
            setProducts(data);
        }
        getProducts();

    }, [refresh]);


    useEffect(() => {
        const getCart = async () => {
            const { data } = await axios.get('/user-cart');
            setTotalCartCount(data.cartDoc.productCountTotal);
            setNavTotalCartCount(data.cartDoc.productCountTotal);
        }
        getCart();
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
        } else {
            setAdminPrivilegs(false);
        }
    }, [user, refresh]);

    useEffect(() => {
        if (showAddProduct) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [showAddProduct]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return (
        <div className={`${darkMode ? 'bg-[#131313]' : 'bg-white'}`}>
            <div className={`${showAddProduct ? '' : 'hidden'} fixed flex justify-center items-center w-full z-[99] top-0 left-0 bg-black/50 h-full`}>
                <div className={`w-2/3 laptop:w-[75%] smLaptop:w-[75%] tablet:w-[90%] xlMobile:w-[90%] lgMobile:w-[90%] mdMobile:w-[90%] h-[43rem] laptop:h-[80%] smLaptop:h-[80%] tablet:h-[25rem] xlMobile:h-[80%] ${darkMode ? 'bg-[#131313]' : 'bg-white'} border-4 border-[#FF7F11] text-white rounded-3xl flex flex-col items-center p-12 overflow-auto relative scroll-p-5`}>
                    <button
                        onClick={() => setShowAddProduct(false)}
                    >
                        <svg className='absolute top-2 right-2 cursor-pointer h-[50px] w-[50px] xlMobile:h-[70px] xlMobile:w-[70px]' xmlns="https://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill={`${darkMode ? '#fff' : '#131313'}`}><path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z" /></svg>
                    </button>
                    <h2 className={`text-4xl font-ruda tablet:text-2xl xlMobile:text-5xl lgMobile:text-2xl mdMobile:text-2xl font-[800] ${darkMode ? 'text-white' : 'text-black'}`}>New Product</h2>
                    <form className={`w-full flex flex-col items-center ${darkMode ? 'text-white' : 'text-black'}`}
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            addProduct();
                        }}
                    >
                        <div className='w-2/3 tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full mt-10 text-xl xlMobile:text-3xl font-semibold mb-2 xlMobile:mb-6 font-hind'>
                            <p>Product name:</p>
                        </div>
                        <input type="text" placeholder='Product name' className='w-2/3 tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full text-2xl tablet:text-xl xlMobile:text-4xl lgMobile:text-xl mdMobile:text-xl border-b-2 p-2 bg-transparent outline-none font-shanti' required
                            onChange={(ev) => setNewProductName(ev.target.value)}
                        />
                        <div className='w-2/3 tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full mt-10 xlMobile:mt-14 text-xl xlMobile:text-3xl font-semibold mb-2 xlMobile:mb-6 font-hind'>
                            <p>Part number:</p>
                        </div>
                        <input type="text" placeholder='XXX-XXXXX' className='w-2/3 tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full text-2xl tablet:text-xl xlMobile:text-4xl lgMobile:text-xl mdMobile:text-xl border-b-2 p-2 bg-transparent outline-none font-shanti' required maxLength="9"
                            value={newProductPartNumber}
                            onChange={(ev) => {
                                let value = ev.target.value;
                                value = value.replace(/[^0-9]/ig, "").toUpperCase();
                                if (value.length > 3) {
                                    value = value.slice(0, 3) + '-' + value.slice(3);
                                }
                                setNewProductPartNumber(value);
                            }}
                        />
                        <div className='w-2/3 tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full mt-4 xlMobile:mt-14 text-xl xlMobile:text-3xl font-semibold mb-2 xlMobile:mb-6 font-hind'>
                            <p>Product description:</p>
                        </div>
                        <TextAreaAutosize className='w-2/3 font-shanti tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full bg-transparent border-b-2 p-2 text-2xl xlMobile:text-3xl tablet:text-xl lgMobile:text-xl mdMobile:text-xl resize-none outline-none' autoComplete='off' placeholder='Product description' required
                            onChange={(ev) => setNewProductDescription(ev.target.value)}
                        ></TextAreaAutosize>
                        <div className='w-2/3 tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full mt-4 xlMobile:mt-14 text-xl xlMobile:text-3xl font-semibold mb-2 xlMobile:mb-6 font-hind'>
                            <p>Variable pricing:</p>
                        </div>
                        <div className='w-2/3 font-hind tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full flex flex-col'>
                            {newProductVariablePricing && newProductVariablePricing.length > 0 && newProductVariablePricing.map((price, index) => (
                                <div key={index} className='flex tablet:w-2/3 xlMobile:w-[90%] relative'>
                                    <div className={`py-2 px-4 xlMobile:px-6 xlMobile:py-2 lgMobile:px-1 mdMobile:px-1 lgMobile:py-2 mdMobile:py-2 mr-4 lgMobile:mr-2 mdMobile:mr-2 font-semibold text-xl tablet:text-[1rem] xlMobile:text-xl lgMobile:text-sm mdMobile:text-sm lgMobile:flex mdMobile:flex lgMobile:justify-center mdMobile:justify-center lgMobile:items-center mdMobile:items-center mb-4 ${darkMode ? 'bg-white text-black' : 'bg-[#131313]/80 text-white'}  w-1/2 rounded-full `}>
                                        {`${price.max ? (index === newProductVariablePricing.length - 1 ? 'Quantity: ' + price.min + ' - ' + price.max + '+' : 'Quantity: ' + price.min + ' - ' + price.max) : (index === newProductVariablePricing.length - 1 ? 'Quantity: ' + price.min + '+' : 'Quantity: ' + price.min)}`}
                                    </div>
                                    <div className={`py-2 px-4 xlMobile:px-6 xlMobile:py-2 lgMobile:px-1 mdMobile:px-1 font-semibold text-xl tablet:text-[1rem] xlMobile:text-xl lgMobile:text-sm mdMobile:text-sm lgMobile:flex mdMobile:flex lgMobile:justify-center mdMobile:justify-center lgMobile:items-center mdMobile:items-center mb-4 ${darkMode ? 'bg-white text-black' : 'bg-[#131313]/80 text-white'} w-1/2 rounded-full`}>{`Price: $${price.price}`}</div>
                                    <button className='absolute top-0 -right-14 lgMobile:mr-2 mdMobile:mr-2 lgMobile:mt-1 mdMobile:mt-1 bg-[#FF7F11] rounded-full p-1'
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            const updatedPricing = newProductVariablePricing.filter((_, i) => i !== index);
                                            setNewProductVariablePricing(updatedPricing);
                                        }}
                                    >
                                        <svg xmlns="https://www.w3.org/2000/svg" className='w-[36px] h-[36px] xlMobile:w-[40px] xlMobile:h-[40px] lgMobile:w-[24px] mdMobile:w-[24px] lgMobile:h-[24px] mdMobile:h-[24px]' viewBox="0 -960 960 960" fill="#fff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                                    </button>
                                </div>
                            ))}
                            <button className={`font-hind ${showAddPrice ? 'hidden' : 'flex items-center'}`}
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    setPricingMin('');
                                    setPricingMax('');
                                    setPricingPrice('');
                                    setShowAddPrice(true);
                                }}
                            >
                                <svg xmlns="https://www.w3.org/2000/svg" className="h-[48px] w-[48px] xlMobile:h-[60px] xlMobile:w-[60px]" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FF7F11"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>
                                <p className='text-xl xlMobile:text-4xl font-semibold ml-4'>Add Price</p>
                            </button>
                            <div className={`font-shanti w-full text-xl xlMobile:text-xl lgMobile:text-lg mdMobile:text-lg font-thin ${showAddPrice ? 'flex lgMobile:flex-col mdMobile:flex-col' : 'hidden'}`}>
                                <div className='w-1/2 lgMobile:w-full mdMobile:w-full mr-4 lgMobile:mb-4 mdMobile:mb-4'>
                                    <p className='mb-4'>Quantity & Range</p>
                                    <input type="number" className={`${showAddPrice ? '' : 'hidden'} bg-transparent border-b-2 w-1/2 outline-none`} placeholder='Min'
                                        value={pricingMin}
                                        onChange={(ev) => setPricingMin(ev.target.value)}
                                    />
                                    <input type="number" className={`${showAddPrice ? '' : 'hidden'} bg-transparent border-b-2 w-1/2 outline-none`} placeholder='Max'
                                        value={pricingMax}
                                        onChange={(ev) => setPricingMax(ev.target.value)}
                                    />
                                </div>
                                <div className='w-1/2 lgMobile:w-full mdMobile:w-full'>
                                    <p className='mb-4 lgMobile:mb-2 mdMobile:mb-2'>Price</p>
                                    <input type="number" className={`${showAddPrice ? '' : 'hidden'} bg-transparent border-b-2 w-full outline-none`} placeholder='Price'
                                        value={pricingPrice}
                                        onChange={(ev) => {
                                            let value = ev.target.value;
                                            setPricingPrice(value);
                                        }}
                                    />
                                </div>
                            </div>
                            <button className={`font-hind self-start mt-4 xlMobile:mt-10 p-2 px-10 text-lg xlMobile:text-4xl font-semibold rounded-full bg-[#FF7F11] text-white ${showAddPrice ? '' : 'hidden'}`}
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    const variablePricingData = {
                                        min: pricingMin,
                                        max: pricingMax,
                                        price: pricingPrice
                                    }
                                    setNewProductVariablePricing([...newProductVariablePricing, variablePricingData]);
                                    setShowAddPrice(false);
                                }}
                            >Save Price</button>
                        </div>
                        <div className='w-2/3 tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full mt-4 xlMobile:mt-14 text-xl xlMobile:text-3xl lgMobile:text-lg mdMobile:text-lg font-semibold mb-2 xlMobile:mb-6 font-hind'>
                            <p>Product thumbnail image:</p>
                        </div>
                        <input id='fileUploadThumbnail' accept='image/*' type="file" className='hidden font-shanti' required
                            onChange={(ev) => {
                                setNewProductThumbnailImage(ev.target.files[0]);
                                setThumbnailFilePath(ev.target.files[0].name);
                                setFileInputThumbnailText('Change File');
                            }}
                        />
                        <div className='flex font-shanti tablet:flex-col xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col w-full items-center'>
                            <label htmlFor="fileUploadThumbnail" className={`font-hind bg-transparent border-4 border-[#FF7F11] p-4 w-1/4 md:w-1/3 sm:w-1/3 xsm:w-1/3 xxsm:w-1/3 laptop:w-1/3 smLaptop:w-1/3 tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full rounded-xl self-start ml-[11rem] md:ml-[9rem] sm:ml-[8rem] xsm:ml-[8rem] xxsm:ml-[7rem] laptop:ml-[7rem] smLaptop:ml-[6rem] tablet:ml-0 xlMobile:ml-0 lgMobile:ml-0 mdMobile:ml-0 mt-2 h-[4rem] xlMobile:h-[5rem] font-bold text-2xl xlMobile:text-3xl lgMobile:text-xl mdMobile:text-xl flex justify-center items-center cursor-pointer ${darkMode ? 'text-white' : 'text-black'}`}>{fileInputThumbnailText}</label>
                            <p className={`${darkMode ? 'text-white' : 'text-black'} ml-4 xlMobile:text-2xl lgMobile:text-[1rem] mdMobile:text-[1rem]`}>{thumbnailFilePath}</p>
                        </div>
                        <div className='w-2/3 tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full mt-4 xlMobile:mt-14 text-xl xlMobile:text-3xl lgMobile:text-lg mdMobile:text-lg font-semibold mb-2 xlMobile:mb-6'>
                            <p>Product details image (optional):</p>
                        </div>
                        <input id='fileUploadDetails' accept='image/*' type="file" className='hidden'
                            onChange={(ev) => {
                                setNewProductDetailsImage(ev.target.files[0]);
                                setDetailsFilePath(ev.target.files[0].name);
                                setFileInputDetailsText('Change File');
                            }}
                        />
                        <div className='flex tablet:flex-col xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col w-full items-center font-shanti'>
                            <label htmlFor="fileUploadDetails" className={`font-hind bg-transparent border-4 border-[#FF7F11] p-4 w-1/4 md:w-1/3 sm:w-1/3 xsm:w-1/3 xxsm:w-1/3 laptop:w-1/3 smLaptop:w-1/3 tablet:w-full xlMobile:w-full lgMobile:w-full mdMobile:w-full rounded-xl self-start ml-[11rem] md:ml-[9rem] sm:ml-[8rem] xsm:ml-[8rem] xxsm:ml-[7rem] laptop:ml-[7rem] smLaptop:ml-[6rem] tablet:ml-0 xlMobile:ml-0 lgMobile:ml-0 mdMobile:ml-0 mt-2 h-[4rem] xlMobile:h-[5rem] ${darkMode ? 'text-white' : 'text-black'} font-bold text-2xl xlMobile:text-3xl lgMobile:text-xl mdMobile:text-xl flex justify-center items-center cursor-pointer`}>{fileInputDetailsText}</label>
                            <p className={`${darkMode ? 'text-white' : 'text-black'} ml-4 xlMobile:text-2xl lgMobile:text-[1rem] mdMobile:text-[1rem]`}>{detailsFilePath}</p>
                        </div>
                        <button type="submit" className='w-2/3 xlMobile:w-[75%] font-hind bg-[#FF7F11] rounded-3xl p-2 text-white font-semibold text-2xl xlMobile:text-4xl xlMobile:h-[4rem] mt-10'>Save product</button>
                    </form>
                </div>
            </div>
            <motion.div className={`${darkMode ? 'text-white' : 'text-black'} lgMobile:overflow-x-hidden mdMobile:overflow-x-hidden`}
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >

                <div className='pt-[10rem] lg:pt-[11rem] md:pt-[12rem] sm:pt-[11rem] xsm:pt-[12rem] tablet:pt-[8rem] xlMobile:pt-[15rem] lgMobile:pt-[15rem] mdMobile:pt-[15rem] px-[22rem] lg:px-[14rem] md:px-44 sm:px-44 xsm:px-36 xxsm:px-36 laptop:px-32 smLaptop:px-24 tablet:px-[5rem] xlMobile:px-12 lgMobile:px-6 mdMobile:px-6 flex justify-between items-end'>
                    <h1 className="font-[900] text-6xl xxsm:text-5xl laptop:text-5xl smLaptop:text-4xl tablet:text-4xl xlMobile:text-5xl lgMobile:text-4xl mdMobile:text-4xl xlMobile:mr-12 lgMobile:mr-6 mdMobile:mr-6 text-center font-ruda">Products</h1>
                    <div className='flex items-center'>
                        <div className='text-2xl mr-2 font-md rounded-full w-[3rem] h-[3rem] bg-gradient-to-br from-[#FF7F11] to-[#facc22] text-white p-[3px] flex justify-center items-center'>
                            <div className='bg-[#131313] w-full h-full rounded-full'>
                                <p className='w-full font-hind mt-[3px] text-center font-bold'>{totalCartCount ? totalCartCount : '0'}</p>
                            </div>
                        </div>
                        <button>
                            <Link to={`/cart`}>
                                <svg xmlns="https://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill={`${darkMode ? '#fff' : '#131313'}`}><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" /></svg></Link>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-3 xlMobile:grid-cols-1 lgMobile:grid-cols-1 mdMobile:grid-cols-1 gap-y-44 tablet:gap-y-36 xlMobile:gap-y-[14rem] px-[20rem] lg:px-[14rem] md:px-44 sm:px-44 xsm:px-36 xxsm:px-36 laptop:px-32 smLaptop:px-24 tablet:px-[5rem] tablet:ml-[4rem] xlMobile:px-12 lgMobile:px-6 mdMobile:px-6 py-14 mb-[36.3rem] text-center">
                    {/* The map method maps out an array of objects with a callback function */}
                    {/* Always check if the length of the array being mapped out is larger than zero before mapping. If you don't check it before mapping, the app will crash */}
                    {products.length > 0 && products.map((product, index) => (
                        <Product key={index} product={product} refresh={refresh} setRefresh={setRefresh} adminPrivileges={adminPrivileges} user={user} navigate={navigate} darkMode={darkMode} />
                    ))}

                    {adminPrivileges && (
                        <motion.button className='h-[25rem] xsm:h-[24rem] xxsm:h-[20rem] laptop:h-[20rem] smLaptop:h-[19rem] tablet:h-[10rem] xlMobile:h-[33rem] w-[20rem] xxsm:w-[18rem] xsm:w-[18rem] laptop:w-[18rem] smLaptop:w-[16rem] tablet:w-[8rem] xlMobile:w-[27rem] border-4 rounded-3xl flex flex-col justify-center items-center mt-10'
                            onClick={() => setShowAddProduct(true)}
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 0.95 }}
                        >
                            <svg xmlns="https://www.w3.org/2000/svg" className='h-[100px] w-[100px] tablet:h-[50px] tablet:w-[50px]' height="100px" viewBox="0 -960 960 960" width="100px" fill={`${darkMode ? '#fff' : '#131313'}`}><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>
                            <p className='font-semibold text-4xl smLaptop:text-2xl tablet:text-lg font-hind'>Add Product</p>
                        </motion.button>
                    )}

                </div>
                <Footer />
            </motion.div>
        </div>
    );
}

export default Products;
