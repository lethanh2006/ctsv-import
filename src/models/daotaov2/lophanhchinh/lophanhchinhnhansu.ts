import useInitModel from '@/hooks/useInitModel';
import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHanhChinh.IRecord>('lop-hanh-chinh/nhan-su', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
