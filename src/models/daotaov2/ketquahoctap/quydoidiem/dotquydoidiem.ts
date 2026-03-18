import useInitModel from '@/hooks/useInitModel';
import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DotQuyDoiDiem.IRecord>('dot-quy-doi-diem-sinh-vien', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
