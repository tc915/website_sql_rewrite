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


    return (
        <motion.div className={`relative ${darkMode ? 'text-white' : 'text-black'} font-semibold text-2xl h-[25rem] w-[20rem] rounded-3xl p-4`}
            onMouseEnter={() => setIsHoverContainer(true)}
            onMouseLeave={() => setIsHoverContainer(false)}
        >
            {adminPrivileges && (
                <button className='absolute top-4 right-4'
                    onClick={(ev) => {
                        ev.preventDefault();
                        deleteProduct();
                    }}
                >
                    <svg xmlns="https://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill={`${darkMode ? '#fff' : '#131313'}`}
                    ><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                </button>
            )}
            <Link to={`/products/${product.id}`}>
                <button className="w-full h-full flex flex-col items-center mb-24">
                    <motion.img src={`https://ideasthatfloat-server-lnr7.onrender.com/uploads/${product.thumbnailImageId}`} className='h-full pt-16 object-cover'
                        variants={productWidgetImageVariants}
                        initial="initial"
                        animate={isHoverContainer ? "hover" : "initial"}
                    />
                    <h2 className='mt-4'>{product.name}</h2>
                </button>
            </Link>
            <button className='w-5/6'
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

    const { darkMode, setDarkMode } = useContext(UserContext);

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
            <div className={`${showAddProduct ? 'fixed flex justify-center items-center' : 'hidden'} w-full z-[99] top-0 left-0 bg-black/50 h-full`}>
                <div className={`w-2/3 h-[43rem] ${darkMode ? 'bg-[#131313]' : 'bg-white'} border-4 border-[#FF7F11] text-white rounded-3xl flex flex-col items-center p-12 overflow-auto relative scroll-p-5`}>
                    <button
                        onClick={() => setShowAddProduct(false)}
                    >
                        <svg className='absolute top-2 right-2 cursor-pointer' xmlns="https://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill={`${darkMode ? '#fff' : '#131313'}`}><path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z" /></svg>
                    </button>
                    <h2 className={`text-4xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>New Product</h2>
                    <form className={`w-full flex flex-col items-center ${darkMode ? 'text-white' : 'text-black'}`}
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            addProduct();
                        }}
                    >
                        <div className='w-2/3 mt-10 text-xl font-semibold mb-2'>
                            <p>Product name:</p>
                        </div>
                        <input type="text" placeholder='Product name' className='w-2/3 text-2xl border-b-2 p-2 bg-transparent outline-none' required
                            onChange={(ev) => setNewProductName(ev.target.value)}
                        />
                        <div className='w-2/3 mt-10 text-xl font-semibold mb-2'>
                            <p>Part number:</p>
                        </div>
                        <input type="text" placeholder='XXX-XXXXX' className='w-2/3 text-2xl border-b-2 p-2 bg-transparent outline-none' required maxLength="9"
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
                        <div className='w-2/3 mt-4 text-xl font-semibold mb-2'>
                            <p>Product description:</p>
                        </div>
                        <TextAreaAutosize className='w-2/3 bg-transparent border-b-2 p-2 text-2xl resize-none outline-none' autoComplete='off' placeholder='Product description' required
                            onChange={(ev) => setNewProductDescription(ev.target.value)}
                        ></TextAreaAutosize>
                        <div className='w-2/3 mt-4 text-xl font-semibold mb-2'>
                            <p>Variable pricing:</p>
                        </div>
                        <div className='w-2/3 flex flex-col'>
                            {newProductVariablePricing && newProductVariablePricing.length > 0 && newProductVariablePricing.map((price, index) => (
                                <div key={index} className='flex relative'>
                                    <div className={`py-2 px-4 mr-4 font-semibold text-xl mb-4 ${darkMode ? 'bg-white text-black' : 'bg-[#131313]/80 text-white'}  w-1/2 rounded-full `}>
                                        {`${price.max ? (index === newProductVariablePricing.length - 1 ? 'Quantity: ' + price.min + ' - ' + price.max + '+' : 'Quantity: ' + price.min + ' - ' + price.max) : (index === newProductVariablePricing.length - 1 ? 'Quantity: ' + price.min + '+' : 'Quantity: ' + price.min)}`}
                                    </div>
                                    <div className={`py-2 px-4 font-semibold text-xl mb-4 ${darkMode ? 'bg-white text-black' : 'bg-[#131313]/80 text-white'} w-1/2 rounded-full`}>{`Price: $${price.price}`}</div>
                                    <button className='absolute top-0 -right-12 bg-[#FF7F11] rounded-full p-1'
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            const updatedPricing = newProductVariablePricing.filter((_, i) => i !== index);
                                            setNewProductVariablePricing(updatedPricing);
                                        }}
                                    >
                                        <svg xmlns="https://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#fff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                                    </button>
                                </div>
                            ))}
                            <button className={`${showAddPrice ? 'hidden' : 'flex items-center'}`}
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    setPricingMin('');
                                    setPricingMax('');
                                    setPricingPrice('');
                                    setShowAddPrice(true);
                                }}
                            >
                                <svg xmlns="https://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FF7F11"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>
                                <p className='text-xl font-semibold ml-4'>Add Price</p>
                            </button>
                            <div className={` w-full text-xl font-thin ${showAddPrice ? 'flex' : 'hidden'}`}>
                                <div className='w-1/2 mr-4'>
                                    <p className='mb-4'>Quantity Range</p>
                                    <input type="number" className={`${showAddPrice ? '' : 'hidden'} bg-transparent border-b-2 w-1/2 outline-none`} placeholder='Min'
                                        value={pricingMin}
                                        onChange={(ev) => setPricingMin(ev.target.value)}
                                    />
                                    <input type="number" className={`${showAddPrice ? '' : 'hidden'} bg-transparent border-b-2 w-1/2 outline-none`} placeholder='Max'
                                        value={pricingMax}
                                        onChange={(ev) => setPricingMax(ev.target.value)}
                                    />
                                </div>
                                <div className='w-1/2'>
                                    <p className='mb-4'>Price</p>
                                    <input type="number" className={`${showAddPrice ? '' : 'hidden'} bg-transparent border-b-2 w-full outline-none`} placeholder='Price'
                                        value={pricingPrice}
                                        onChange={(ev) => {
                                            let value = ev.target.value;
                                            setPricingPrice(value);
                                        }}
                                    />
                                </div>
                            </div>
                            <button className={`self-start mt-4 p-2 px-10 text-lg font-semibold rounded-full bg-[#FF7F11] text-white ${showAddPrice ? '' : 'hidden'}`}
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
                        <div className='w-2/3 mt-4 text-xl font-semibold mb-2'>
                            <p>Product thumbnail image:</p>
                        </div>
                        <input id='fileUploadThumbnail' accept='image/*' type="file" className='hidden' required
                            onChange={(ev) => {
                                setNewProductThumbnailImage(ev.target.files[0]);
                                setThumbnailFilePath(ev.target.files[0].name);
                                setFileInputThumbnailText('Change File');
                            }}
                        />
                        <div className='flex w-full items-center'>
                            <label htmlFor="fileUploadThumbnail" className={`bg-transparent border-4 border-[#FF7F11] p-4 w-1/4 rounded-xl self-start ml-[11rem] mt-2 h-[4rem] font-bold text-2xl flex justify-center items-center cursor-pointer ${darkMode ? 'text-white' : 'text-black'}`}>{fileInputThumbnailText}</label>
                            <p className={`${darkMode ? 'text-white' : 'text-black'} ml-4`}>{thumbnailFilePath}</p>
                        </div>
                        <div className='w-2/3 mt-4 text-xl font-semibold mb-2'>
                            <p>Product details image (optional):</p>
                        </div>
                        <input id='fileUploadDetails' accept='image/*' type="file" className='hidden'
                            onChange={(ev) => {
                                setNewProductDetailsImage(ev.target.files[0]);
                                setDetailsFilePath(ev.target.files[0].name);
                                setFileInputDetailsText('Change File');
                            }}
                        />
                        <div className='flex w-full items-center'>
                            <label htmlFor="fileUploadDetails" className={`bg-transparent border-4 border-[#FF7F11] p-4 w-1/4 rounded-xl self-start ml-[11rem] mt-2 h-[4rem] ${darkMode ? 'text-white' : 'text-black'} font-bold text-2xl flex justify-center items-center cursor-pointer`}>{fileInputDetailsText}</label>
                            <p className={`${darkMode ? 'text-white' : 'text-black'} ml-4`}>{detailsFilePath}</p>
                        </div>
                        <button type="submit" className='w-2/3 bg-[#FF7F11] rounded-3xl p-2 text-white font-semibold text-2xl mt-10'>Save product</button>
                    </form>
                </div>
            </div>
            <motion.div className={`${darkMode ? 'text-white' : 'text-black'}`}
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >

                <div className='pt-[10rem] px-[22rem] flex justify-between items-end'>
                    <h1 className="font-bold text-6xl text-center">Products</h1>
                    <div className='flex items-center'>
                        <div className='text-2xl mr-2 font-md rounded-full w-[3rem] h-[3rem] bg-gradient-to-br from-[#FF7F11] to-[#facc22] text-white p-[3px] flex justify-center items-center'>
                            <div className='bg-[#131313] w-full h-full rounded-full'>
                                <p className='w-full mt-[3px] text-center font-bold'>{totalCartCount ? totalCartCount : '0'}</p>
                            </div>
                        </div>
                        <button>
                            <Link to={`/cart`}>
                                <svg xmlns="https://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill={`${darkMode ? '#fff' : '#131313'}`}><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" /></svg></Link>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-y-44 px-[20rem] py-14 mb-44 text-center">
                    {products.length > 0 && products.map((product, index) => (
                        <Product key={index} product={product} refresh={refresh} setRefresh={setRefresh} adminPrivileges={adminPrivileges} user={user} navigate={navigate} darkMode={darkMode} />
                    ))}

                    {adminPrivileges && (
                        <motion.button className='h-[25rem] w-[20rem] border-4 rounded-3xl flex flex-col justify-center items-center mt-10'
                            onClick={() => setShowAddProduct(true)}
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 0.95 }}
                        >
                            <svg xmlns="https://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill={`${darkMode ? '#fff' : '#131313'}`}><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>
                            <p className='font-semibold text-4xl'>Add Product</p>
                        </motion.button>
                    )}

                </div>
                <Footer />
            </motion.div>
        </div>
    );
}

export default Products;
