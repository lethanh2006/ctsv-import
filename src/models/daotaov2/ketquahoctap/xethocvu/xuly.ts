import useInitModel from '@/hooks/useInitModel';
import { type XetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu/typing';

export default () => {
	const objInit = useInitModel<XetHocVu.IRecord>('xu-ly-ket-qua-hoc-tap');

	return {
		...objInit,
	};
};
