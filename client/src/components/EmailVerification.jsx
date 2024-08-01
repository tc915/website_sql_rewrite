import { useContext } from "react";
import { UserContext } from "../UserContext";

const EmailVerification = () => {
    const { darkMode } = useContext(UserContext);
    return (
        <div className={`pt-32 w-full h-[52.1rem] flex justify-center items-center ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}>
            <div className="w-[30rem] h-[10rem] bg-[#FF7F11] text-white flex justify-center items-center rounded-2xl">
                <p className="font-semibold font-shanti text-xl text-center px-10">A Verification Email has been sent to the provided address.<br />To log in, please verify your Email address</p>
            </div>
        </div>
    );
}

export default EmailVerification;