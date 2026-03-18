import useInitModel from '@/hooks/useInitModel';
import type { LopHanhChinh } from '@/services/DaoTaoV2/LopHanhChinh/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHanhChinh.IRecord>('lop-hanh-chinh', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
