import { BiSolidDownArrow } from "react-icons/bi";

const TitleTag = ({ children }) => (
    <div className="w-fit min-w-65 max-w-full mx-auto pr-5 pb-4">
        <div className="relative">
            {/* offset shadow box*/}
            <div
                className="absolute inset-0 translate-x-5 translate-y-2 bg-gray-300"
                style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
            />

            {/* main box */}
            <div className="relative bg-white text-center border-2 border-black px-6 py-2.5">
                <p className="font-bold text-black text-sm sm:text-lg break-words">
                    {children}
                </p>

                {/* Arrow */}
                <div className="absolute -bottom-4 right-5 text-black text-xl">
                    <BiSolidDownArrow size={20} />
                </div>
            </div>
        </div>
    </div>
);

export default TitleTag;