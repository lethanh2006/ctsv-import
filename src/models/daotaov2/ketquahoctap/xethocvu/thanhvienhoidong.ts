import useInitModel from '@/hooks/useInitModel';
import type { DotXetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/DotXetHocVu/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DotXetHocVu.IThanhVienHoiDong>('hoi-dong-hoc-vu', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
