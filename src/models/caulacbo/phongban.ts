import useInitModel from '@/hooks/useInitModel';
import type { CauLacBo } from '@/services/CauLacBo/typings';

export default () => {
	const objInit = useInitModel<CauLacBo.PhongBan>('ban-bo-phan-cau-lac-bo');

	return {
		...objInit,
	};
};
