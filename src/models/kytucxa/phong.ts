import useInitModel from '@/hooks/useInitModel';
import { thongKePhongKTX } from '@/services/KyTucXa';
import { ipCsvc } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<PhongKTX.IRecord>('phong/ktx', undefined, undefined, ipCsvc);
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<PhongKTX.IThongKePhong>();

	const thongKePhongKTXModel = async (condition?: any): Promise<PhongKTX.IThongKePhong> => {
		setLoadingThongKe(true);
		try {
			const res = await thongKePhongKTX(condition);
			setDataThongKe(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	return {
		...objInit,
		dataThongKe,
		loadingThongKe,
		thongKePhongKTXModel,
	};
};
