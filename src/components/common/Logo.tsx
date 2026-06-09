import React from "react";

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 md:w-10 md:h-10"
            >
                <path
                    d="M20 5L20 35"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <path
                    d="M10 15C10 15 15 10 20 10C25 10 30 15 30 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <path
                    d="M10 25C10 25 15 30 20 30C25 30 30 25 30 25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            </svg>
            <span className="font-display text-xl md:text-2xl font-light tracking-[0.2em] uppercase">
                San <span className="italic font-normal">Photography</span>
            </span>
        </div>
    );
};

export default Logo;
