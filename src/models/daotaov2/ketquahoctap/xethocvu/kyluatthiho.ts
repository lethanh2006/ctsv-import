import useInitModel from '@/hooks/useInitModel';
import type { XetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/XetHocVu/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<XetHocVu.IKyLuat>('ky-luat/thi', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
