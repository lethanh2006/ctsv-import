import useInitModel from '@/hooks/useInitModel';
import { ipCsvc } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<PhongCSVC.IRecord>('phong', undefined, undefined, ipCsvc);
	return {
		...objInit,
	};
};
