import useInitModel from '@/hooks/useInitModel';
import type { CauLacBo } from '@/services/CauLacBo/typings';

export default () => {
	const objInit = useInitModel<CauLacBo.IRecord>('cau-lac-bo');

	return {
		...objInit,
	};
};
