import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { UserContext } from "../UserContext";


const CheckoutComplete = () => {

    const { sessionId } = useParams()

    useEffect(() => {
        if (sessionId) {
            const deleteCartItems = async () => {
                try {
                    await axios.post('/delete-cart-items')
                    console.log('Cart items deleted')
                } catch (err) {
                    console.log(err)
                }
            }
            deleteCartItems()
        }
    }, [sessionId])

    useEffect(() => {
        if (window.location.pathname.includes('success')) {
            const getCheckoutSession = async () => {
                try {
                    const { data } = await axios.get(`/${sessionId}`)
                    console.log(data)
                } catch (err) {
                    console.log(err)
                }
            }
            getCheckoutSession()
        }
    }, [])

    return (
        <>
            <div className="w-full h-screen pt-44">
                <h1>Checkout complete!</h1>
                {sessionId ? (
                    <p>Session ID: {sessionId}</p>
                ) : (
                    <p>No session ID found.</p>
                )}
            </div>
        </>
    );
}

export default CheckoutComplete;