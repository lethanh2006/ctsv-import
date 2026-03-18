import useInitModel from '@/hooks/useInitModel';
import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHanhChinh.INhanSuHocKy>('nhan-su-hoc-ky', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
