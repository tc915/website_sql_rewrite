import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useContext, useEffect, useState } from "react";
import Footer from "../partials/Footer";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../UserContext";

const Register = () => {

    const navigate = useNavigate();
    const { setUser, darkMode } = useContext(UserContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPasswordBool, setConfirmPasswordBool] = useState(false);
    const [errorCode, setErrorCode] = useState();
    const [googleUser, setGoogleUser] = useState(null);

    const registerUser = () => { // Function to handle user registration.

        if (googleUser) { // Check if `googleUser` is available (indicating a Google login).
            let username = googleUser.email.split('@'); // Extract the username part from the Google email.
            username = username[0]; // Use the part before '@' as the username.

            // Make a POST request to the server to register the user with Google credentials.
            axios.post('/register', {
                name: googleUser.name, // Send the user's name from Google.
                username, // Send the generated username.
                email: googleUser.email, // Send the user's email from Google.
                password: null, // No password needed for Google users.
                googleUser: true // Flag to indicate this is a Google user.
            })
                .then((res) => { // On successful registration.
                    setUser(res.data); // Update the user context with the registered user data.
                    navigate('/'); // Redirect to the home page.
                })
                .catch((err) => console.log(err)); // Handle any errors during registration and log them.
        } else { // If `googleUser` is not available (indicating a regular registration).
            let username = email.split('@'); // Extract the username part from the email input.
            username = username[0]; // Use the part before '@' as the username.

            // Make a POST request to the server to register the user with regular credentials.
            axios.post('/register', {
                name, // Send the user's name from input.
                username, // Send the generated username.
                email, // Send the user's email from input.
                password, // Send the password from input.
                googleUser: false // Flag to indicate this is a regular user.
            })
                .then((res) => { // On successful registration.
                    navigate('/register/verify-email'); // Redirect to the email verification page.
                })
                .catch((err) => { // Handle any errors during registration.
                    setErrorCode(err.response.data.code); // Update the error code state with the error code from the server response.
                });
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
        <div className={`${darkMode ? 'bg-[#131313]' : ''}`}>
            <div className="flex flex-col justify-center items-center h-screen pt-32 tablet:py-24">
                <div className={`flex flex-col justify-center items-center ${darkMode ? 'bg-white' : 'bg-[#131313]'} px-10 tablet:px-12 py-6 smLaptop:py-4 tablet:mt-24 rounded-xl text-white shadow-md`}>
                    <h1 className={`font-[800] text-3xl smLaptop:text-2xl tablet:text-xl lgMobile:text-xl mdMobile:text-xl mb-8 font-ruda ${darkMode ? 'text-black' : ''}`}>Register</h1>
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
                    <form className={`flex flex-col font-shanti ${darkMode ? 'text-black' : ''}`}
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            registerUser();
                        }}
                    >
                        <input className="bg-transparent text-2xl smLaptop:text-xl tablet:text-lg lgMobile:text-lg mdMobile:text-lg font-semibold mb-4 outline-none" type="text" placeholder="Name" spellCheck="false" required
                            value={name}
                            onChange={(ev) => setName(ev.target.value)}
                        />
                        <input type="email" className="bg-transparent text-2xl smLaptop:text-xl tablet:text-lg lgMobile:text-lg mdMobile:text-lg font-semibold mb-4 outline-none" placeholder="Email" spellCheck="false" required
                            value={email}
                            onChange={(ev) => setEmail(ev.target.value)}
                        />
                        <input className="bg-transparent text-2xl smLaptop:text-xl tablet:text-lg lgMobile:text-lg mdMobile:text-lg font-semibold mb-4 outline-none" type="password" placeholder="Password" spellCheck="false" required
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)}
                        />
                        <input className={`bg-transparent ${confirmPasswordBool ? 'text-green-400' : 'text-red-400'} text-2xl smLaptop:text-xl tablet:text-lg lgMobile:text-lg mdMobile:text-lg font-semibold mb-10 smLaptop:mb-6 outline-none`} type="password" placeholder="Confirm password" spellCheck="false" required
                            onChange={(ev) => {
                                if (ev.target.value === password) {
                                    setConfirmPasswordBool(true)
                                } else setConfirmPasswordBool(false)
                            }}
                        />
                        <button className="bg-[#FF7F11] py-2 rounded-lg text-lg lgMobile:text-[1rem] mdMobile:text-[1rem] font-semibold font-hind text-white" type="submit">Register</button>
                        <p className={`text-center xlMobile:text-xl xlMobile:mt-6 mt-2 ${darkMode ? 'text-black' : ''}`}>Already have an account? <Link to='/login' className="text-[#FF7F11] hover:underline">Login</Link></p>
                    </form>
                </div>
            </div>
            <div className="tablet:mt-24">
                <Footer />
            </div>
        </div>
    );
}

export default Register;