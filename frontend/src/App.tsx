import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
    return (
        <>
            <Header />

            <main style={{ minHeight: "calc(100vh - 64px - 220px)" }}>
                {/* Nội dung trang */}
            </main>

            <Footer />
        </>
    );
}

export default App;
