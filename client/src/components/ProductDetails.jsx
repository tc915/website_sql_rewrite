import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { UserContext } from "../UserContext";
import TextAreaAutosize from 'react-textarea-autosize';
import Footer from "../partials/Footer";

const ProductDetails = () => {

    const { user, darkMode } = useContext(UserContext);

    const { id } = useParams();

    const navigate = useNavigate();

    const [product, setProduct] = useState({});
    const [adminPrivileges, setAdminPrivilegs] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescrition] = useState('');
    const [productVariablePricing, setProductVariablePricing] = useState([]);
    const [productThumbnailImg, setProductThumbnailImg] = useState({});
    const [productDetailsImg, setProductDetailsImg] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [fileInputThumbnailText, setFileInputThumbnailText] = useState('Choose File');
    const [fileInputDetailsText, setFileInputDetailsText] = useState('Choose File');
    const [displayPrice, setDisplayPrice] = useState(0);
    const [showAddPrice, setShowAddPrice] = useState(false);
    const [pricingMin, setPricingMin] = useState(0);
    const [pricingMax, setPricingMax] = useState(0);
    const [pricingPrice, setPricingPrice] = useState(0);
    const [productPartNumber, setProductPartNumber] = useState('');
    const [thumbnailImageId, setThumbnailImageId] = useState('');
    const [detailsImageId, setDetailsImageId] = useState('');
    const [thumbnailFilePath, setThumbnailFilePath] = useState('');
    const [detailsFilePath, setDetailsFilePath] = useState('');
    const [variablePricing, setVariablePricing] = useState([]);


    const saveProductEdits = async () => {
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('productPartNumber', productPartNumber);
        formData.append('productDescription', productDescription);
        formData.append('variablePricing', JSON.stringify(variablePricing));
        formData.append('imageThumbnail', productThumbnailImg);
        if (productDetailsImg) {
            formData.append('imageDetails', productDetailsImg);
        }

        try {
            const { data } = await axios.patch(`/product/${id}`, formData);

            setProduct(data.productDoc);
            setVariablePricing(data.variablePricing);
            console.log(data)
            setRefresh(!refresh);
            setShowEdit(false);

        } catch (err) {
            if (err.response.status === 422) {
                alert('Another product is already using that image, please find another image')
            } else {
                console.log(err.response);
            }
        }
    }

    const addProductToCart = async () => {
        const reqData = { quantity }
        await axios.post(`/add-product-to-cart/${id}`, reqData);
        navigate('/products');
    }

    const changeDisplayPrice = () => {
        if (variablePricing) {
            for (let i = 0; i < variablePricing.length; i++) {
                if (variablePricing[i].max === null || variablePricing[i].max === 0) {
                    if (quantity >= variablePricing[i].min) {
                        setDisplayPrice(variablePricing[i].price)
                    }
                } else {
                    if (quantity >= variablePricing[i].min && quantity <= variablePricing[i].max) {
                        setDisplayPrice(variablePricing[i].price)
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (product) {
            changeDisplayPrice();
        }
    }, [product]);

    useEffect(() => {
        changeDisplayPrice();
    }, [quantity])


    useEffect(() => {
        const getProductDetails = async () => {
            const { data } = await axios.get(`/product/${id}`);
            setProduct(data.productDoc);
            setVariablePricing(data.prices);
            setProductName(data.productDoc.name);
            setProductPartNumber(data.productDoc.partNumber);
            setProductDescrition(data.productDoc.description);
            setProductVariablePricing(data.productDoc.variablePricing);
            setThumbnailImageId(data.productDoc.thumbnailImageId);
            setDetailsImageId(data.productDoc.detailsImageId);
            setThumbnailFilePath(data.productDoc.thumbnailImageFileName);
            setDetailsFilePath(data.productDoc.detailsImageFileName);
        }
        getProductDetails();

    }, [id, refresh]);

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
        } else {
            setAdminPrivilegs(false);
        }
    }, [user]);

    useEffect(() => {
        if (!showEdit && product) {
            setProductName(product.name || '');
            setProductDescrition(product.description || '');
            setProductVariablePricing(product.variablePricing || []);
        }
        if (showEdit) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [showEdit]);


    return (
        <div className={`pt-40 lgMobile:py-56 mdMobile:py-56 lgMobile:pb-24 mdMobile:pb-24 ${darkMode ? 'text-white bg-[#131313]' : 'text-black bg-white'}`}>
            <div className="w-full h-[40rem] p-10 tablet:p-2 flex lgMobile:flex-col mdMobile:flex-col relative px-[15rem] lgMobile:px-0 mdMobile:px-0 mb-44">
                {adminPrivileges && (
                    <button className="absolute top-4 right-[17rem] px-10 border-[3px] border-gray-300 rounded-xl font-semibold"
                        onClick={() => setShowEdit(true)}
                    >Edit</button>
                )}
                <div className="h-full tablet:h-[20rem] w-1/2 lgMobile:w-full mdMobile:w-full flex justify-center lgMobile:mt-10 mdMobile:mt-10">
                    <img src={`https://ideasthatfloat-server-lnr7.onrender.com/uploads/${detailsImageId ? detailsImageId : thumbnailImageId}`} className="h-full object-cover" />
                </div>
                <div className="h-full w-1/2 lgMobile:w-full mdMobile:w-full ml-10 lgMobile:ml-0 mdMobile:ml-0 p-10 tablet:p-5 lgMobile:p-6 mdMobile:p-6">
                    <h1 className="text-4xl tablet:text-2xl lgMobile:text-2xl mdMobile:text-2xl font-bold pb-4">{product.name}</h1>
                    <p className="text-4xl tablet:text-2xl lgMobile:text-2xl mdMobile:text-2xl font-semibold mb-6">${displayPrice}</p>
                    <p className="text-md">Quantity</p>
                    <div className="w-1/3 tablet:w-1/2 lgMobile:w-full mdMobile:w-full mt-2 h-[3rem] rounded-lg bg-gradient-to-l from-[#facc22] to-[#FF7F11] p-[2px]">
                        <div className="w-full h-full bg-[#131313] rounded-lg flex items-center justify-between px-6 font-semibold text-xl text-white">
                            <button className="p-2"
                                onClick={() => {
                                    if (quantity > 1) {
                                        setQuantity(quantity - 1)
                                    } else {
                                        return
                                    }
                                }}
                            >-</button>
                            <input type="number" className="bg-transparent w-1/3 text-center outline-none"
                                value={quantity}
                                onChange={(ev) => setQuantity(ev.target.value)}
                            />
                            <button className="p-2"
                                onClick={() => {
                                    setQuantity(quantity + 1)
                                }}
                            >+</button>
                        </div>
                    </div>

                    <button className={`w-full text-center text-xl tablet:text-lg h-[3rem] tablet:h-[2.5rem] border-2 ${darkMode ? 'border-white' : 'border-black'} mt-6 rounded-lg`}
                        onClick={() => {
                            addProductToCart();
                        }}
                    >Add to Cart</button>
                    <button className="w-full text-center text-xl h-[3rem] bg-[#FF7F11] text-white mt-4 rounded-lg">Buy Now</button>
                    <div>
                        <p className="mt-8 text-xl">Part Number: <span className="font-bold">{product.partNumber}</span></p>
                    </div>
                    <p className="mt-4 text-2xl font-bold">Product Description:</p>
                    <div className="w-full h-[15rem] mdMobile:h-[20rem] py-6 pr-4 rounded-xl overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-2xl">{product.description}</div>
                </div>
                <div className="lgMobile:mt-44 mdMobile:mt-[20rem] lgMobile:w-full mdMobile:w-full lgMobile:block mdMobile:block hidden">
                    <Footer />
                </div>
            </div>
            <div className="lgMobile:hidden mdMobile:hidden block">
                <Footer />
            </div>
            <div className={`fixed top-0 left-0 w-full h-full ${darkMode ? 'text-white' : 'text-black'} bg-black/50 z-[99] ${showEdit ? 'flex justify-center items-center' : 'hidden'}`}>
                <div className={`w-2/3 lgMobile:w-[90%] mdMobile:w-[90%] mdMobile:-translate-x-2 h-[85%] ${darkMode ? 'bg-[#131313]' : 'bg-white'} border-4 border-[#FF7F11] rounded-3xl flex flex-col items-center p-12 overflow-y-auto scroll-p-5 relative`}>
                    <div className="absolute top-2 right-2 cursor-pointer"
                        onClick={() => setShowEdit(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill={`${darkMode ? '#fff' : '#131313'}`}><path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z" /></svg>
                    </div>
                    <h2 className='text-4xl lgMobile:text-2xl mdMobile:text-2xl font-semibold'>Edit Product</h2>
                    <form className='w-full flex flex-col items-center'
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            saveProductEdits();
                        }}
                    >
                        <div className='w-2/3 lgMobile:w-full mdMobile:w-full mt-10 text-xl font-semibold mb-2'>
                            <p>Product name:</p>
                        </div>
                        <input type="text" placeholder='Product name' className='w-2/3 lgMobile:w-full mdMobile:w-full text-2xl lgMobile:text-xl mdMobile:text-xl border-b-2 bg-transparent p-2 border-gray-300 outline-none' required
                            value={productName}
                            onChange={(ev) => setProductName(ev.target.value)}
                        />
                        <div className='w-2/3 lgMobile:w-full mdMobile:w-full mt-10 text-xl font-semibold mb-2'>
                            <p>Part number:</p>
                        </div>
                        <input type="text" placeholder='XXX-XXXXX' className='w-2/3 lgMobile:w-full mdMobile:w-full text-2xl lgMobile:text-xl mdMobile:text-xl border-b-2 p-2 bg-transparent outline-none' required maxLength="9"
                            value={productPartNumber}
                            onChange={(ev) => {
                                let value = ev.target.value;
                                value = value.replace(/[^0-9]/ig, "").toUpperCase();
                                if (value.length > 3) {
                                    value = value.slice(0, 3) + '-' + value.slice(3);
                                }
                                setProductPartNumber(value);
                            }}
                        />
                        <div className='w-2/3 lgMobile:w-full mdMobile:w-full mt-4 text-xl font-semibold mb-2'>
                            <p>Product description:</p>
                        </div>
                        <TextAreaAutosize className='w-2/3 lgMobile:w-full mdMobile:w-full border-b-2 bg-transparent p-2 text-2xl lgMobile:text-xl mdMobile:text-xl resize-none outline-none' autoComplete='off' placeholder='Product description' required
                            value={productDescription}
                            onChange={(ev) => setProductDescrition(ev.target.value)}
                        ></TextAreaAutosize>
                        <div className='w-2/3 lgMobile:w-full mdMobile:w-full mt-4 text-xl font-semibold mb-2'>
                            <p>Variable pricing:</p>
                        </div>
                        <div className='w-2/3 lgMobile:w-full mdMobile:w-full flex flex-col'>
                            {variablePricing && variablePricing.length > 0 && variablePricing.map((price, index) => (
                                <div key={index} className='flex relative'>
                                    <div className={`py-2 px-4 lgMobile:px-1 mdMobile:px-1 lgMobile:py-2 mdMobile:py-2 mr-4 lgMobile:mr-2 mdMobile:mr-2 font-semibold text-xl lgMobile:text-sm mdMobile:text-sm lgMobile:flex mdMobile:flex lgMobile:justify-center mdMobile:justify-center lgMobile:items-center mdMobile:items-center mb-4 ${darkMode ? 'bg-white text-black' : 'bg-[#131313]/80 text-white'}  w-1/2 rounded-full `}>
                                        {`${price.max ? (index === variablePricing.length - 1 ? 'Quantity: ' + price.min + ' - ' + price.max + '+' : 'Quantity: ' + price.min + ' - ' + price.max) : (index === variablePricing.length - 1 ? 'Quantity: ' + price.min + '+' : 'Quantity: ' + price.min)}`}
                                    </div>
                                    <div className={`py-2 lgMobile:px-2 mdMobile:px-2 px-4 font-semibold text-xl lgMobile:text-sm mdMobile:text-sm lgMobile:flex mdMo   flex lgMobile:justify-center mdMobile:justify-center lgMobile:items-center mdMobile:items-center mb-4 ${darkMode ? 'bg-white text-black' : 'bg-[#131313]/80 text-white'} w-1/2 rounded-full`}>{`Price: $${price.price}`}</div>
                                    <button className='absolute top-0 -right-12 lgMobile:mr-2 mdMobile:mr-2 lgMobile:mt-1 mdMobile:mt-1 bg-[#FF7F11] rounded-full p-1'
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            const updatedPricing = variablePricing.filter((_, i) => i !== index);
                                            setVariablePricing(updatedPricing);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[36px] h-[36px] lgMobile:w-[24px] mdMobile:w-[24px] lgMobile:h-[24px mdobile:w-[24px]" viewBox="0 -960 960 960" fill="#fff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
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
                                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#FF7F11"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>
                                <p className='text-xl font-semibold ml-4'>Add Price</p>
                            </button>
                            <div className={`w-full text-xl lgMobile:text-lg mdMobile:text-lg font-thin ${showAddPrice ? 'flex' : 'hidden'}`}>
                                <div className='w-1/2 lgMobile:w-full mdMobile:w-full mr-4 lgMobile:mb-4 mdMobile:mb-4'>
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
                                <div className='w-1/2 lgMobile:w-full mdMobile:w-full'>
                                    <p className='mb-4 lgMobile:mb-2 mdMobile:mb-2'>Price</p>
                                    <input type="number" className={`${showAddPrice ? '' : 'hidden'} bg-transparent border-b-2 w-full outline-none`} placeholder='Price'
                                        onChange={(ev) => {
                                            let value = ev.target.value;
                                            setPricingPrice(Number(value).toFixed(2));
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
                                    setVariablePricing([...variablePricing, variablePricingData]);
                                    setShowAddPrice(false);
                                }}
                            >Save Price</button>
                        </div>
                        <div className='w-2/3 lgMobile:w-full mdMobile:w-full mt-4 text-xl lgMobile:text-lg mdMobile:text-lg font-semibold mb-2'>
                            <p>Product thumbnail image:</p>
                        </div>
                        <input id='fileUploadThumbnail' type="file" className='hidden'
                            onChange={(ev) => {
                                setProductThumbnailImg(ev.target.files[0]);
                                setThumbnailFilePath(ev.target.files[0].name);
                                setFileInputThumbnailText('Change File');
                            }}
                        />
                        <div className="w-full flex lgMobile:flex-col mdMobile:flex-col items-center">
                            <label htmlFor="fileUploadThumbnail" className={`bg-transparent border-4 border-[#FF7F11] p-4 w-1/4 lgMobile:w-full mdMobile:w-full rounded-xl self-start ml-[11rem] lgMobile:ml-0 mdMobile:ml-0 mt-2 h-[4rem] ${darkMode ? 'text-white' : 'text-black'} font-bold text-2xl lgMobile:text-xl mdMobile:text-xl flex justify-center items-center cursor-pointer`}>{fileInputThumbnailText}</label>
                            <p className={`${darkMode ? 'text-white' : 'text-black'} ml-4 lgMobile:text-[1rem]`}>{thumbnailFilePath}</p>
                        </div>
                        <div className='w-2/3 lgMobile:w-full mdMobile:w-full mt-4 text-xl lgMobile:text-lg mdMobile:text-lg font-semibold mb-2'>
                            <p>Product details image (optional):</p>
                        </div>
                        <input id='fileUploadDetails' type="file" className='hidden'
                            onChange={(ev) => {
                                setProductDetailsImg(ev.target.files[0]);
                                setDetailsFilePath(ev.target.files[0].name);
                                setFileInputDetailsText('Change File');
                            }}
                        />
                        <div className="w-full flex lgMobile:flex-col mdMobile:flex-col items-center">
                            <label htmlFor="fileUploadDetails" className={`bg-transparent border-4 border-[#FF7F11] p-4 w-1/4 lgMobile:w-full mdMobile:w-full rounded-xl self-start ml-[11rem] lgMobile:ml-0 mdMobile:ml-0 mt-2 h-[4rem] ${darkMode ? 'text-white' : 'text-black'} font-bold text-2xl lgMobile:text-xl mdMobile:text-xl flex justify-center items-center cursor-pointer`}>{fileInputDetailsText}</label>
                            <p className={`${darkMode ? 'text-white' : 'text-black'} ml-4 lgMobile:text-[1rem] mdMobile:text-[1rem]`}>{detailsFilePath}</p>
                        </div>
                        <button type="submit" className='w-2/3 bg-[#FF7F11] rounded-3xl p-2 text-white font-semibold text-2xl mt-10'>Save product</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;