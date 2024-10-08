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
                <div className='w-[20rem] h-[10rem] bg-[#131313] border-4 border-[#FF7F11] rounded-xl flex flex-col items-center justify-center font-hind'>
                    <p className='text-white font-semibold text-2xl'>Email Sent</p>
                    <button className='bg-white text-xl text-black px-6 py-2 rounded-lg mt-4 font-semibold'
                        onClick={() => setEmailSentPopup(false)}
                    >Ok</button>
                </div>
            </div>
            <motion.div className="pt-44 w-full xl:pt-[8rem] lg:pt-[8rem] md:pt-[8rem] sm:pt-[8rem] xsm:pt-[8rem] xxsm:pt-[8rem] laptop:pt-[8rem] smLaptop:pt-[8rem] font-shanti tablet:pt-20 xlMobile:pt-[17rem] xlMobile:w-[33rem] lgMobile:pt-[15rem] mdMobile:pt-[15rem]"
                variants={fadeInVariants}
                initial="initial"
                animate="animate"
            >
                <img className="absolute -z-10 -translate-y-[15rem] xl:translate-y-0 lg:translate-y-0 md:translate-y-0 sm:translate-y-0 xsm:translate-y-0 xxsm:translate-y-0 laptop:translate-y-0 smLaptop:translate-y-0 tablet:-translate-y-[15rem] xlMobile:-translate-y-[5rem] lgMobile:-translate-y-[10rem] mdMobile:-translate-y-[10rem] tablet:h-[50rem] xlMobile:h-[50rem] lgMobile:h-[50rem] mdMobile:h-[50rem] object-cover" src="contact_background_unsplash.jpg" />
                <div className="h-[48rem] md:h-[47.5rem] sm:h-[43.9rem] xsm:h-[41.8rem] xxsm:h-[39rem] laptop:h-[36rem] smLaptop:h-[33rem] tablet:h-[35rem] flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col text-white">
                    <h2 className='xlMobile:mb-24 lgMobile:mb-24 mdMobile:mb-24 xlMobile:block lgMobile:block mdMobile:block hidden xlMobile:text-5xl lgMobile:text-4xl mdMobile:text-4xl xlMobile:font-semibold lgMobile:font-semibold mdMobile:font-semibold xlMobile:ml-12 lgMobile:ml-6 mdMobile:ml-6 font-hind'>Contact Us</h2>
                    <form className="w-1/2 xl:-mt-4 lg:-mt-4 xlMobile:w-full lgMobile:w-full mdMobile:w-full p-44 xl:pr-0 lg:pr-0 md:pr-0 sm:pr-0 xsm:p-40 xsm:pr-0 xxsm:p-36 xxsm:pr-0 laptop:p-28 smLaptop:p-32 laptop:pr-0 smLaptop:pr-0 tablet:p-12 tablet:pt-32 xlMobile:p-12 lgMobile:p-6 mdMobile:p-6 -mt-16"
                        onSubmit={(ev) => {
                            ev.preventDefault();
                            sendMessage();
                        }}
                    >
                        <div className="w-full">
                            <input type="text" required placeholder="Name" className="bg-transparent placeholder:text-white text-xl tablet:text-[1rem] xlMobile:text-2xl lgMobile:text-lg mdMobile:text-lg font-thin border-b-2 pb-2 xlMobile:pb-1 lgMobile:pb-1 mdMobile:pb-1 md:mb-6 sm:mb-6 xsm:mb-4 xxsm:mb-4 laptop:mb-4 smLaptop:mb-4 tablet:mb-6 xlMobile:mb-8 lgMobile:mb-8 mdMobile:mb-8 mr-4 w-1/2 outline-none"
                                value={name}
                                onChange={(ev) => setName(ev.target.value)}
                            />
                            <input type='text' placeholder="Phone (not required)" className="bg-transparent placeholder:text-white text-xl tablet:text-[1rem] xlMobile:text-2xl lgMobile:text-lg mdMobile:text-lg font-thin border-b-2 pb-2 xlMobile:pb-1 lgMobile:pb-1 mdMobile:pb-1 xlMobile:mb-4 outline-none"
                                value={phoneNum}
                                onChange={(ev) => setPhoneNum(ev.target.value)}
                            />
                        </div>
                        <div>
                            <input type="email" required placeholder="Email" className="bg-transparent placeholder:text-white text-xl tablet:text-[1rem] xlMobile:text-2xl font-thin border-b-2 pb-2 xlMobile:mb-4 outline-none w-[97%] mt-6"
                                value={email}
                                onChange={(ev) => setEmail(ev.target.value)}
                            />
                        </div>
                        <div className='h-[10rem] md:h-[9rem] sm:h-[9rem] xsm:h-[8.5rem] xxsm:h-[8rem] laptop:h-[8rem] smLaptop:h-[7rem] tablet:h-[5rem] mt-6 w-[97%] overflow-y-auto overflow-x-hidden border-b-2'>
                            <TextAreaAutosize required className='bg-transparent resize-none placeholder:text-white font-thin text-xl tablet:text-[1rem] xlMobile:text-2xl outline-none w-full h-full' placeholder='Message'
                                value={message}
                                onChange={(ev) => setMessage(ev.target.value)}
                            />
                        </div>
                        <motion.button type='submit' className='font-hind mt-10 bg-[#FF7F11] px-16 tablet:px-10 py-2 rounded-full text-xl tablet:text-[1rem] xlMobile:text-3xl xlMobile:mt-12 font-semibold'
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="click"
                        >Send</motion.button>
                    </form>
                    <div className="xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-1/2 xsm:w-1/2 xxsm:w-1/2 laptop:w-1/2 smLaptop:w-1/2 text-8xl md:text-[5.5rem] sm:text-7xl xsm:text-7xl xxsm:text-7xl laptop:text-6xl smLaptop:text-6xl tablet:text-6xl flex justify-center items-center -mt-44 smLaptop:-mt-32 tablet:-mt-[8rem] xlMobile:hidden lgMobile:hidden mdMobile:hidden">
                        <p className="w-2/3 font-ruda font-[700]">Let's Work Together!</p>
                    </div>
                </div>
                <div className='xl:mt-[4.25rem] xlMobile:-mt-14 lgMobile:-mt-32 mdMobile:-mt-32'>
                    <Footer />
                </div>
            </motion.div>
        </>
    );
}

export default Contact;