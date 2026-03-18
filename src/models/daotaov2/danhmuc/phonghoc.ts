import useInitModel from '@/hooks/useInitModel';
import type { PhongHoc } from '@/services/DaoTaoV2/DanhMucHeThong/PhongHoc/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<PhongHoc.IRecord>('phong', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
