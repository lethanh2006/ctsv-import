import useInitModel from '@/hooks/useInitModel';
import { thongKeSucKhoeSinhVien } from '@/services/DotKhamSuKhoe';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<DotKhamSucKhoe.ISucKhoeSinhVien>('tinh-trang-suc-khoe-sinh-vien');
	const [thongKe, setThongKe] = useState<DotKhamSucKhoe.IThongKeSucKhoeSinhVien>();
	const { setLoading } = objInit;

	const thongKeSucKhoeSinhVienModel = async (dotKhamSucKhoeId: string): Promise<DotKhamSucKhoe.IDotKhamKhoaNganh> => {
		setLoading(true);
		try {
			const res = await thongKeSucKhoeSinhVien(dotKhamSucKhoeId);
			setThongKe(res.data?.data);
			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		thongKeSucKhoeSinhVienModel,
		thongKe,
	};
};
