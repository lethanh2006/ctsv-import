import useInitModel from '@/hooks/useInitModel';
import { type LichSuNhapDiem } from '@/services/DaoTaoV2/KetQuaHocTap/LichSuNhapDiem/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LichSuNhapDiem.IRecord>('log-diem', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
