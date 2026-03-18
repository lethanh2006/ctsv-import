import { thongkeSinhVienCanhBao } from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu';
import type { XetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu/typing';
import { useState } from 'react';

export default () => {
	const [thongKe, setThongKe] = useState<XetHocVu.TThongKeSV>();

	const thongkeSinhVienCanhBaoModel = async (
		type: 'canh-bao-ket-qua-hoc-tap' | 'thoi-hoc',
		maHocKy: string,
	): Promise<XetHocVu.TThongKeSV> => {
		try {
			const res = await thongkeSinhVienCanhBao(type, maHocKy);
			setThongKe(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
		}
	};

	return {
		thongkeSinhVienCanhBaoModel,
		thongKe,
	};
};
