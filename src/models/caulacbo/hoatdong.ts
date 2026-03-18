import useInitModel from '@/hooks/useInitModel';
import { updateTrangThaiHoatDongCLB } from '@/services/CauLacBo';
import type { ETrangThaiHoatDong } from '@/services/CauLacBo/constant';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<CauLacBo.HoatDong>('ke-hoach-hoat-dong-clb');

	const { setLoading } = objInit;

	const updateTrangThaiHoatDongCLBModel = async (
		idCLB: string,
		payload: {
			ghiChu: string;
			minhChung: string;
			trangThai: ETrangThaiHoatDong;
		},
		getData: any,
	) => {
		setLoading(true);
		await updateTrangThaiHoatDongCLB(idCLB, payload);
		message.success('Lưu thành công');
		setLoading(false);
		if (getData) getData();
	};

	return {
		...objInit,
		updateTrangThaiHoatDongCLBModel,
	};
};
