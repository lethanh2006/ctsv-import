import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ToaNha.IRecord>('toa-nha', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
