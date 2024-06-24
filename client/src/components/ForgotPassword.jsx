import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import Footer from "../partials/Footer";
import axios from "axios";

const ForgotPassword = () => {
    const { darkMode } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [emailSentPopup, setEmailSentPopup] = useState(false);

    const sendPasswordResetEmail = async () => {
        try {
            const { data } = await axios.post('/reset-password-email', { email });
            console.log(data);
            setEmailSentPopup(true);
        } catch (err) { console.log(err) }
    }

    useEffect(() => {
        if (emailSentPopup) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [emailSentPopup]);

    return (
        <>
            <div className={`absolute top-0 left-0 w-full h-screen bg-black/50 z-[99] flex justify-center items-center ${emailSentPopup ? '' : 'hidden'}`}>
                <div className="w-[20rem] h-[10rem] bg-[#131313] text-white border-4 rounded-xl border-[#FF7F11] flex flex-col justify-center items-center">
                    <p className="text-xl font-semibold">Email sent</p>
                    <button className="bg-white px-8 py-1 text-black font-semibold rounded-lg mt-4"
                        onClick={() => setEmailSentPopup(false)}
                    >Ok</button>
                </div>
            </div>
            <div className={`h-screen w-full flex flex-col items-center justify-center pt-32 ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}>
                <form className={`w-[30rem] h-[20rem] ${darkMode ? 'bg-white text-black' : 'bg-[#131313] text-white'} rounded-2xl p-8 flex flex-col items-center`}
                    onSubmit={(ev) => {
                        ev.preventDefault()
                        sendPasswordResetEmail();
                    }}
                >
                    <p className="text-center text-3xl font-semibold">Forgot Password</p>
                    <input type="email" className="bg-transparent border-b-2 w-4/5 text-2xl font-semibold mt-14 outline-none" placeholder="Email" required
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <button type="submit" className="bg-[#FF7F11] text-white font-semibold mt-auto mb-2 text-xl rounded-full w-2/3 p-2 ">Send Email</button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default ForgotPassword;