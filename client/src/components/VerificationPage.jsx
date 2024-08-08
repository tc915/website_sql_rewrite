import axios from "axios";
import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { UserContext } from "../UserContext";

const VerificationPage = () => {

    const { token } = useParams();
    const { darkMode } = useContext(UserContext);

    // when the url contains /verify-email/:tokenString, a request is made to verify the email
    useEffect(() => {
        const verifyEmail = async () => {
            await axios.get(`/verify-email/${token}`)
        }
        verifyEmail();
    }, [])

    return (
        <div className={`pt-32 w-full h-[52.1rem] flex justify-center items-center ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}>
            <div className="w-[30rem] h-[10rem] bg-[#FF7F11] text-white flex justify-center items-center rounded-2xl">
                <p className="font-semibold text-2xl text-center px-10">Your Email has been verified<br />You may now log in</p>
            </div>
        </div>
    );
}

export default VerificationPage;