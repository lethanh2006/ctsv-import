import useInitModel from '@/hooks/useInitModel';
import { ipCCT } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<AttributesManagement.IRecord>('attributes', undefined, undefined, ipCCT);

	return {
		...objInit,
	};
};
