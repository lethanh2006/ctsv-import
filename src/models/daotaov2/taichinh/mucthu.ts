import useInitModel from '@/hooks/useInitModel';
import type { MucThuTaiChinh } from '@/services/DaoTaoV2/TaiChinh/MucThu/typing';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<MucThuTaiChinh.IRecord>('muc-thu', undefined, undefined, ipTaiChinh);

	return {
		...objInit,
	};
};
