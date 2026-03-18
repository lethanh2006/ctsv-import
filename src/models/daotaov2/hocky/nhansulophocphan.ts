import useInitModel from '@/hooks/useInitModel';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHocPhan.IRecordNhanSuLopHP>('lop-hp-ns', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
