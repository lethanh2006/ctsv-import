import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<any>('import-diem-aq', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
