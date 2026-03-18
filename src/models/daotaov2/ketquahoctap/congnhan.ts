import useInitModel from '@/hooks/useInitModel';
import { type CongNhanKQHT } from '@/services/DaoTaoV2/KetQuaHocTap/CongNhan/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<CongNhanKQHT.IRecord>('cong-nhan-kqht', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
