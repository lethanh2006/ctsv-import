import useInitModel from '@/hooks/useInitModel';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<SinhVien.IRecord>('sinh-vien/khong-dang-ky-nhu-cau', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
