import useInitModel from '@/hooks/useInitModel';
import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DotQuyDoiDiem.IMinhChungQuyDoiDiem>(
		'quy-doi-diem-sv-minh-chung',
		undefined,
		undefined,
		ipDaoTao,
	);

	return {
		...objInit,
	};
};
