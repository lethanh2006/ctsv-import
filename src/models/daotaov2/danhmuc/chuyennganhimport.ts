import useInitModel from '@/hooks/useInitModel';
import type { NganhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/Nganh/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<NganhDaoTao.IRecordCoSo>('chuyen-nganh', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
