import useInitModel from '@/hooks/useInitModel';
import { thongKeSinhVienTheChatDanhGia } from '@/services/TienIch/TheChat';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<TheChat.IKetQuaTheChat>('ket-qua-the-chat');
	const [thongKe, setThongKe] = useState<TheChat.IThongKeSinhVienTheChatDanhGia>();
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);

	// const thongKeSinhVienTheChatModel = async (
	// 	condition?: any,
	// 	filters?: any[],
	// ): Promise<TheChat.IThongKeSinhVienTheChat[]> => {
	// 	setLoadingThongKe(true);
	// 	try {
	// 		const res = await thongKeSinhVienTheChat({
	// 			condition,
	// 			filters,
	// 		});
	// 		setThongKe(res.data?.data ?? []);
	// 		return res.data?.data ?? [];
	// 	} catch (error) {
	// 		return Promise.reject(error);
	// 	} finally {
	// 		setLoadingThongKe(false);
	// 	}
	// };

	const thongKeSinhVienTheChatModel = async (dotId: string): Promise<TheChat.IThongKeSinhVienTheChatDanhGia> => {
		setLoadingThongKe(true);
		try {
			const res = await thongKeSinhVienTheChatDanhGia(dotId);
			setThongKe(res.data?.data?.tongQuan ?? []);
			return res.data?.data ?? [];
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoadingThongKe(false);
		}
	};

	return {
		...objInit,
		loadingThongKe,
		thongKe,
		thongKeSinhVienTheChatModel,
	};
};
