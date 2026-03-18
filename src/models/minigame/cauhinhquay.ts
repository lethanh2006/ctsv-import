import { capNhatPhanThuong, getCauHinhQuay, putCauHinhQuay } from '@/services/Minigame/CauHinhQuay';
import { MCauHinhQuay } from '@/services/Minigame/CauHinhQuay/typing';
import { useState } from 'react';

export default () => {
    const [cauHinhQuay, setCauHinhQuay] = useState<MCauHinhQuay.IRecord>();
    const [loading, setLoading] = useState<boolean>(false);
    
    const getCauHinh = async () => {
        try {
            setLoading(true);
            const res = await getCauHinhQuay();
            setCauHinhQuay(res.data.data);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }

    const thietLapCauHinhQuay = async (payload: MCauHinhQuay.IRecord) => {
        try {
            setLoading(true);
            const res = await putCauHinhQuay(payload);
            setCauHinhQuay(res.data.data);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }

    const capNhatPhanThuongVongQuay = async (payload: MCauHinhQuay.ICapNhatPhanThuong[]) => {
        try {
            setLoading(true);
            await capNhatPhanThuong(payload);
            getCauHinh();
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }
	return {
        getCauHinh,
        cauHinhQuay,
        thietLapCauHinhQuay,
        loading,
        capNhatPhanThuongVongQuay
    };
};
