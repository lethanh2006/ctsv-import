import useInitModel from '@/hooks/useInitModel';
import type { ChungChi } from '@/services/DaoTaoV2/DanhMucHeThong/ChungChi/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ChungChi.ILoaiChungChi>('loai-chung-chi', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
