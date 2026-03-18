import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<TrinhDoDaoTao.IRecordNhaNuoc>('dm-trinh-do-nn', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
