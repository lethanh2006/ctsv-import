import useInitModel from '@/hooks/useInitModel';
import { type DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DangKyNhuCau.INhuCauHocPhan>('nhu-cau-hoc-phan', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
