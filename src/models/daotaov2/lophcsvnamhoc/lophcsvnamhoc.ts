import useInitModel from '@/hooks/useInitModel';
import type { LopHanhChinhSinhVienNamHoc } from '@/services/DaoTaoV2/LopHanhChinhSinhVienNamHoc/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHanhChinhSinhVienNamHoc.IRecord>('lop-hc-sv-nam-hoc', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
