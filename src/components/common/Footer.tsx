import { FaInstagramSquare } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import Logo from "./Logo";


const Footer = () => {
    return (
        <footer className="bg-secondary text-secondary-foreground py-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-10 md:gap-8 mb-12">
                    <div>
                        <Logo className="mb-4 text-secondary-foreground" />
                        <p className="text-secondary-foreground/60 font-light text-sm leading-relaxed text-left">
                            Fine art photography capturing life's most meaningful moments with
                            elegance and authenticity.
                        </p>
                    </div>
                    <div>
                        <p className="text-sm tracking-widest uppercase mb-4 text-left">Quick Links</p>
                        <div className="space-y-2 text-left">
                            {["Portfolio", "About", "Services", "Contact"].map((link) => (
                                <button
                                    key={link}
                                    onClick={() =>
                                        document
                                            .querySelector(`#${link.toLowerCase()}`)
                                            ?.scrollIntoView({ behavior: "smooth" })
                                    }
                                    className="block text-secondary-foreground/60 text-sm hover:text-secondary-foreground transition-colors"
                                >
                                    {link}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm tracking-widest uppercase mb-4 text-left">Follow Along</p>
                        <div className="flex gap-4">
                            <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors">
                                <FaInstagramSquare size={20} />
                            </a>
                            <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors">
                                <FaTwitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-secondary-foreground/10 pt-8 text-center">
                    <p className="text-secondary-foreground/40 text-xs tracking-wider">
                        © 2023 San Photography. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
