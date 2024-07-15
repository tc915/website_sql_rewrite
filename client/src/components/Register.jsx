import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useContext, useEffect, useState } from "react";
import Footer from "../partials/Footer";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../UserContext";

const Register = () => {

    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPasswordBool, setConfirmPasswordBool] = useState(false);
    const [errorCode, setErrorCode] = useState();
    const [googleUser, setGoogleUser] = useState(null);

    const registerUser = () => {
        if (googleUser) {
            let username = googleUser.email.split('@');
            username = username[0];
            axios.post('/register', { name: googleUser.name, username, email: googleUser.email, password: null, googleUser: true })
                .then((res) => {
                    setUser(res.data);
                    navigate('/');
                })
                .catch((err) => console.log(err))
        } else {
            let username = email.split('@');
            username = username[0];
            axios.post('/register', { name, username, email, password, googleUser: false })
                .then((res) => {
                    navigate('/register/verify-email')
                })
                .catch((err) => {
                    setErrorCode(err.response.data.code);
                })
        }
    }

    useEffect(() => {
        if (errorCode === 11000) {
            alert('User already exists, please try either a different username or email')
            setErrorCode('');
        }
    }, [errorCode]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (googleUser !== null) {
            registerUser();
        }
    }, [googleUser])

    return (
        <div>
            <div className="flex flex-col justify-center items-center h-screen pt-32">
                <div className="flex flex-col justify-center items-center bg-[#131313] px-10 py-6 rounded-xl text-white shadow-md">
                    <h1 className="font-semibold text-3xl lgMobile:text-xl mdMobile:text-xl mb-8">Register</h1>
                    <div className="w-full mb-6 flex justify-center items-center">
                        <GoogleLogin
                            onSuccess={(credentialRsponse) => {
                                const credentialResponseDecoded = jwtDecode(credentialRsponse.credential);
                                setGoogleUser(credentialResponseDecoded);
                            }}
                            onError={() => {
                                console.log('Registration failed');
                            }}
                        />
                    </div>
                    <form className="flex flex-col"
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            registerUser();
                        }}
                    >
                        <input className="bg-transparent text-2xl lgMobile:text-lg mdMobile:text-lg font-semibold mb-4 outline-none" type="text" placeholder="Name" spellCheck="false" required
                            value={name}
                            onChange={(ev) => setName(ev.target.value)}
                        />
                        <input type="email" className="bg-transparent text-2xl lgMobile:text-lg mdMobile:text-lg font-semibold mb-4 outline-none" placeholder="Email" spellCheck="false" required
                            value={email}
                            onChange={(ev) => setEmail(ev.target.value)}
                        />
                        <input className="bg-transparent text-2xl lgMobile:text-lg mdMobile:text-lg font-semibold mb-4 outline-none" type="password" placeholder="Password" spellCheck="false" required
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)}
                        />
                        <input className={`bg-transparent ${confirmPasswordBool ? 'text-green-400' : 'text-red-400'} text-2xl lgMobile:text-lg mdMobile:text-lg font-semibold mb-10 outline-none`} type="password" placeholder="Confirm password" spellCheck="false" required
                            onChange={(ev) => {
                                if (ev.target.value === password) {
                                    setConfirmPasswordBool(true)
                                } else setConfirmPasswordBool(false)
                            }}
                        />
                        <button className="bg-[#FF7F11] py-2 rounded-lg text-lg lgMobile:text-[1rem] mdMobile:text-[1rem] font-semibold" type="submit">Register</button>
                        <p className="text-center mt-2">Already have an account? <Link to='/login' className="text-[#FF7F11] hover:underline">Login</Link></p>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Register;