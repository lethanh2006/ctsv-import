import useInitModel from '@/hooks/useInitModel';
import { type QuyDoiDiem } from '@/services/DaoTaoV2/DanhMucHeThong/QuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<QuyDoiDiem.IRecord>('quy-doi-diem', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
