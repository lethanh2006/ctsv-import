import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<CoSoDaoTao.IRecord>('co-so-dao-tao', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
