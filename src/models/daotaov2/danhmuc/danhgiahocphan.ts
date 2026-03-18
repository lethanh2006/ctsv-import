import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DanhGiaHocPhan.IRecord>('danh-gia-hoc-phan', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
