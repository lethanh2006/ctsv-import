import useInitModel from '@/hooks/useInitModel';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ActivityOutCome.ICompetencyMapping>(
		'achieved-competencies',
		undefined,
		undefined,
		ipCCT,
	);

	return {
		...objInit,
	};
};
