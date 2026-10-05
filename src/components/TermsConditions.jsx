import { FaLocationDot } from "react-icons/fa6";
import { PiDiamondFill } from "react-icons/pi";

const InstagramIcon = ({ size = 18 }) => (
    <span
        className="inline-flex items-center justify-center flex-shrink-0"
        style={{ width: size + 6, height: size + 6 }}
    >
        <svg
            width={size}
            height={size}
            viewBox="-1 -1 26 26"
            fill="none"
            overflow="visible"
            style={{ overflow: "visible" }}
        >
            <defs>
                <radialGradient
                    id="instaGradientTerms"
                    gradientUnits="userSpaceOnUse"
                    cx="7.2"
                    cy="25.7"
                    r="36"
                >
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="5%" stopColor="#fdf497" />
                    <stop offset="45%" stopColor="#fd5949" />
                    <stop offset="60%" stopColor="#d6249f" />
                    <stop offset="90%" stopColor="#285AEB" />
                </radialGradient>
            </defs>
            <path
                fill="url(#instaGradientTerms)"
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            />
        </svg>
    </span>
);

const Section = ({ title, children }) => (
    <div>
        <h3 className="text-[13px] font-bold mb-0.5 flex items-center gap-1">
            <span className="text-red-700 mr-1">
                <PiDiamondFill />
            </span>
            {title}
        </h3>
        <p className="px-6 text-[11.5px] leading-snug text-justify">{children}</p>
    </div>
);

const B = ({ children }) => <span className="font-bold">{children}</span>;

const TermsConditions = () => {
    return (
        <div
            className="quotation-page bg-white shadow-md print:shadow-none flex flex-col overflow-hidden text-black"
            style={{ width: "210mm", height: "297mm", boxSizing: "border-box" }}
        >
            {/* Main content */}
            <div className="flex-grow px-8 pt-8">
                {/* Heading */}
                <div className="flex items-center mb-4">
                    <span className="w-5 h-[2px] bg-red-700 flex-shrink-0" />
                    <span className="w-3 h-3 bg-red-700 rounded-full flex-shrink-0" />
                    <h2 className="text-xl font-bold ml-3 tracking-wide">TERMS &amp; CONDITIONS</h2>
                </div>

                <div className="space-y-2.5 pl-2">
                    <Section title="BOOKING & PAYMENT">
                        Booking will be confirmed only after receipt of <B>50% advance payment.</B> We follow a{" "}
                        <B>First Come, First Serve</B> booking policy. The remaining balance must be cleared on or
                        before final delivery unless otherwise agreed in writing.
                    </Section>

                    <Section title="CANCELLATION & RESCHEDULING">
                        Advance payment is <B>non-refundable,</B> as the date is reserved exclusively for the
                        client. Date changes will be subject to NeonSpark's availability. Any additional expenses
                        due to rescheduling will be charged separately.
                    </Section>

                    <Section title="TRAVEL & ACCOMMODATION">
                        For outstation events, <B>travel, accommodation and applicable expenses</B> will be borne
                        by the client unless included in the package. Suitable and safe accommodation should be
                        provided for overnight assignments.
                    </Section>

                    <Section title="EVENT COVERAGE">
                        Coverage will be provided as per the selected package and agreed schedule. Any{" "}
                        <B>additional hours, locations, photographers, cinematographers or services</B> will be
                        charged separately.
                    </Section>

                    <Section title="DELIVERABLES">
                        Final edited photographs and videos will be delivered in digital format through{" "}
                        <B>Google Drive / Online Gallery / Hard Drive</B> as mutually agreed. Delivery timelines
                        may vary depending on the assignment. Album delivery will begin after receiving the
                        client's final image selection.
                    </Section>

                    <Section title="CLIENT APPROVAL">
                        The client must provide image selections, feedback and approvals within the agreed
                        timeline. Delays in selection or approval may result in a corresponding delay in final
                        delivery. Major changes after approval may attract additional charges.
                    </Section>

                    <Section title="EXTRA SERVICES">
                        Any service not mentioned in the selected package will be charged separately, including{" "}
                        <B>
                            extra hours, additional reels, drone coverage, express delivery, additional albums,
                            prints, travel and special editing requirements.
                        </B>
                    </Section>

                    <Section title="CREATIVE & COPYRIGHT">
                        Photography and cinematography will follow the{" "}
                        <B>creative style of NeonSpark Photography & Productions.</B> NeonSpark reserves the right
                        to use selected images/videos for portfolio, website and promotional purposes unless
                        confidentiality is requested in writing before the assignment.
                    </Section>

                    <Section title="DATA & RESPONSIBILITY">
                        NeonSpark takes reasonable care of client data; however, clients are advised to maintain
                        their own backup of delivered files. NeonSpark will not be responsible for missed moments
                        caused by venue restrictions, limited access, security rules or events occurring
                        simultaneously at different locations.
                    </Section>

                    <Section title="FORCE MAJEURE">
                        NeonSpark will not be responsible for delays or non-performance caused by circumstances
                        beyond reasonable control, including{" "}
                        <B>
                            natural disasters, severe weather, accidents, government restrictions, technical
                            failures or other unforeseen circumstances.
                        </B>
                    </Section>

                    {/* Agreement */}
                    <p className="font-semibold text-[12px] pt-1 px-6">
                        I HAVE READ, UNDERSTOOD AND HEREBY AGREE TO THE TERMS OF THIS AGREEMENT.
                    </p>
                </div>
            </div>

            {/* Bottom: signature + instagram + address */}
            <div className="pb-3">
                {/* Signature */}
                <div className="w-full flex justify-end pr-10 mb-3">
                    <div className="w-1/3 flex flex-col items-end">
                        <div className="h-18 w-full border border-black" />
                        <div className="border border-black px-4 py-1 text-center text-sm font-semibold w-full">
                            CLIENT'S SIGNATURES
                        </div>
                    </div>
                </div>

                {/* Instagram */}
                <div className="flex justify-end items-center gap-2 pr-10 pt-2 pb-3">
                    <InstagramIcon size={17} />
                    <span className="text-md font-bold text-gray-800">@neonspark.photography</span>
                </div>

                <div className="w-[92%] mx-auto rounded-2xl border-t-4 border-black" />

                {/* Address */}
                <div className="flex justify-center items-center gap-2 pt-2 text-base font-semibold text-center">
                    <FaLocationDot className="text-red-700" size={16} />
                    <p>217, Silverstone arcade, Singapore Road, Surat.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;