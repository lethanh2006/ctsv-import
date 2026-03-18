import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LopHanhChinhNhanSuNamHoc.IRecord>('lop-hc-ns', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
