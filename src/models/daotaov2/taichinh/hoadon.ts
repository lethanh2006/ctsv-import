import useInitModel from '@/hooks/useInitModel';
import { getThongKeCongNoSinhVien } from '@/services/DaoTaoV2/TaiChinh/HoaDon';
import type { HoaDon } from '@/services/DaoTaoV2/TaiChinh/HoaDon/typing';
import { ipTaiChinh } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<HoaDon.IRecord>('bill', undefined, undefined, ipTaiChinh);
	const [dataThongKe, setDataThongKe] = useState<HoaDon.TThongKeCongNo>();
	const { setLoading } = objInit;

	const getThongKeCongNoModel = async (sinhVienSsoId: string): Promise<HoaDon.TThongKeCongNo> => {
		setLoading(true);
		try {
			const res = await getThongKeCongNoSinhVien(sinhVienSsoId);
			setDataThongKe(res.data?.data);
			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		dataThongKe,
		setDataThongKe,
		getThongKeCongNoModel,
	};
};
