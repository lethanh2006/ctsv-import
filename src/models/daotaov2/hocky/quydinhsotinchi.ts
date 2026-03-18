import useInitModel from '@/hooks/useInitModel';
import type { HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HocKy.IQuyDinhSoTinChiDangKy>('quy-dinh-so-tin-chi', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
