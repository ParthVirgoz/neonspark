import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuotationForm from "./components/QuotationForm";
import QuotationViewPage from "./components/QuotationViewPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<QuotationForm />} />
                <Route path="/quotation-preview" element={<QuotationViewPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;