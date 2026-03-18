import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<NganhDaoTao.IRecordBo>('dm-nganh', undefined, undefined, ipDaoTao, {
		ma: 1,
	});

	return {
		...objInit,
	};
};
