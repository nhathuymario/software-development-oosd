import { useMemo, useState } from "react";
import "../../assets/css/pages/UserDetailPage.css";
import { getUsername } from "../../services/auth";
import UserSidebar, { type TabKey } from "../../components/UserSidebar";
import OrdersPanel from "../../components/OrdersPanel";
import ProfileAddressPanel from "../../components/ProfileAddressPanel";

const UserDetailPage = () => {
    const [tab, setTab] = useState<TabKey>("orders");
    const username = useMemo(() => getUsername() ?? "User", []);

    return (
        <div className="ud-wrap">
            <UserSidebar username={username} tab={tab} onChangeTab={setTab} />

            <main className="ud-main">
                {tab === "orders" ? <OrdersPanel /> : <ProfileAddressPanel />}
            </main>
        </div>
    );
};

export default UserDetailPage;
