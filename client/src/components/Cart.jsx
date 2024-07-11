import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

const Product = ({ product, index, cart, setCart, prices, setPrices, darkMode, cartProducts, setCartProducts }) => {


    const removeItemFromCart = async (productId, count) => {
        const reqData = { cartProducts, productId, count, index };
        const { data } = await axios.post('/delete-cart-item', reqData);
        setCartProducts(data.newCartProducts);
        setCart(data.cartDoc)
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
        <div key={index} className={`text-3xl mt-10 flex lgMobile:flex-col lgMobile:items-center border-b-2 border-[#FF7F11] pb-16 ${darkMode ? 'text-white' : 'text-black'}`}>
            <div className="w-[20rem] h-[20rem] flex justify-center">
                <img src={`https://ideasthatfloat-server-lnr7.onrender.com/uploads/${product.details.thumbnailImageId}`} className="h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center lgMobile:items-center ml-6">
                <p className="mb-8 font-semibold text-xl">{product.details.name}</p>
                <p className="text-lg lgMobile:mg-2">{`Quantity: ${product.count}`}</p>
            </div>
            <div className="flex flex-col justify-center ml-auto lgMobile:ml-2">
                <p className="text-3xl font-bold text-center mb-6">Price: ${getProductPrice().toFixed(2)}</p>
                <button className="bg-transparent border-2 border-[#FF7F11] font-semibold text-lg px-4 py-1 rounded-full"
                    onClick={() => {
                        const productId = product.details.id
                        const productCount = product.count
                        removeItemFromCart(productId, productCount)
                    }}
                >Remove from Cart</button>
            </div>
        </div>
    )
}


const Cart = () => {

    const { darkMode } = useContext(UserContext);

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

    useEffect(() => {
        if (prices.length > 0) {
            getSubtotalCost();
        }
    }, [prices])


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return (
        <div className={`pt-44 w-full ${darkMode ? 'text-white bg-[#131313]' : 'text-black bg-white'}`}>
            <div className="mx-[22rem] lgMobile:mx-6 mb-56">
                <div className="flex justify-between items-end h-[6rem] mb-16">
                    <h1 className="text-6xl lgMobile:text-4xl font-bold">Your Cart</h1>
                    <p className="text-4xl lgMobile:text-2xl font-semibold">{`Total items: ${cart.productCountTotal ? cart.productCountTotal : '0'}`}</p>
                </div>
                {cartProducts && cartProducts.length > 0 && cartProducts.map((product, index) => (
                    <Product key={index} product={product} index={index} cart={cart} setCart={setCart} prices={prices} setPrices={setPrices} darkMode={darkMode} cartProducts={cartProducts} setCartProducts={setCartProducts} />
                ))}
                {cart.productCountTotal > 0 && (
                    <div className="w-full h-[15rem] mt-10 flex flex-col items-end">
                        {prices && prices.length > 0 && (
                            <p className="text-2xl font-semibold">{`Subtotal (${cart.productCountTotal > 1 ? cart.productCountTotal + ' items' : cart.productCountTotal + ' item'}): $${subtotalCost.toFixed(2)}`}</p>
                        )}
                        <Link to={`${user ? '/cart/checkout' : '/login'}`}>
                            <button className="text-white bg-[#FF7F11] mt-6 px-10 py-2 text-xl font-semibold rounded-lg">Proceed to Checkout</button>
                        </Link>
                    </div>
                )}
                {!cart.productCountTotal && (
                    <div className="text-4xl h-[15rem] flex items-center justify-center">
                        <p>Cart Is Empty</p>
                    </div>
                )}
            </div>
            <div className="relative bottom-0 w-full">
                <Footer />
            </div>
        </div>
    );
}

export default Cart;