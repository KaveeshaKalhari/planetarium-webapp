import { useState } from "react";
import Sidebar, {type PageType} from "../components/Sidebar";
import AlertsPage from "../Pages/AlertsPage.tsx";
import ReservationsPage from "../Pages/ReservationsPage.tsx";

export default function ProfileLayout() {
    const [currentPage, setCurrentPage] = useState<PageType>('profile');

    const renderPage = () => {
        switch (currentPage) {
            case 'reservations': return <ReservationsPage />;
            case 'alerts': return <AlertsPage />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0A1128] flex">
            <Sidebar
                activeTab={currentPage}
                onTabChange={setCurrentPage}
                onLogout={() => console.log('Logging out...')}
            />
            {renderPage()}
        </div>
    );
}
