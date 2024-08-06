import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full xlMobile:w-[32.5rem] lgMobile:w-full mdMobile:w-full h-[5rem] xlMobile:h-[15rem] lgMobile:h-[15rem] mdMobile:h-[15rem] bg-black text-white font-semibold text-xl xxsm:text-[1.15rem] laptop:text-[1.05rem] smLaptop:text-[1rem] tablet:text-sm lgMobile:text-[0.8rem] mdMobile:text-[0.8rem] flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col items-center xlMobile:items-start lgMobile:items-start mdMobile:items-start p-6 font-hind">
            <p className="xlMobile:mb-4 lgMobile:mb-2">Copyright © 2024 Interactive Technologies Inc. All Rights Reserved.</p>
            <div className="ml-auto xlMobile:ml-0 lgMobile:ml-0 mdMobile:ml-0 xlMobile:flex lgMobile:flex mdMobile:flex xlMobile:flex-col lgMobile:flex-col mdMobile:flex-col">
                <Link className="mr-6 xlMobile:mb-4 lgMobile:mb-2 mdMobile:mb-2">Terms & Conditions</Link>
                <Link className="mr-6 xlMobile:mb-4 lgMobile:mb-2 mdMobile:mb-2">Privacy Policy</Link>
                <Link className="mr-6">Sitemap</Link>
            </div>
        </footer>
    );
}

export default Footer;