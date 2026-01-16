import { useEffect, useState } from "react";
import { getMe, upsertMe, type MeDTO } from "../services/userApi";

export default function ProfileAddressPanel() {
    const [me, setMe] = useState<MeDTO | null>(null);
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                setErr(null);

                const meRes = await getMe();
                if (!mounted) return;

                setMe(meRes);
                setForm({
                    fullName: meRes.fullName ?? "",
                    phone: meRes.phone ?? "",
                    email: meRes.email ?? "",
                    address: meRes.address ?? "",
                });
            } catch (e: any) {
                setErr(e?.message ?? "Load profile failed");
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const onSave = async () => {
        try {
            setSaving(true);
            setMsg(null);
            setErr(null);

            const updated = await upsertMe({
                fullName: form.fullName,
                phone: form.phone,
                email: form.email,
                address: form.address,
            });

            setMe(updated);
            setMsg("Lưu thành công!");
        } catch (e: any) {
            setErr(e?.message ?? "Save failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="ud-card">
            <h2 className="ud-title">Thông tin và sổ địa chỉ</h2>

            {loading && <div className="ud-note">Đang tải thông tin...</div>}
            {err && <div className="ud-note" style={{ color: "crimson" }}>{err}</div>}
            {msg && <div className="ud-note" style={{ color: "#12b76a", fontWeight: 700 }}>{msg}</div>}

            {!loading && !err && (
                <div className="ud-grid">
                    <section className="ud-section">
                        <h3 className="ud-h3">Thông tin cá nhân</h3>

                        <div className="ud-field">
                            <label>Họ tên</label>
                            <input
                                value={form.fullName}
                                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                                placeholder="VD: Anh Huy"
                            />
                        </div>

                        <div className="ud-field">
                            <label>Số điện thoại</label>
                            <input
                                value={form.phone}
                                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                placeholder="VD: 09xxxxxxxx"
                            />
                        </div>

                        <div className="ud-field">
                            <label>Email</label>
                            <input
                                value={form.email}
                                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                placeholder="VD: huy@gmail.com"
                            />
                        </div>

                        <button className="ud-primary" type="button" onClick={onSave} disabled={saving}>
                            {saving ? "Đang lưu..." : "Lưu thông tin"}
                        </button>

                        <div className="ud-note">
                            UserId: <b>{me?.id}</b>
                        </div>
                    </section>

                    <section className="ud-section">
                        <h3 className="ud-h3">Sổ địa chỉ</h3>

                        <div className="ud-field">
                            <label>Địa chỉ mặc định</label>
                            <input
                                value={form.address}
                                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                                placeholder="VD: 12 Nguyễn Trãi, Q1..."
                            />
                        </div>

                        <button className="ud-secondary" type="button" onClick={onSave} disabled={saving}>
                            {saving ? "Đang lưu..." : "Lưu địa chỉ"}
                        </button>

                        <div className="ud-note">
                            (Sau này nếu bạn tách nhiều địa chỉ) thì đổi field `address` thành list addresses.
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
