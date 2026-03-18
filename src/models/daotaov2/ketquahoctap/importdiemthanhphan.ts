import useInitModel from '@/hooks/useInitModel';
import { getImportDiemLopHpTemplate } from '@/services/DaoTaoV2/KetQuaHocTap/DiemThanhPhan';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<any>('lop-hp-sv/diem-thanh-phan', undefined, undefined, ipDaoTao);

	const getImportTemplateModel = async (lopHocPhanId?: string): Promise<Blob> => {
		if (!lopHocPhanId) return Promise.reject();
		try {
			const res = await getImportDiemLopHpTemplate(lopHocPhanId);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	return {
		...objInit,
		getImportTemplateModel,
	};
};
