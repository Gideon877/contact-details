import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardPage from "./pages/Dashboard"
import ContactsPage from "./pages/Contacts"
import ClientsPage from "./pages/Clients"
import DashboardLayout from "./layout/Layout"

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="contacts" element={<ContactsPage />} />
                    <Route path="clients" element={<ClientsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
