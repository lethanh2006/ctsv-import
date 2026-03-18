import useInitModel from '@/hooks/useInitModel';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ActivitiesManagement.IStudentDeclaration>(
		'student-declaration-approvers',
		undefined,
		undefined,
		ipCCT,
	);

	return {
		...objInit,
	};
};
