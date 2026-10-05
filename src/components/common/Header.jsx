import { FaPhoneAlt } from "react-icons/fa";
import logo from "../../assets/NeonSpark - White.png";
import velvetBg from "../../assets/red_velvet_bg.jpg";

const SERVICES = [
    "OUTDOOR-INDOOR PHOTOGRAPHY",
    "PROFESSIONAL PROTFOLIO",
    "PROFESSIONAL VIDEOGRAPHY",
    "INDUSTRIA DOCUMENTARY",
    "LIVE EVENT COVERAGE",
];

const Header = () => {
    return (
        <div className="w-full">
            {/* Red velvet banner */}
            <div
                className="relative flex items-start justify-between gap-2 px-6 pt-4 pb-4 min-h-37.5 bg-cover bg-center bg-no-repeat border-b border-black"
                style={{ backgroundImage: `url(${velvetBg})` }}
            >
                <div className="text-white z-10">
                    <p className="font-bold text-lg leading-tight">Amit Desai</p>
                    <p className="flex items-center gap-1.5 text-sm font-semibold mt-1">
                        <FaPhoneAlt className="text-[0.8em]" />
                        +91 99097 89109
                    </p>
                </div>

                <img
                    src={logo}
                    alt="NeonSpark Photography"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38%] max-w-75 h-auto object-contain z-10"
                />

                <div className="text-white text-right z-10">
                    <p className="font-bold text-lg leading-tight">Ajay Desai</p>
                    <p className="flex items-center justify-end gap-1.5 text-sm font-semibold mt-1">
                        <FaPhoneAlt className="text-[0.8em]" />
                        +91 90164 03282
                    </p>
                </div>
            </div>
            <div className="border mt-1 border-black"></div>

            {/* Services strip */}
            <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 bg-white border-b-2 border-black px-6 py-2.5 mt-1">
                {SERVICES.map((item) => (
                    <span
                        key={item}
                        className="inline-flex items-center gap-1.5 text-sm text-black whitespace-nowrap"
                    >
                        <span className="text-red-700 text-[20px]">◆</span>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Header;