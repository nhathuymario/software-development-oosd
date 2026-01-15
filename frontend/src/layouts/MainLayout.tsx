import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = () => {
    return (
        <>
            <Header />
            <main style={{ minHeight: "calc(100vh - 64px - 220px)" }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;
