import useInitModel from '@/hooks/useInitModel';
import { getSinhVienHocPhanNamHoc } from '@/services/DaoTaoV2/HocKy/LopHocPhan';
import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHocPhan.IDiemHpSvHk>('diem-hp-sv-hk', undefined, undefined, ipDaoTao);
	const { setLoading, setDanhSach } = objInit;

	const getByHocPhanNamHocModel = async (
		ssoId: string,
		params: { maHocPhan?: string; namHocId?: string; maKhoaNganh?: string },
	): Promise<LopHocPhan.IDiemHpSvHk[]> => {
		setLoading(true);
		try {
			const response = await getSinhVienHocPhanNamHoc(ssoId, params);
			const data: LopHocPhan.IDiemHpSvHk[] = response?.data?.data ?? [];
			setDanhSach(data);

			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getByHocPhanNamHocModel,
	};
};
