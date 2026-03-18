import useInitModel from '@/hooks/useInitModel';
import { type PhienBan } from '@/services/DaoTaoV2/DanhMucHeThong/PhienBan/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<PhienBan.IRecord>('phien-ban', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
