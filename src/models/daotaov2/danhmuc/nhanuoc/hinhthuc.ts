import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HinhThucDaoTao.IRecordNhaNuoc>('dm-hinh-thuc-nn', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
