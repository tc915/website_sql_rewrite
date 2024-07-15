import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full lgMobile:w-[25rem] mdMobile:w-[24rem] h-[5rem] lgMobile:h-[15rem] mdMobile:h-[15rem] bg-black text-white font-semibold text-xl lgMobile:text-[0.8rem] mdMobile:text-[0.8rem] flex lgMobile:flex-col mdMobile:flex-col items-center lgMobile:items-start mdMobile:items-start p-6">
            <p className="lgMobile:mb-2">Copyright © 2024 Interactive Technologies Inc. All Rights Reserved.</p>
            <div className="ml-auto lgMobile:ml-0 mdMobile:ml-0 lgMobile:flex mdMobile:flex lgMobile:flex-col mdMobile:flex-col">
                <Link className="mr-6 lgMobile:mb-2 mdMobile:mb-2">Terms & Conditions</Link>
                <Link className="mr-6 lgMobile:mb-2 mdMobile:mb-2">Privacy Policy</Link>
                <Link className="mr-6">Sitemap</Link>
            </div>
        </footer>
    );
}

export default Footer;