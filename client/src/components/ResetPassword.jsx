import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import Footer from "../partials/Footer";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { username } = useParams();
    const { darkMode } = useContext(UserContext);
    const [password, setPassword] = useState('');
    const [confirmPasswordBool, setConfirmPasswordBool] = useState(false);
    const [resetPasswordPopup, setResetPasswordPopup] = useState(false);

    // request to reset the user's password
    const resetPassword = async () => {
        if (confirmPasswordBool) {
            const { data } = await axios.post(`/reset-password/${username}`, { password });
            setResetPasswordPopup(true);
        }
    }

    return (
        <>
            <div className={`absolute top-0 left-0 w-full h-screen bg-black/50 z-[99] flex justify-center items-center ${resetPasswordPopup ? '' : 'hidden'}`}>
                <div className="w-[20rem] h-[10rem] bg-[#131313] text-white border-4 rounded-xl border-[#FF7F11] flex flex-col justify-center items-center">
                    <p className="text-xl font-semibold">Password successfully reset</p>
                    <button className="bg-white px-8 py-1 text-black font-semibold rounded-lg mt-4"
                        onClick={() => {
                            setResetPasswordPopup(false);
                            navigate('/login');
                        }}
                    >Ok</button>
                </div>
            </div>
            <div className={`h-screen w-full flex flex-col items-center justify-center pt-32 ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}>
                <form className={`w-[30rem] h-[20rem] ${darkMode ? 'bg-white text-black' : 'bg-[#131313] text-white'} rounded-2xl p-8 flex flex-col items-center`}
                    onSubmit={(ev) => {
                        ev.preventDefault()
                        resetPassword();
                    }}
                >
                    <p className="text-center text-3xl font-semibold">Reset Password</p>
                    <input type="password" className="bg-transparent border-b-2 pb-2 border-gray-400 w-4/5 text-2xl font-semibold mt-10 outline-none" placeholder="New password" required
                        onChange={(ev) => setPassword(ev.target.value)}
                    />
                    <input type="password" className={`bg-transparent border-b-2 pb-2 border-gray-400 w-4/5 text-2xl font-semibold mt-4 outline-none ${confirmPasswordBool ? 'text-green-300' : 'text-red-400'}`} placeholder="Confirm password" required
                        onChange={(ev) => {
                            if (ev.target.value === password) {
                                setConfirmPasswordBool(true);
                            } else {
                                setConfirmPasswordBool(false);
                            }
                        }}
                    />
                    <button type="submit" className="bg-[#FF7F11] text-white font-semibold mt-auto mb-2 text-xl rounded-full w-2/3 p-2 ">Reset Password</button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default ResetPassword;