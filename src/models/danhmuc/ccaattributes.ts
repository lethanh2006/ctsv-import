import useInitModel from '@/hooks/useInitModel';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ActivitiesManagement.IActivitiesTypeAttributes>(
		'activities-type-attributes',
		undefined,
		undefined,
		ipCCT,
	);

	return {
		...objInit,
	};
};
