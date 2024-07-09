import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import AccountInfo from "../partials/userInfoPage/AccountInfo";
import axios from "axios";
import { useNavigate } from "react-router";

const UserInfo = () => {
    const { user, darkMode } = useContext(UserContext);
    const navigate = useNavigate();

    const [userDoc, setUserDoc] = useState({});

    const [page, setPage] = useState('accountInfo');
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [needNewEmailVerification, setNeedNewEmailVerification] = useState(false);
    const [changedPassword, setChangedPassword] = useState(false);
    const [popupText, setPopupText] = useState('');

    useEffect(() => {
        if (user) {
            const getUserInfo = async () => {
                const { data } = await axios.get(`/user-info/${user.username}`);
                setUserDoc(data);
            }
            getUserInfo();
        }
    }, [user]);

    useEffect(() => {
        if (userDoc) {
            setName(userDoc.name);
            setEmail(userDoc.email);
        }
    }, [userDoc])

    useEffect(() => {
        if (needNewEmailVerification && !changedPassword) {
            setPopupText('A verification email has been sent to your new email address.\nPlease verify your new email to login again.');
        } else if (changedPassword && !needNewEmailVerification) {
            setPopupText('Your password has been successfully changed.');
        } else if (needNewEmailVerification && changedPassword) {
            setPopupText('Your email and password have been changed successfully.\nPlease verify your new email to login again.');
        }
    }, [needNewEmailVerification, changedPassword])

    return (
        <>
            <div className={`absolute top-0 left-0 w-full h-screen bg-black/50 z-[99] ${needNewEmailVerification || changedPassword ? 'flex justify-center items-center' : 'hidden'}`}>
                <div className="h-[15rem] w-[30rem] bg-[#131313] border-4 rounded-lg border-[#FF7F11] flex flex-col justify-center items-center px-10">
                    <p className="text-white text-xl font-semibold text-center p-2">{popupText ? popupText : ''}</p>
                    <button className="bg-white mt-6 px-10 py-2 rounded-xl font-semibold"
                        onClick={(ev) => {
                            ev.preventDefault();
                            setNeedNewEmailVerification(false);
                            navigate('/login')
                        }}
                    >Ok</button>
                </div>
            </div>
            <div className={`py-32 lgMobile:py-44 w-full h-screen ${darkMode ? 'bg-[#131313] text-white' : 'bg-white text-black'} flex`}>
                <div className="h-full w-[20rem] mr-28 lgMobile:-mr-[15rem] flex flex-col py-16">
                    <button className={`${page === 'accountInfo' ? 'bg-[#FF7F11] text-white' : ''} h-[4rem] rounded-e-full mb-4 flex items-center pl-10 lgMobile:pl-2 text-xl lgMobile:text-sm font-semibold`}
                        onClick={() => setPage('accountInfo')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill={darkMode ? '#fff' : (page === 'accountInfo' ? '#fff' : '#131313')}><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" /></svg>
                        <span className="ml-2 lgMobile:ml-0">Account Info</span>
                    </button>
                </div>
                {page === 'accountInfo' && user && <AccountInfo email={email} setEmail={setEmail} password={password} setPassword={setPassword} name={name} setName={setName} darkMode={darkMode} username={user.username} needNewEmailVerification={needNewEmailVerification} setNeedNewEmailVerification={setNeedNewEmailVerification} changedPassword={changedPassword} setChangedPassword={setChangedPassword} />}
            </div>
        </>
    );
}

export default UserInfo;