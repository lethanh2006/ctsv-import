import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HocLieu.IRecord>('hoc-lieu', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
