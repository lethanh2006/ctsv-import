import useInitModel from '@/hooks/useInitModel';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ActivitiesManagement.IRecord>('activities-type', undefined, undefined, ipCCT);

	return {
		...objInit,
	};
};
