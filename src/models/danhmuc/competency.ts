import useInitModel from '@/hooks/useInitModel';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<Competency.IRecord>('competency', undefined, undefined, ipCCT);

	return {
		...objInit,
	};
};
