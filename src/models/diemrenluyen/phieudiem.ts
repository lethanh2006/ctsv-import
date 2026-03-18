import useInitModel from '@/hooks/useInitModel';
import { doiTrangThaiPhieuDiem } from '@/services/DiemRenLuyen/PhieuDiem';
import type { PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiem/typings';
import type { ETrangThaiChamDiem } from '@/services/DiemRenLuyen/constants';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<PhieuDiemRenLuyen.IRecord>('drl/phieu-drl');

	const { setLoading } = objInit;

	const doiTrangThaiPhieuDiemModel = async (
		idDot: string,
		trangThaiCu: ETrangThaiChamDiem,
		trangThaiMoi: ETrangThaiChamDiem,
		getData: any,
	) => {
		setLoading(true);
		await doiTrangThaiPhieuDiem(idDot, trangThaiCu, trangThaiMoi);
		message.success('Thay đổi trạng thái thành công');
		getData();
		setLoading(false);
	};

	return {
		...objInit,
		doiTrangThaiPhieuDiemModel,
	};
};
