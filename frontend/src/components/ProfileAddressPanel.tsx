import { useEffect, useState } from "react";
import { getMe, upsertMe, type MeDTO } from "../services/userApi";
import "../assets/css/components/ProfileAddressPanel.css";
import { getToken } from "../services/auth";

export default function ProfileAddressPanel() {
    const [me, setMe] = useState<MeDTO | null>(null);

    const [address, setAddress] = useState("");
    const [editingPersonal, setEditingPersonal] = useState(false);
    const [personalDraft, setPersonalDraft] = useState({
        fullName: "",
        phone: "",
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

                // ✅ không có token thì không gọi /me
                const token = getToken();
                if (!token) {
                    setErr("Bạn chưa đăng nhập.");
                    return;
                }

                const meRes = await getMe();
                if (!mounted) return;

                setMe(meRes);
                setPersonalDraft({
                    fullName: meRes.fullName ?? "",
                    phone: meRes.phone ?? "",
                });
                setAddress(meRes.address ?? "");
            } catch (e: any) {
                // giữ message lỗi, không điều hướng gì cả
                setErr(e?.message ?? "Load profile failed");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const savePersonal = async () => {
        if (!me) return;

        try {
            setSaving(true);
            setMsg(null);
            setErr(null);

            const updated = await upsertMe({
                fullName: personalDraft.fullName,
                phone: personalDraft.phone,
                address: me.address ?? "",
            });

            setMe(updated);
            setEditingPersonal(false);
            setMsg("Lưu thành công!");
        } catch (e: any) {
            setErr(e?.message ?? "Save failed");
        } finally {
            setSaving(false);
        }
    };

    const cancelPersonal = () => {
        setEditingPersonal(false);
        setPersonalDraft({
            fullName: me?.fullName ?? "",
            phone: me?.phone ?? "",
        });
    };

    const saveAddress = async () => {
        if (!me) return;

        try {
            setSaving(true);
            setMsg(null);
            setErr(null);

            const updated = await upsertMe({
                fullName: me.fullName ?? "",
                phone: me.phone ?? "",
                address,
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
            {err && <div className="ud-note ud-note--error">{err}</div>}
            {msg && <div className="ud-note ud-note--success">{msg}</div>}

            {!loading && !err && (
                <div className="ud-grid">
                    {/* THÔNG TIN CÁ NHÂN */}
                    <section className="ud-section">
                        <h3 className="ud-h3 ud-h3--upper">Thông tin cá nhân</h3>

                        {!editingPersonal ? (
                            <div className="pap-row">
                                <div className="pap-row__text">
                                    {(me?.fullName ?? "—") + " - " + (me?.phone ?? "—")}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setEditingPersonal(true)}
                                    className="pap-edit-btn"
                                >
                                    <span aria-hidden className="pap-edit-btn__icon">✎</span>
                                    Sửa
                                </button>
                            </div>
                        ) : (
                            <div className="pap-edit">
                                <div className="ud-field pap-edit__field">
                                    <label>Họ &amp; Tên:</label>
                                    <input
                                        value={personalDraft.fullName}
                                        onChange={(e) =>
                                            setPersonalDraft((p) => ({ ...p, fullName: e.target.value }))
                                        }
                                        placeholder="VD: Anh Huy"
                                    />
                                </div>

                                <div className="ud-field pap-edit__field">
                                    <label>Số điện thoại:</label>
                                    <input
                                        value={personalDraft.phone}
                                        onChange={(e) =>
                                            setPersonalDraft((p) => ({ ...p, phone: e.target.value }))
                                        }
                                        placeholder="VD: 09xxxxxxxx"
                                    />
                                </div>

                                <div className="pap-edit__actions">
                                    <button
                                        type="button"
                                        onClick={cancelPersonal}
                                        disabled={saving}
                                        className="pap-link-btn"
                                    >
                                        Hủy
                                    </button>

                                    <button
                                        type="button"
                                        onClick={savePersonal}
                                        disabled={saving}
                                        className="pap-link-btn pap-link-btn--save"
                                    >
                                        {saving ? "Đang lưu..." : "Lưu"}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="ud-note">
                            UserId: <b>{me?.id}</b>
                        </div>
                    </section>

                    {/* SỔ ĐỊA CHỈ */}
                    <section className="ud-section">
                        <h3 className="ud-h3">Sổ địa chỉ</h3>

                        <div className="ud-field">
                            <label>Địa chỉ mặc định</label>
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="VD: 12 Nguyễn Trãi, Q1..."
                            />
                        </div>

                        <button
                            className="ud-secondary"
                            type="button"
                            onClick={saveAddress}
                            disabled={saving}
                        >
                            {saving ? "Đang lưu..." : "Lưu địa chỉ"}
                        </button>
                    </section>
                </div>
            )}
        </div>
    );
}
