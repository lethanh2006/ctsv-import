import useInitModel from '@/hooks/useInitModel';
import { exportDanhSachKhaiBao } from '@/services/DaoTaoV2/DotCapNhatHoSo';
import { ipDaoTao } from '@/utils/ip';
import fileDownload from 'js-file-download';

export default () => {
	const objInit = useInitModel<DotCapNhatHoSo.IRecord>('dot-cap-nhat-ho-so', undefined, undefined, ipDaoTao);

	const { setLoading } = objInit;

	const exportDanhSachKhaiBaoModel = async (
		mode: 'chua-dang-ky' | 'da-dang-ky',
		idDot: string,
		condition?: any,
		filters?: any[],
	) => {
		setLoading(true);
		const res = await exportDanhSachKhaiBao(mode, idDot, condition);
		fileDownload(res?.data, `DanhSachSinhVien_${mode === 'chua-dang-ky' ? 'ChuaKhaiBao' : 'DaKhaiBao'}.xlsx`);
		setLoading(false);
	};

	return {
		...objInit,
		exportDanhSachKhaiBaoModel,
	};
};
