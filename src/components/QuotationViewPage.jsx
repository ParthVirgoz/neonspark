import { useRef, useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./common/Header";
import Footer from "./common/Footer";
import TitleTag from "./TitleTag";
import TermsConditions from "./TermsConditions";
import { IoArrowBackOutline } from "react-icons/io5";
import { PiPrinterFill } from "react-icons/pi";

const GRADIENT_BG = "linear-gradient(to top, #fee2e2, #fafafa)";

const FIT_GAP = 12;

const A4_WIDTH_PX = 793.7;

const makePage = () => ({
    hasIntro: false,
    hasOutputHeader: false,
    output: [],
    events: [],
    hasTotal: false,
    hasSvcHeader: false,
    svc: [],
    hasPayment: false,
});

const clonePage = (p) => ({
    ...p,
    output: [...p.output],
    events: [...p.events],
    svc: [...p.svc],
});

const isPageEmpty = (p) =>
    !(
        p.hasIntro ||
        p.hasOutputHeader ||
        p.output.length > 0 ||
        p.events.length > 0 ||
        p.hasTotal ||
        p.hasSvcHeader ||
        p.svc.length > 0 ||
        p.hasPayment
    );

const waitForImages = () =>
    Promise.all(
        Array.from(document.images).map((img) =>
            img.complete
                ? Promise.resolve()
                : new Promise((res) => {
                    img.addEventListener("load", res, { once: true });
                    img.addEventListener("error", res, { once: true });
                })
        )
    );

const PageShell = ({ header = true, gradient = true, children }) => (
    <div
        className="quotation-page isolate bg-white shadow-md print:shadow-none flex flex-col overflow-hidden"
        style={{ width: "210mm", height: "297mm", boxSizing: "border-box" }}
    >
        {header && <Header />}
        <div
            className={`flex-1 min-h-0 m-4 flex flex-col overflow-hidden ${gradient ? "rounded-3xl" : ""}`}
            style={gradient ? { background: GRADIENT_BG } : undefined}
        >
            <div className="flex-1 min-h-0 px-6 pb-2 flex flex-col overflow-hidden">{children}</div>
            <Footer />
        </div>
    </div>
);

// Screen par page ko chhote screen ke hisaab se scale karta hai.
// Print mein (CSS niche) scale hat jata hai, isliye print/PDF same rehta hai.
const ScaledPage = ({ scale, children }) => (
    <div
        className="scaled-page-wrap shrink-0"
        style={{ width: `calc(210mm * ${scale})`, height: `calc(297mm * ${scale})` }}
    >
        <div
            className="scaled-page-inner"
            style={{
                width: "210mm",
                height: "297mm",
                ...(scale < 1 ? { zoom: scale } : {}), // scale 1 par kuch mat lagao
            }}
        >
            {children}
        </div>
    </div>
);

const QuotationViewPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const data = state?.data;

    const [readyToPrint, setReadyToPrint] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [fileName, setFileName] = useState("");
    const [layout, setLayout] = useState(null);
    const [scale, setScale] = useState(1);

    const [probeSpec, setProbeSpec] = useState(null);
    const probeWrapRef = useRef(null);

    const outputItems = data
        ? [
            data.functionVideo && "FUNCTION VIDEO ALL CEREMONY",
            data.allRawFiles && "ALL RAW FILES",
            data.highlight && "HIGHLIGHT",
            data.editedPhotos && `EDITED PHOTOS ${data.editedPhotos}`,
            data.reels && `${data.reels} REELS`,
            ...(data.customServices || []).filter((s) => s && s.trim()),
        ]
            .filter(Boolean)
            .map((s) => s.toUpperCase())
        : [];

    const events = data?.events || [];
    const eventRows = [];
    for (let i = 0; i < events.length; i += 3) eventRows.push(events.slice(i, i + 3));

    const otherServices = (data?.otherServices || []).filter((s) => s && s.trim());

    // ---------- SCREEN SCALE (responsive) ----------
    useEffect(() => {
        const updateScale = () => {
            const availableWidth = document.documentElement.clientWidth - 16; // 8px side padding
            setScale(Math.min(1, availableWidth / A4_WIDTH_PX));
        };
        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    // ---------- PAGINATION (real DOM check) ----------
    useEffect(() => {
        if (!data) return;
        let cancelled = false;

        const fits = (spec) => {
            flushSync(() => setProbeSpec(spec));
            const wrap = probeWrapRef.current;
            if (!wrap) return true;
            const last = wrap.lastElementChild;
            if (!last) return true;
            return last.getBoundingClientRect().bottom + FIT_GAP <= wrap.getBoundingClientRect().bottom;
        };

        const packPages = () => {
            const pages = [];
            let cur = makePage();
            let outputHeaderPlaced = false;
            let svcHeaderPlaced = false;

            const place = (mutate) => {
                const trial = clonePage(cur);
                mutate(trial);
                if (isPageEmpty(cur) || fits(trial)) {
                    cur = trial;
                    return;
                }
                pages.push(cur);
                cur = makePage();
                mutate(cur);
            };

            // 1) Intro
            cur.hasIntro = true;

            // 2) Output items
            for (let idx = 0; idx < outputItems.length; idx++) {
                place((t) => {
                    if (!outputHeaderPlaced) t.hasOutputHeader = true;
                    t.output.push(idx);
                });
                outputHeaderPlaced = true;
            }

            // 3) Event rows
            for (let idx = 0; idx < eventRows.length; idx++) {
                place((t) => {
                    t.events.push(idx);
                });
            }

            // 4) Total
            place((t) => {
                t.hasTotal = true;
            });

            // 5) Other services
            if (otherServices.length === 0) {
                place((t) => {
                    t.hasSvcHeader = true;
                });
            } else {
                for (let idx = 0; idx < otherServices.length; idx++) {
                    place((t) => {
                        if (!svcHeaderPlaced) t.hasSvcHeader = true;
                        t.svc.push(idx);
                    });
                    svcHeaderPlaced = true;
                }
            }

            // 6) Payment table
            place((t) => {
                t.hasPayment = true;
            });

            pages.push(cur);
            return pages;
        };

        const run = async () => {
            if (document.fonts?.ready) await document.fonts.ready;

            if (document.fonts?.load) {
                await Promise.all(
                    ["400", "500", "600", "700", "800"].map((w) => document.fonts.load(`${w} 16px Poppins`))
                );
            }
            await waitForImages();
            await new Promise((r) => requestAnimationFrame(() => r()));
            if (cancelled) return;

            const pages = packPages();
            if (cancelled) return;

            setProbeSpec(null);
            setLayout({ contentPages: pages });
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [data]);

    useEffect(() => {
        if (layout) {
            const t = setTimeout(() => setReadyToPrint(true), 50);
            return () => clearTimeout(t);
        }
    }, [layout]);

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="mb-4 text-gray-600">No quotation data found. Please generate a quotation first.</p>
                <button
                    onClick={() => navigate("/")}
                    className="text-white px-6 py-3 rounded-xl font-semibold bg-RedVelvet"
                >
                    Go to Form
                </button>
            </div>
        );
    }

    const goBack = () => navigate("/", { state: { formData: data } });
    const openPopup = () => {
        const name = (data.clientName || "DRAFT").toUpperCase().replace(/[^A-Z0-9]+/g, "_");
        const date = (data.clientDateFormatted || "").replace(/\//g, "-"); // 25/09/2026 -> 25-09-2026

        setFileName(`${name}_${date}`);
        setShowPopup(true);
    };
    const handleSavePrint = () => {
        setShowPopup(false);
        const oldTitle = document.title;
        document.title = fileName || oldTitle;
        setTimeout(() => {
            window.print();
            document.title = oldTitle;
        }, 100);
    };

    const money = (n) => `₹${(n || 0).toLocaleString("en-IN")}/-`;

    const IntroFixed = () => (
        <>
            <div className="flex justify-center mb-8">
                <TitleTag>{(data.quotationType || "WEDDING").toUpperCase()} QUOTATION</TitleTag>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5 max-w-2xl mx-auto w-full mb-6 px-2">
                <p className="text-xl flex items-baseline gap-2">
                    <span className="font-bold text-gray-900 whitespace-nowrap">Name :</span>
                    <span className="text-RedVelvet font-bold border-b-2 border-black px-1 pb-1">
                        {(data.clientName || "").toUpperCase()}
                    </span>
                </p>
                <p className="text-xl flex items-baseline gap-2 justify-self-end">
                    <span className="font-bold text-gray-900 whitespace-nowrap">Date :</span>
                    <span className="text-RedVelvet font-bold border-b-2 border-black px-1 pb-1">
                        {data.clientDateFormatted}
                    </span>
                </p>
                <p className="text-xl flex items-baseline gap-2">
                    <span className="font-bold text-gray-900 whitespace-nowrap">Mo. :</span>
                    <span className="text-RedVelvet font-bold border-b-2 border-black px-1 pb-1">
                        {(data.clientMobile || "").toUpperCase()}
                    </span>
                </p>
            </div>
        </>
    );

    const OutputHeader = () => (
        <div className="flex justify-center mt-3 mb-6">
            <TitleTag>{data.quotationType || "Wedding"} Output</TitleTag>
        </div>
    );

    const OutputItem = ({ text }) => (
        <li className="flex items-start gap-2 text-md font-bold text-black mb-2">
            <span className="mt-1.5 w-1.5 h-1.5 bg-gray-800 rounded-full flex-shrink-0" />
            {text}
        </li>
    );

    const EventRow = ({ row }) => (
        <div className="grid grid-cols-3 gap-5 mb-5">
            {row.map((ev, i) => (
                <div key={i} className="border rounded-md border-b-4 border-RedVelvet shadow-lg p-4">
                    <div className="bg-white border-2 border-black px-3 py-1 mb-3">
                        <p className="text-md text-center font-bold">
                            Date : <span className="text-RedVelvet">{ev.dateFormatted}</span>
                        </p>
                    </div>
                    <div className="bg-white flex justify-center px-3 py-1.5 mb-3 w-full">
                        <p className="text-sm font-bold text-slate-800">PHOTO/VIDEO</p>
                    </div>
                    <p className="text-sm font-bold mb-1.5">Function :</p>
                    <ul className="space-y-1">
                        {ev.roles.map((r, ri) => (
                            <li key={ri} className="flex items-start tracking-wide gap-2 text-[11px] text-gray-800">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-gray-800 rounded-full flex-shrink-0" />
                                {r.toUpperCase()}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );

    const TotalBox = () => (
        <div className="flex justify-end mt-4">
            <div className="bg-white border-2 border-black rounded-sm px-4 py-2">
                <p className="font-bold text-base">
                    TOTAL : <span className="text-RedVelvet">{money(data.totalAmount)}</span>
                </p>
            </div>
        </div>
    );

    const IntroSvc = () => (
        <div className="flex justify-center mb-6">
            <TitleTag>Other Services</TitleTag>
        </div>
    );

    const SvcLabel = () => <p className="font-bold text-lg  mb-3">PHOTO/VIDEO :</p>;

    const SvcItem = ({ text }) => (
        <li className="flex items-start gap-2 text-[12px]  text-black mb-2">
            <span className="mt-1.5 w-1.5 h-1.5 tracking-wide bg-gray-800 rounded-full flex-shrink-0" />
            {text.toUpperCase()}
        </li>
    );

    const PaymentTable = () => (
        <div className="border-2 border-black rounded-sm overflow-hidden mb-2 shrink-0">
            <div className="border-b-2 border-black px-4 py-2.5">
                <p className="font-bold text-lg text-center">PAYMENT DETAILES</p>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b-2 border-black text-[16px]">
                        <th className="text-left px-4 py-1 font-semibold" />
                        <th className="text-left px-4 py-1 font-semibold border-l-2 border-black">Rs.</th>
                        <th className="text-left px-4 py-1 font-semibold border-l-2 border-black">DATE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-4 py-1 font-semibold text-lg">ADVANCE</td>
                        <td className="px-4 py-1 border-l-2 text-md border-black">{money(data.advanceAmount)}</td>
                        <td className="px-4 py-1 border-l-2 text-md border-black">{data.advanceDueDateFormatted}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-1 font-semibold text-lg">INSTALLMENT</td>
                        <td className="px-4 py-1 border-l-2 border-black">{money(data.installmentAmount)}</td>
                        <td className="px-4 py-1 border-l-2 border-black">{data.installmentDueDateFormatted}</td>
                    </tr>
                    <tr className="border-t-2 border-black">
                        <td className="px-4 py-3 font-bold text-lg">TOTAL</td>
                        <td colSpan={2} className="px-4 py-3 border-l-2 border-black font-bold text-xl text-RedVelvet">
                            {money(data.totalAmount)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    const renderPage = (p, wrapRef) => (
        <>
            {p.hasIntro && <IntroFixed />}
            <div ref={wrapRef} className="flex-1 min-h-0 flex flex-col">
                {/* Header */}
                {p.hasOutputHeader && <OutputHeader />}


                {p.output.length > 0 && (
                    <div className="border-b-4 border border-RedVelvet rounded-md shadow-lg pt-3 pl-9 mb-8">
                        <div className="grid grid-cols-2 text-[14px] gap-x-8">
                            <ul>
                                {p.output.slice(0, Math.ceil(p.output.length / 2)).map((idx) => (
                                    <OutputItem key={idx} text={outputItems[idx]} />
                                ))}
                            </ul>
                            <ul>
                                {p.output.slice(Math.ceil(p.output.length / 2)).map((idx) => (
                                    <OutputItem key={idx} text={outputItems[idx]} />
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* event */}

                {p.events.map((idx) => (
                    <EventRow key={idx} row={eventRows[idx]} />
                ))}

                {p.hasTotal && <TotalBox />}

                {p.hasSvcHeader && <IntroSvc />}

                {(p.svc.length > 0 || p.hasSvcHeader) && (
                    <div className="border rounded-md shadow-lg border-b-4 border-RedVelvet p-5 mb-6">
                        {p.hasSvcHeader && <SvcLabel />}
                        <ul>
                            {p.svc.map((idx) => (
                                <SvcItem key={idx} text={otherServices[idx]} />
                            ))}
                        </ul>
                    </div>
                )}

                {p.hasPayment && <PaymentTable />}
            </div>
        </>
    );

    return (
        <div className="bg-gray-100 min-h-screen print:bg-white">
            <style>{`
            @page { size: A4; margin: 0; }

            @media print {
            html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }

            /* Screen scale print mein hat jata hai: har page exact A4 */
            .scaled-page-wrap {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            break-after: page;
            page-break-after: always;
            }
            .scaled-page-wrap:last-of-type { break-after: auto; page-break-after: auto; }
            .scaled-page-inner { transform: none !important; zoom: 1 !important; }
            .quotation-page { margin: 0 !important; }
            }
            `}</style>

            {/* Top action bar */}
            <div className="no-print sticky top-0 bg-white border-b border-gray-200 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-3">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition"
                    >
                        <IoArrowBackOutline size={18} />
                        Back
                    </button>
                    <button
                        onClick={openPopup}
                        disabled={!readyToPrint}
                        className="flex items-center gap-2 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-5 rounded-lg hover:shadow-lg transition bg-gradient-to-r from-RedVelvet to-red-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <PiPrinterFill size={18} />
                        {readyToPrint ? "Print / Download" : "Preparing..."}
                    </button>
                </div>
            </div>

            <div className="py-4 sm:py-8 px-2 print:p-0 flex flex-col items-center gap-4 sm:gap-6 print:gap-0">
                {/* CONTENT PAGES */}
                {layout &&
                    layout.contentPages.map((p, pi) => (
                        <ScaledPage key={`c-${pi}`} scale={scale}>
                            <PageShell>{renderPage(p)}</PageShell>
                        </ScaledPage>
                    ))}

                {/* Terms & Conditions */}
                {layout && (
                    <ScaledPage scale={scale}>
                        <TermsConditions />
                    </ScaledPage>
                )}
            </div>

            {/* Hidden measurement probe (scale nahi hota, isliye pagination same rehta hai) */}
            <div
                className="no-print"
                style={{ position: "absolute", left: "-10000px", top: 0, visibility: "hidden", pointerEvents: "none" }}
            >
                <PageShell>{probeSpec && renderPage(probeSpec, probeWrapRef)}</PageShell>
            </div>

            {/* Save as popup */}
            {showPopup && (
                <div className="no-print fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] px-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-[350px] text-center">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Save Quotation As</h2>
                        <input
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-RedVelvet"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSavePrint}
                                className="px-4 py-2 rounded-md text-white font-semibold bg-RedVelvet"
                            >
                                Save & Print
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotationViewPage;