import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

const Product = ({ product, index, cart, setCart, prices, setPrices, darkMode, cartProducts, setCartProducts, navTotalCartCount, setNavTotalCartCount }) => {


    const removeItemFromCart = async (productId, count, priceIndex) => {
        const reqData = { cartProducts, productId, count, index };
        const { data } = await axios.post('/delete-cart-item', reqData);
        setCartProducts(data.newCartProducts);
        setCart(data.cartDoc)

        setNavTotalCartCount(navTotalCartCount - count)

        setPrices(prevPrices => prevPrices.filter((_, i) => i !== priceIndex))
    }

    const getProductPrice = () => {
        // Sort the variablePricing array in descending order based on the min value
        const sortedVariablePricing = [...product.pricing].sort((a, b) => b.min - a.min);
        for (let i = 0; i < sortedVariablePricing.length; i++) {
            const { min, max } = sortedVariablePricing[i];
            const productCount = product.count;
            const isWithinRange = (min <= productCount) && ((max >= productCount) || max === null || max === 0);

            if (isWithinRange) {
                return (sortedVariablePricing[i].price * productCount);
            }
        }
    }


    useEffect(() => {
        const productPrice = getProductPrice();
        setPrices(prevPrices => [...prevPrices, productPrice]);
    }, []);

    return (
        <div key={index} className={`text-3xl tablet:text-xl mt-10 flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col xlMobile:items-center lgMobile:items-center font-shanti mdMobile:items-center border-b-2 border-[#FF7F11] pb-16 ${darkMode ? 'text-white' : 'text-black'}`}>
            <div className="w-[20rem] smLaptop:w-[15rem] tablet:w-[15rem] h-[20rem] smLaptop:h-[15rem] tablet:h-[15rem] flex justify-center">
                <img src={`https://ideasthatfloat-server-lnr7.onrender.com/uploads/${product.details.thumbnailImageId}`} className="h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center lgMobile:items-center mdMobile:items-center ml-6">
                <p className="mb-8 text-xl smLaptop:text-lg tablet:pr-6 xlMobile:mt-6 xlMobile:text-2xl">{product.details.name}</p>
                <p className="text-lg smLaptop:text-[1rem] xlMobile:text-xl xlMobile:mb-6 lgMobile:mb-2 mdMobile:mb-2">{`Quantity: ${product.count}`}</p>
            </div>
            <div className="flex flex-col justify-center ml-auto lgMobile:ml-2 mdMobile:ml-2">
                <p className="text-3xl smLaptop:text-2xl tablet:text-2xl font-bold text-center mb-6 font-hind">Price: ${Number(getProductPrice()).toFixed(2)}</p>
                <button className="bg-transparent border-2 border-[#FF7F11] font-semibold text-lg xlMobile:text-2xl tablet:text-sm px-4 font-hind tablet:px-2 py-1 rounded-full whitespace-nowrap"
                    onClick={() => {
                        const productId = product.details.id
                        const productCount = product.count
                        removeItemFromCart(productId, productCount, index)
                    }}
                >Remove from Cart</button>
            </div>
        </div>
    )
}


const Cart = ({ prevLoginPath, setPrevLoginPath }) => {

    const { darkMode, navTotalCartCount, setNavTotalCartCount } = useContext(UserContext);
    const navigate = useNavigate();
    const [cart, setCart] = useState({});
    const [cartProducts, setCartProducts] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [subtotalCost, setSubtotalCost] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [prices, setPrices] = useState([]);
    const { user, setUser } = useContext(UserContext);

    const getSubtotalCost = () => {
        let subtotal = 0;
        for (let i = 0; i < cartProducts.length; i++) {
            subtotal += prices[i]
        }
        setSubtotalCost(subtotal);
    }

    useEffect(() => {
        const getUserCart = async () => {
            const { data } = await axios.get('/user-cart');
            setCart(data.cartDoc);
            console.log(data)
            const products = []
            for (let i = 0; i < data.products.length; i++) {
                const productDetails = {
                    details: data.products[i],
                    pricing: data.pricings[i],
                    count: data.cartProducts[i].count
                }
                products.push(productDetails)
            }
            setCartProducts(products)
        }
        getUserCart();
    }, []);

    const checkoutUser = async (userCart, userDoc) => {
        userCart.forEach(item => {
            item["stripeImgThumbnail"] = `https://ideasthatfloat-server-lnr7.onrender.com/uploads/${item.details.thumbnailImageId}`
        });
        console.log(userCart)
        const { data } = await axios.post('/checkout-cart', { userCart, userDoc })
        console.log(data)
    }

    useEffect(() => {
        if (prices.length > 0) {
            getSubtotalCost();
        }
    }, [prices])


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        console.log(cartProducts)
    }, [cartProducts])


    return (
        <div className={`pt-44 laptop:pt-[9.45rem] smLaptop:pt-32 tablet:pt-24 w-full ${darkMode ? 'text-white bg-[#131313]' : 'text-black bg-white'}`}>
            <div className="mx-[22rem] lg:mx-[14rem] md:mx-44 sm:mx-44 xsm:mx-36 xxsm:mx-32 laptop:mx-28 smLaptop:mx-24 tablet:mx-12 xlMobile:mx-12 lgMobile:mx-6 mdMobile:mx-6 mb-[21.05rem] xlMobile:mb-32">
                <div className="flex justify-between items-end h-[6rem] mb-16">
                    <h1 className="text-6xl smLaptop:text-5xl tablet:text-5xl xlMobile:text-4xl lgMobile:text-4xl mdMobile:text-4xl font-[900] font-ruda">Your Cart</h1>
                    <p className="text-4xl smLaptop:text-3xl font-hind tablet:text-2xl xlMobile:text-2xl lgMobile:text-2xl mdMobile:text-2xl font-semibold">{`Total items: ${cart.productCountTotal ? cart.productCountTotal : '0'}`}</p>
                </div>
                {cartProducts && cartProducts.length > 0 && cartProducts.map((product, index) => (
                    <Product key={index} product={product} index={index} cart={cart} setCart={setCart} prices={prices} setPrices={setPrices} darkMode={darkMode} cartProducts={cartProducts} setCartProducts={setCartProducts} navTotalCartCount={navTotalCartCount} setNavTotalCartCount={setNavTotalCartCount} />
                ))}
                {cart.productCountTotal > 0 && (
                    <div className="w-full h-[15rem] mt-10 flex flex-col items-end">
                        {prices && prices.length > 0 && (
                            <p className="text-2xl smLaptop:text-xl font-semibold font-hind">{`Subtotal (${cart.productCountTotal > 1 ? cart.productCountTotal + ' items' : cart.productCountTotal + ' item'}): $${Number(subtotalCost).toFixed(2)}`}</p>
                        )}
                        <button className="text-white bg-[#FF7F11] mt-6 xlMobile:mt-10 px-10 py-2 smLaptop:py-1 text-xl smLaptop:text-lg xlMobile:text-2xl font-semibold rounded-lg font-hind"
                            onClick={() => {
                                if (!user) {
                                    setPrevLoginPath('/cart')
                                    navigate('/login')
                                } else {
                                    checkoutUser(cartProducts, user)
                                }
                            }}
                        >Proceed to Checkout</button>
                    </div>
                )}
                {!cart.productCountTotal && (
                    <div className="text-4xl font-hind h-[15rem] flex items-center justify-center">
                        <p>Cart Is Empty</p>
                    </div>
                )}
            </div>
            <div className="w-full">
                <Footer />
            </div>
        </div>
    );
}

export default Cart;