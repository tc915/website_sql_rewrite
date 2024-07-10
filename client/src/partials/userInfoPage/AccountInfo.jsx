import axios from "axios";
import { useEffect, useState } from "react";

const AccountInfo = ({ name, setName, email, setEmail, password, setPassword, darkMode, username, needNewEmailVerification, setNeedNewEmailVerification, changedPassword, setChangedPassword }) => {

    const [isChangeEmail, setIsChangeEmail] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [confirmPasswordBool, setConfirmPasswordBool] = useState(false);


    const saveAccountChanges = async () => {
        if (password && password !== '') {
            if (confirmPasswordBool) {
                try {
                    const { data } = await axios.post(`/save-user-changes/${username}`, { email, password })
                    setNeedNewEmailVerification(data.usernameChange);
                    setChangedPassword(data.passwordChange);
                } catch (err) {
                    console.log(err)
                }
            }
        } else {
            try {
                const { data } = await axios.post(`/save-user-changes/${username}`, { email, password })
                console.log(data);
                setNeedNewEmailVerification(data.usernameChange);
                setChangedPassword(data.passwordChange);
            } catch (err) {
                if (err.response.status === 420) {
                    alert('The email provided is already associated with an account')
                } else {
                    console.log(err)
                }
            }
        }

    }

    return (
        <form className="w-[65rem] lgMobile:px-0 lgMobile:mt-16 flex flex-col items-center px-24 lgMobile:ml-28"
            onSubmit={(ev) => {
                ev.preventDefault();
                saveAccountChanges();
            }}
        >
            <h1 className="mt-[6rem] font-bold text-3xl lgMobile:text-xl">Account Info</h1>
            <p className="mt-6 text-2xl lgMobile:text-lg font-semibold">{name}</p>
            <div className="w-full lgMobile:w-1/2 h-[5rem] mt-6 flex items-center px-24 lgMobile:px-4 rounded-2xl border-2">
                <label htmlFor="userEmail" className="text-xl font-semibold mr-4 lgMobile:hidden">Email:</label>
                <p className={`text-xl lgMobile:hidden font-semibold ${darkMode ? 'text-white/50' : 'text-black/40'} ${isChangeEmail ? 'hidden' : ''}`}>{email || ''}</p>
                <input type="email" name="userEmail" id="userEmail" placeholder="Email" required autoComplete="email" className={`border-b-2 p-2 font-semibold outline-none bg-transparent ${isChangeEmail ? '' : 'hidden'}`}
                    value={email || ''}
                    onChange={(ev) => setEmail(ev.target.value)}
                />
                <button className={`${isChangeEmail ? 'hidden' : ''} border-4 border-[#FF7F11] px-10 py-2 text-xl lgMobile:text-sm ${darkMode ? 'text-white' : 'text-black'} font-semibold rounded-full ml-auto`}
                    onClick={(ev) => {
                        ev.preventDefault();
                        setIsChangeEmail(true);
                    }}
                >Change Email</button>
                <button className={`ml-6 ${isChangeEmail ? '' : 'hidden'}`}
                    onClick={(ev) => {
                        ev.preventDefault();
                        setIsChangeEmail(false)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill={darkMode ? '#fff' : '#131313'}><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                </button>
            </div>
            <div className="w-full lgMobile:w-1/2 h-[5rem] mt-6 flex lgMobile:flex-col lgMobile:justify-center items-center px-24 lgMobile:px-4 rounded-2xl border-2">
                <label htmlFor="userPassword" className="text-xl font-semibold mr-4 lgMobile:hidden">Password:</label>
                <button className={`${isChangePassword ? 'hidden' : ''} border-4 border-[#FF7F11] px-6 rounded-full text-xl lgMobile:text-sm font-semibold ${darkMode ? 'text-white' : 'text-black'} py-2 ml-auto`}
                    onClick={(ev) => {
                        ev.preventDefault();
                        setIsChangePassword(true)
                    }}
                >Change Password</button>
                <input type="password" name="userPassword" id="userPassword" placeholder="New password" className={`${isChangePassword ? '' : 'hidden'} border-b-2 p-2 text-xl font-semibold outline-none bg-transparent`} autoComplete="current-password"
                    onChange={(ev) => setPassword(ev.target.value)}
                />
                <input type="password" autoComplete="current-password" placeholder="Confirm new password" className={`${isChangePassword ? '' : 'hidden'} ${confirmPasswordBool ? 'text-green-300' : 'text-red-400'} border-b-2 p-2 text-xl font-semibold outline-none bg-transparent`}
                    onChange={(ev) => {
                        if (ev.target.value === password) {
                            setConfirmPasswordBool(true);
                        } else {
                            setConfirmPasswordBool(false);
                        }
                    }}
                />
                <button className={`ml-6 ${isChangePassword ? '' : 'hidden'}`}
                    onClick={(ev) => {
                        ev.preventDefault();
                        setIsChangePassword(false)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill={darkMode ? '#fff' : '#131313'}><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                </button>
            </div>
            <button type="submit" className="mt-10 py-4 font-semibold text-white bg-[#FF7F11] w-1/2 text-xl rounded-full">Save Changes</button>
        </form>
    );
}

export default AccountInfo;