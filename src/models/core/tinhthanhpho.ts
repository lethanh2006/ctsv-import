import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { useState } from 'react';

export default () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [danhSach, setDanhSach] = useState<DonViHanhChinh.IRecord[]>([]);

	const getAllModel = async (): Promise<DonViHanhChinh.IRecord[]> => {
		setLoading(true);
		try {
			const res = await getTinhThanhPho();
			setDanhSach(res.data?.data ?? []);
			return res.data?.data ?? [];
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return { loading, setLoading, danhSach, setDanhSach, getAllModel };
};
