import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<NgoaiNgu.IRecord>('ngon-ngu', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
