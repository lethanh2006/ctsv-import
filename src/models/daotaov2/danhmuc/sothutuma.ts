import useInitModel from '@/hooks/useInitModel';
import type { SinhMaTuDong } from '@/services/DaoTaoV2/DanhMucHeThong/SinhMaTuDong/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<SinhMaTuDong.ISoThuTu>('increment', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
