import useInitModel from '@/hooks/useInitModel';
import type { HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HocPhan.ILoaiHocPhan>('loai-hoc-phan', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
