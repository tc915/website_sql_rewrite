import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full h-[5rem] bg-black text-white font-semibold text-xl flex items-center p-6">
            <p className="">Copyright © 2024 Interactive Technologies Inc. All Rights Reserved.</p>
            <div className="ml-auto">
                <Link className="mr-6">Terms & Conditions</Link>
                <Link className="mr-6">Privacy Policy</Link>
                <Link className="mr-6">Sitemap</Link>
            </div>
        </footer>
    );
}

export default Footer;