import useInitModel from '@/hooks/useInitModel';
import { thongKeNoiNgoaiTru } from '@/services/NoiNgoaiTru';
import type { NoiNgoaiTru } from '@/services/NoiNgoaiTru/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<NoiNgoaiTru.IKhaiBao>('khai-bao-noi-tru-ngoai-tru');
	const [thongKe, setThongKe] = useState<NoiNgoaiTru.IThongKeSinhVien>();
	const { setLoading } = objInit;

	const thongKeNoiNgoaiTruModel = async (dotKhaiBaoId: string): Promise<NoiNgoaiTru.IThongKeSinhVien> => {
		setLoading(true);
		try {
			const res = await thongKeNoiNgoaiTru(dotKhaiBaoId);
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
		thongKeNoiNgoaiTruModel,
		thongKe,
	};
};
