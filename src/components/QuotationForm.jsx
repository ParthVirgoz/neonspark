import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaCamera, FaTrashAlt, FaPlus } from "react-icons/fa";
import { MdEventNote, MdNotificationsActive } from "react-icons/md";
import { BsCurrencyRupee } from "react-icons/bs";
import { IoCloseCircle, IoClose } from "react-icons/io5";
import { HiDocumentDownload } from "react-icons/hi";
import { RiResetRightFill } from "react-icons/ri";
import logo from "../assets/NeonSpark - White.png";
import velvetBg from "../assets/red_velvet_bg.jpg";


//set Current date
const getToday = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const DEFAULT_ROLES = [
    "1 TRADITIONAL PHOTOGRAPHER",
    "1 TRADITIONAL CINEMATOGRAPHER",
    "1 CANDID PHOTOGRAPHER",
    "1 CANDID CINEMATOGRAPHER",
];

const NEW_EVENT_ROLES = [
    "1 TRADITIONAL PHOTOGRAPHER",
    "1 TRADITIONAL CINEMATOGRAPHER",
];

// Common classes 
const inputCls =
    "w-full px-3.5 py-3 text-md border-2 border-gray-300 rounded-lg outline-none bg-white text-gray-800 transition-all duration-200 hover:border-RedVelvet hover:shadow-[0_0_0_4px] hover:shadow-RedVelvet/15 focus:border-RedVelvet focus:shadow-[0_0_0_4px] focus:shadow-RedVelvet/20";
const smallInputCls =
    "w-full px-3.5 py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg outline-none bg-white text-gray-800 transition-all duration-200 hover:border-RedVelvet hover:shadow-[0_0_0_4px] hover:shadow-RedVelvet/15 focus:border-RedVelvet focus:shadow-[0_0_0_4px] focus:shadow-RedVelvet/20";
const labelCls = "block text-sm font-semibold text-gray-600 mb-1.5";
const iconBadgeCls =
    "w-10 h-10 rounded-full bg-red-50 text-RedVelvet flex items-center justify-center flex-shrink-0";
const deleteBtnCls =
    "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-RedVelvet transition-colors";
const addBtnCls = "flex items-center gap-1.5 text-sm font-semibold text-RedVelvet hover:opacity-80 transition";
const cardCls = "bg-white border border-gray-200 rounded-2xl shadow-md";

const FormHeader = () => {
    return (
        <div
            className="w-full relative flex items-center justify-center min-h-[110px] sm:min-h-[150px] md:min-h-[140px] bg-cover bg-center bg-no-repeat border-b-[1px] border-black"
            style={{ backgroundImage: `url(${velvetBg})` }}
        >
            <img
                src={logo}
                alt="NeonSpark Photography"
                className="w-[55%] max-w-[180px] sm:max-w-[280px] md:max-w-[300px] h-auto object-contain"
            />
        </div>
    );
};

const QuotationForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMsg, setErrorMsg] = useState("");
    useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(""), 3000); 
    return () => clearTimeout(timer);
}, [errorMsg]);

    const existingData = location.state?.formData;

    const [quotationType, setQuotationType] = useState(existingData?.quotationType || "Wedding");

    const [clientName, setClientName] = useState(existingData?.clientName || "");
    const [clientDate, setClientDate] = useState(existingData?.clientDate || getToday());
    const [clientMobile, setClientMobile] = useState(existingData?.clientMobile || "");

    const [functionVideo, setFunctionVideo] = useState(existingData?.functionVideo || false);
    const [allRawFiles, setAllRawFiles] = useState(existingData?.allRawFiles || false);
    const [highlight, setHighlight] = useState(existingData?.highlight || false);
    const [editedPhotos, setEditedPhotos] = useState(existingData?.editedPhotos || "");
    const [reels, setReels] = useState(existingData?.reels || "");

    // ---- Events ----
    const [events, setEvents] = useState(
        existingData?.events || [{ date: "", roles: [...DEFAULT_ROLES] }]
    );

    const addEventBox = () => {
        setEvents((prev) => [...prev, { date: "", roles: [...NEW_EVENT_ROLES] }]);
    };

    const removeEventBox = (eventIndex) => {
        setEvents((prev) => prev.filter((_, i) => i !== eventIndex));
    };

    const handleEventDateChange = (eventIndex, value) => {
        setEvents((prev) =>
            prev.map((ev, i) => (i === eventIndex ? { ...ev, date: value } : ev))
        );
    };

    const handleRoleChange = (eventIndex, roleIndex, value) => {
        setEvents((prev) =>
            prev.map((ev, i) =>
                i === eventIndex
                    ? { ...ev, roles: ev.roles.map((r, ri) => (ri === roleIndex ? value : r)) }
                    : ev
            )
        );
    };

    const addRoleToEvent = (eventIndex) => {
        setEvents((prev) =>
            prev.map((ev, i) => (i === eventIndex ? { ...ev, roles: [...ev.roles, ""] } : ev))
        );
    };

    const removeRoleFromEvent = (eventIndex, roleIndex) => {
        setEvents((prev) =>
            prev.map((ev, i) =>
                i === eventIndex ? { ...ev, roles: ev.roles.filter((_, ri) => ri !== roleIndex) } : ev
            )
        );
    };

    // ---- Custom services (Delivery & Services) ----
    const [customServices, setCustomServices] = useState(existingData?.customServices || []);

    const handleCustomServiceChange = (index, value) => {
        setCustomServices((prev) => prev.map((s, i) => (i === index ? value : s)));
    };
    const addCustomService = () => setCustomServices((prev) => [...prev, ""]);
    const removeCustomService = (index) =>
        setCustomServices((prev) => prev.filter((_, i) => i !== index));

    // ---- Other services ----
    const [otherServices, setOtherServices] = useState(existingData?.otherServices || [""]);

    const handleServiceChange = (index, value) => {
        setOtherServices((prev) => prev.map((s, i) => (i === index ? value : s)));
    };
    const addService = () => setOtherServices((prev) => [...prev, ""]);
    const removeService = (index) => setOtherServices((prev) => prev.filter((_, i) => i !== index));

    // ---- Payment ----
    const [advanceAmount, setAdvanceAmount] = useState(existingData?.advanceAmount || "");
    const [advanceDueDate, setAdvanceDueDate] = useState(existingData?.advanceDueDate || getToday());
    const [installmentAmount, setInstallmentAmount] = useState(existingData?.installmentAmount || "");
    const [installmentDueDate, setInstallmentDueDate] = useState(existingData?.installmentDueDate || "");

    const totalAmount = (parseFloat(advanceAmount) || 0) + (parseFloat(installmentAmount) || 0);

    const formatDate = (d) => {
        if (!d) return "—";
        const [y, m, day] = d.split("-");
        return `${day}/${m}/${y}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!quotationType.trim()) return setErrorMsg("Please enter quotation type.");
        if (!clientName.trim()) return setErrorMsg("Client name is required.");
        if (!clientDate) return setErrorMsg("Client date is required.");
        if (!clientMobile.trim() || clientMobile.length < 10)
            return setErrorMsg("Please enter a valid mobile number.");
        if (!functionVideo && !allRawFiles && !highlight)
            return setErrorMsg("Please select at least one delivery service.");
        if (!editedPhotos) return setErrorMsg("Please enter number of edited photos.");
        if (!reels) return setErrorMsg("Please enter number of reels.");

        if (events.length === 0) return setErrorMsg("Please add at least one event.");
        for (let ev of events) {
            if (!ev.date) return setErrorMsg("Please select date for all events.");
            for (let r of ev.roles) {
                if (!r.trim()) return setErrorMsg("Please fill all event roles or remove empty ones.");
            }
        }

        for (let s of otherServices) {
            if (!s.trim()) return setErrorMsg("Please fill all other services or remove empty ones.");
        }
        if (!advanceAmount || parseFloat(advanceAmount) <= 0)
            return setErrorMsg("Please enter a valid advance payment amount.");
        if (!advanceDueDate) return setErrorMsg("Please select advance payment due date.");
        if (!installmentDueDate) return setErrorMsg("Please select installment due date.");

        const data = {
            quotationType,
            clientName,
            clientDate,
            clientDateFormatted: formatDate(clientDate),
            clientMobile,
            functionVideo,
            allRawFiles,
            highlight,
            editedPhotos,
            reels,
            customServices,
            events: events.map((ev) => ({
                date: ev.date,
                dateFormatted: formatDate(ev.date),
                roles: ev.roles,
            })),
            otherServices,
            advanceAmount: parseFloat(advanceAmount),
            advanceDueDate,
            advanceDueDateFormatted: formatDate(advanceDueDate),
            installmentAmount: parseFloat(installmentAmount) || 0,
            installmentDueDate,
            installmentDueDateFormatted: formatDate(installmentDueDate),
            totalAmount,
        };

        navigate("/quotation-preview", { state: { data } });
    };

    const resetForm = () => {
        setQuotationType("Wedding");
        setClientName("");
        setClientDate(getToday());
        setClientMobile("");
        setFunctionVideo(false);
        setAllRawFiles(false);
        setHighlight(false);
        setEditedPhotos("");
        setReels("");
        setCustomServices([]);
        setEvents([{ date: "", roles: [...DEFAULT_ROLES] }]);
        setOtherServices([""]);
        setAdvanceAmount("");
        setAdvanceDueDate(getToday());
        setInstallmentAmount("");
        setInstallmentDueDate("");
        setErrorMsg("");
    };

    return (
        <>
            <FormHeader />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Title */}
                <div className="text-center mb-7">
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
                        <span className="bg-gradient-to-r from-RedVelvet via-red-700 to-red-500 bg-clip-text text-transparent">
                            NeonSpark
                        </span>{" "}
                        Quotation Builder
                    </h1>
                    <p className="text-gray-600 text-md mt-1.5">
                        Create professional Event photography quotations with ease
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Quotation Type */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quotation Type</label>
                        <input
                            type="text"
                            value={quotationType}
                            onChange={(e) => setQuotationType(e.target.value)}
                            className={`${inputCls} max-w-[580px] text-sm`}
                        />
                    </div>

                    {/* Client Details + Delivery & Services */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        {/* Client Details */}
                        <div className={`${cardCls} flex flex-col`}>
                            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
                                <span className={iconBadgeCls}>
                                    <FaUser size={16} />
                                </span>
                                <h2 className="font-semibold text-gray-800 text-lg sm:text-xl">Client Details</h2>
                            </div>
                            <div className="p-5 space-y-4 flex-1">
                                <div>
                                    <label className={labelCls}>Name</label>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Date</label>
                                    <input
                                        type="date"
                                        value={clientDate}
                                        onChange={(e) => setClientDate(e.target.value)}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        className={inputCls}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Mobile</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={clientMobile}
                                        onChange={(e) => setClientMobile(e.target.value.replace(/\D/g, ""))}
                                        className={inputCls}
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery & Services */}
                        <div className={`${cardCls} flex flex-col`}>
                            <div className="flex items-center justify-between gap-2.5 px-5 py-4 border-b border-gray-100">
                                <div className="flex items-center gap-2.5">
                                    <span className={iconBadgeCls}>
                                        <FaCamera size={16} />
                                    </span>
                                    <h2 className="font-semibold text-gray-800 text-lg sm:text-xl">Delivery & Services</h2>
                                </div>
                                <button type="button" onClick={addCustomService} className={addBtnCls}>
                                    <FaPlus size={11} /> Add
                                </button>
                            </div>

                            <div className="p-5 flex-1">
                                {/* Checkboxes grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                    <label className="flex items-center gap-2.5 text-sm sm:text-base text-gray-800 bg-gray-50 rounded-lg px-4 py-3.5 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={functionVideo}
                                            onChange={(e) => setFunctionVideo(e.target.checked)}
                                            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                                        />
                                        Function Video
                                    </label>
                                    <label className="flex items-center gap-2.5 text-sm sm:text-base text-gray-800 bg-gray-50 rounded-lg px-4 py-3.5 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={allRawFiles}
                                            onChange={(e) => setAllRawFiles(e.target.checked)}
                                            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                                        />
                                        All Raw Files
                                    </label>
                                    <label className="flex items-center gap-2.5 text-sm sm:text-base text-gray-800 bg-gray-50 rounded-lg px-4 py-3.5 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={highlight}
                                            onChange={(e) => setHighlight(e.target.checked)}
                                            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                                        />
                                        Highlight
                                    </label>
                                </div>

                                {/* Edited Photos / Reels grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                    <div className="bg-gray-50 rounded-lg p-3.5">
                                        <label className="block text-sm text-gray-600 mb-2">Edited Photos</label>
                                        <input
                                            type="number"
                                            value={editedPhotos}
                                            onChange={(e) => setEditedPhotos(e.target.value)}
                                            onWheel={(e) => e.target.blur()}
                                            className={smallInputCls}
                                            min="0"
                                        />
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3.5">
                                        <label className="block text-sm text-gray-600 mb-2">Reels</label>
                                        <input
                                            type="number"
                                            value={reels}
                                            onChange={(e) => setReels(e.target.value)}
                                            onWheel={(e) => e.target.blur()}
                                            className={smallInputCls}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {/* Custom Service Output rows */}
                                {customServices.map((service, index) => (
                                    <div key={index} className="relative mb-3">
                                        <input
                                            type="text"
                                            value={service}
                                            onChange={(e) => handleCustomServiceChange(index, e.target.value)}
                                            placeholder="Custom Service Output"
                                            className={`${smallInputCls} pl-4 pr-11 py-3 placeholder-gray-400`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeCustomService(index)}
                                            className={deleteBtnCls}
                                        >
                                            <FaTrashAlt size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Event Schedule */}
                    <div className={`${cardCls} mb-5`}>
                        <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <span className={iconBadgeCls}>
                                    <MdEventNote size={16} />
                                </span>
                                <h2 className="font-semibold text-gray-800 text-lg sm:text-xl">Event Schedule</h2>
                            </div>
                            <button type="button" onClick={addEventBox} className={addBtnCls}>
                                <FaPlus size={11} /> Add New Event
                            </button>
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {events.map((ev, eventIndex) => (
                                <div key={eventIndex} className="border border-gray-200 rounded-xl p-4">
                                    {/* Date row */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <label className="text-sm sm:text-base font-semibold text-gray-800 whitespace-nowrap">
                                            Select Event Date :
                                        </label>
                                        <input
                                            type="date"
                                            value={ev.date}
                                            onChange={(e) => handleEventDateChange(eventIndex, e.target.value)}
                                            onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                            className="flex-1 px-3 py-2.5 text-sm sm:text-md font-semibold text-RedVelvet border border-gray-300 rounded-lg outline-none focus:border-RedVelvet focus:ring-2 focus:ring-RedVelvet/10"
                                        />
                                        {events.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeEventBox(eventIndex)}
                                                className="text-gray-400 hover:text-RedVelvet transition-colors flex-shrink-0"
                                            >
                                                <FaTrashAlt size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Roles list */}
                                    {ev.roles.map((role, roleIndex) => (
                                        <div key={roleIndex} className="relative mb-2.5">
                                            <input
                                                type="text"
                                                value={role}
                                                onChange={(e) => handleRoleChange(eventIndex, roleIndex, e.target.value)}
                                                className={`${inputCls} pr-11`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeRoleFromEvent(eventIndex, roleIndex)}
                                                className={deleteBtnCls}
                                            >
                                                <FaTrashAlt size={18} />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => addRoleToEvent(eventIndex)}
                                        className={`${addBtnCls} mt-1`}
                                    >
                                        <FaPlus size={11} /> Add Event
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Other Services */}
                    <div className={`${cardCls} mb-5`}>
                        <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <span className={iconBadgeCls}>
                                    <MdNotificationsActive size={16} />
                                </span>
                                <h2 className="font-semibold text-gray-800 text-lg sm:text-xl">Other Services</h2>
                            </div>
                            <button type="button" onClick={addService} className={addBtnCls}>
                                <FaPlus size={11} /> Add Service
                            </button>
                        </div>
                        <div className="p-5">
                            {otherServices.map((service, index) => (
                                <div key={index} className="relative mb-2.5">
                                    <input
                                        type="text"
                                        value={service}
                                        onChange={(e) => handleServiceChange(index, e.target.value)}
                                        className={`${inputCls} pr-11`}
                                        placeholder="Enter service name"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeService(index)}
                                        className={deleteBtnCls}
                                    >
                                        <FaTrashAlt size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className={`${cardCls} mb-6`}>
                        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
                            <span className={iconBadgeCls}>
                                <BsCurrencyRupee size={16} />
                            </span>
                            <h2 className="font-semibold text-gray-800 text-lg sm:text-xl">Payment Details</h2>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="font-semibold text-md text-gray-800 mb-2.5">Advance Payment</p>
                                    <label className={labelCls}>Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={advanceAmount}
                                        onChange={(e) => setAdvanceAmount(e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                        className={inputCls}
                                        min="0"
                                    />
                                    <label className={`${labelCls} mt-3`}>Due Date</label>
                                    <input
                                        type="date"
                                        value={advanceDueDate}
                                        onChange={(e) => setAdvanceDueDate(e.target.value)}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        className={inputCls}
                                    />
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="font-semibold text-md text-gray-800 mb-2.5">Installment</p>
                                    <label className={labelCls}>Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={installmentAmount}
                                        onChange={(e) => setInstallmentAmount(e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                        className={inputCls}
                                        min="0"
                                    />
                                    <label className={`${labelCls} mt-3`}>Due Date</label>
                                    <input
                                        type="date"
                                        value={installmentDueDate}
                                        onChange={(e) => setInstallmentDueDate(e.target.value)}
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            <div className="flex w-full sm:max-w-[580px] justify-between items-center bg-white border border-gray-200 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 mt-4">
                                <span className="font-bold text-md text-gray-800">Total Amount</span>
                                <span className="font-bold text-md text-RedVelvet">₹{totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            type="submit"
                            className="flex-1 sm:flex-none sm:px-10 py-3.5 rounded-lg text-md sm:text-lg text-white bg-gradient-to-r from-RedVelvet to-red-500 shadow-lg shadow-RedVelvet/20 hover:opacity-90 active:scale-[0.97] transition flex items-center justify-center gap-2"
                        >
                            Generate Quotation
                            <HiDocumentDownload size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 sm:flex-none sm:px-10 py-3.5 rounded-lg font-semibold text-md sm:text-lg text-white bg-gradient-to-r from-gray-700 to-gray-500 shadow-lg shadow-gray-600/20 hover:opacity-90 active:scale-[0.97] transition flex items-center justify-center gap-2"
                        >
                            Reset
                            <RiResetRightFill size={18} />
                        </button>
                    </div>

                    <p className="text-center text-md text-gray-800 mt-6">
                        Design & Develop by{" "}
                        <span className="font-bold bg-gradient-to-r from-RedVelvet via-red-600 to-red-500 bg-clip-text text-transparent">
                            Sughosh Technolab.
                        </span>
                    </p>
                </form>
            </div>

            {errorMsg && (
                <div className="fixed z-50 bottom-5 right-5 left-5 sm:left-auto sm:max-w-sm flex items-center gap-3 bg-red-50 border border-red-300 rounded-xl shadow-2xl px-4 py-4">
                    <IoCloseCircle className="text-red-500 flex-shrink-0" size={26} />
                    <p className="flex-1 text-red-600 text-sm font-semibold">{errorMsg}</p>
                    <button
                        type="button"
                        onClick={() => setErrorMsg("")}
                        className="text-red-400 hover:text-red-600 flex-shrink-0"
                    >
                        <IoClose size={20} />
                    </button>
                </div>
            )}
        </>
    );
};

export default QuotationForm;