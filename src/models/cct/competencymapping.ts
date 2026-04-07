import useInitModel from '@/hooks/useInitModel';
import { Activity } from '@/services/CCT/Activity/typing';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<Activity.ICompetencyMapping>(
		'co-curricular-attributes-equivalency',
		undefined,
		undefined,
		ipCCT,
	);

	return {
		...objInit,
	};
};
