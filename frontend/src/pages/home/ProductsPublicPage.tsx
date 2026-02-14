import "../../assets/css/pages/HomePage.css"
import ArticlesSection from "../../components/home/ArticlesSection"
import BannerSection from "../../components/home/BannerSection"
import ProductsSection from "../../components/home/ProductsSection"

export default function ProductsPublicPage() {
    return (
        <div className="hp-page">
            <div className="hp-container">
                <div className="hp-card"><ArticlesSection /></div>
                <div className="hp-card"><BannerSection /></div>
                <div className="hp-card"><ProductsSection /></div>
            </div>
        </div>
    )
}
