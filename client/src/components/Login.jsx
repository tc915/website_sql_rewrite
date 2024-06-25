import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Footer from "../partials/Footer";

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrectPopUpText, setIncorrectPopUpText] = useState('');

    const { setUser, darkMode } = useContext(UserContext);

    const loginUser = async () => {
        let username = email.split('@');
        username = username[0];
        try {
            const { data } = await axios.post('/login', { username, email, password });
            setUser(data);
            console.log(data);
            navigate('/');
        } catch (e) {
            console.log(e);
            if (e.message === 'Request failed with status code 420') {
                setIncorrectPopUpText('Email not verified')
            } else if (e.message === 'Request failed with status code 422') {
                setIncorrectPopUpText('User not found');
            }
        }
    }

    useEffect(() => {
        if (incorrectPopUpText !== '') {
            alert(incorrectPopUpText);
            setIncorrectPopUpText('');
        }
    }, [incorrectPopUpText]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    return (
        <div>
            <div className={`flex flex-col justify-center items-center h-screen pt-32 ${darkMode ? 'bg-[#131313]' : 'bg-white'}`}>
                <div className={`flex flex-col justify-center items-center ${darkMode ? 'bg-white' : 'bg-[#131313] text-white'} px-10 py-6 rounded-xl shadow-md`}>
                    <h1 className="font-semibold text-3xl mb-8">Login</h1>
                    <form className="flex flex-col"
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            loginUser();
                        }}
                    >
                        <input className="bg-transparent text-2xl font-semibold mb-4 outline-none" type="email" placeholder="Email" spellCheck="false" autoComplete="email" required
                            value={email}
                            onChange={(ev) => setEmail(ev.target.value)}
                        />
                        <input className="bg-transparent text-2xl font-semibold outline-none" type="password" placeholder="Password" spellCheck="false" autoComplete="current-password" required
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)}
                        />
                        <button className="bg-[#FF7F11] text-white mt-6 py-2 rounded-lg text-lg font-semibold" type="submit">Login</button>
                        <p className="text-center mt-4">Don't have an account? <Link to='/register' className="text-[#FF7F11] hover:underline">Register</Link></p>
                        <Link to={'/login/forgot-password'}><p className="mt-2 text-sm text-center text-[#FF7F11] hover:underline">Forgot Password?</p></Link>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Login;