import React from "react";
import { useParams } from "react-router";


const CheckoutComplete = () => {

    const { sessionId } = useParams()

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