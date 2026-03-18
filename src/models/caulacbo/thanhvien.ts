import useInitModel from '@/hooks/useInitModel';
import type { CauLacBo } from '@/services/CauLacBo/typings';

export default () => {
	const objInit = useInitModel<CauLacBo.ThanhVien>('thanh-vien-cau-lac-bo');

	return {
		...objInit,
	};
};
