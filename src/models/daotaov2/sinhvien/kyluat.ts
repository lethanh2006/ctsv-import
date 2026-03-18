import useInitModel from '@/hooks/useInitModel';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { ip3, ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<SinhVien.IKyLuatSinhVien>('ky-luat', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
