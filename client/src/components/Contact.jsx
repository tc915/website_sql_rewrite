import { useEffect, useState } from 'react';
import TextAreaAutosize from 'react-textarea-autosize';
import Footer from '../partials/Footer';
import axios from 'axios';
import { motion } from 'framer-motion';

const fadeInVariants = {
    initial: {
        opacity: 0,
        transform: 'translateY(-5rem)'
    },
    animate: {
        opacity: 1,
        transform: 'translateY(0rem)',
        transition: {
            duration: 0.5
        }
    }
}

const buttonVariants = {
    hover: {
        transform: 'translateY(2px)',
        transition: {
            duration: 0.15
        }
    },
    click: {
        opacity: 0.5,
        transition: {
            duration: 0.1
        }
    }
}

const Contact = ({ inAboutPage, setAboutPageEmailSentPopup }) => {

    const [name, setName] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [emailSentPopup, setEmailSentPopup] = useState(false);

    const sendMessage = async () => {
        const reqData = { name, phoneNum, email, message }
        await axios.post('/send-email', reqData)
        if (inAboutPage) {
            setAboutPageEmailSentPopup(true);
        } else {
            setEmailSentPopup(true);
        }
        setName('');
        setPhoneNum('');
        setEmail('');
        setMessage('');
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (emailSentPopup && !inAboutPage) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [emailSentPopup]);


    return (
        <>
            <div className={`fixed top-0 left-0 w-full h-screen z-[99] bg-black/50 justify-center items-center ${emailSentPopup && !inAboutPage ? 'flex' : 'hidden'}`}>
                <div className='w-[20rem] h-[10rem] bg-[#131313] border-4 border-[#FF7F11] rounded-xl flex flex-col items-center justify-center'>
                    <p className='text-white font-semibold text-2xl'>Email Sent</p>
                    <button className='bg-white text-xl text-black px-6 py-2 rounded-lg mt-4 font-semibold'
                        onClick={() => setEmailSentPopup(false)}
                    >Ok</button>
                </div>
            </div>
            <motion.div className="pt-44 lgMobile:pt-[15rem]"
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >
                <img className="absolute -z-10 -translate-y-[15rem] lgMobile:-translate-y-[10rem] lgMobile:h-[50rem] object-cover" src="contact_background_unsplash.jpg" />
                <div className="h-[48rem] flex lgMobile:flex-col text-white">
                    <h2 className='lgMobile:mb-24 lgMobile:block hidden lgMobile:text-4xl lgMobile:font-semibold lgMobile:ml-6'>Contact Us</h2>
                    <form className="w-1/2 lgMobile:w-full p-44 lgMobile:p-6 -mt-16"
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            sendMessage();
                        }}
                    >
                        <div className="w-full">
                            <input type="text" required placeholder="Name" className="bg-transparent placeholder:text-white text-xl lgMobile:text-lg font-thin border-b-2 pb-2 lgMobile:pb-1 lgMobile:mb-8 mr-4 w-1/2 outline-none"
                                value={name}
                                onChange={(ev) => setName(ev.target.value)}
                            />
                            <input type='text' placeholder="Phone (not required)" className="bg-transparent placeholder:text-white text-xl lgMobile:text-lg font-thin border-b-2 pb-2 lgMobile:pb-1 outline-none"
                                value={phoneNum}
                                onChange={(ev) => setPhoneNum(ev.target.value)}
                            />
                        </div>
                        <div>
                            <input type="email" required placeholder="Email" className="bg-transparent placeholder:text-white text-xl font-thin border-b-2 pb-2 outline-none w-[97%] mt-6"
                                value={email}
                                onChange={(ev) => setEmail(ev.target.value)}
                            />
                        </div>
                        <div className='h-[10rem] mt-6 w-[97%] overflow-y-auto overflow-x-hidden border-b-2'>
                            <TextAreaAutosize required className='bg-transparent resize-none placeholder:text-white font-thin text-xl  outline-none w-full h-full' placeholder='Message'
                                value={message}
                                onChange={(ev) => setMessage(ev.target.value)}
                            />
                        </div>
                        <motion.button type='submit' className='mt-10 bg-[#FF7F11] px-16 py-2 rounded-full text-xl font-semibold'
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="click"
                        >Send</motion.button>
                    </form>
                    <div className="text-8xl flex justify-center items-center -mt-44 lgMobile:hidden">
                        <p className="w-2/3">Let's Work Together!</p>
                    </div>
                </div>
                <div className='lgMobile:-mt-32'>
                    <Footer />
                </div>
            </motion.div>
        </>
    );
}

export default Contact;