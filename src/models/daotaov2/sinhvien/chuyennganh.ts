import useInitModel from '@/hooks/useInitModel';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<SinhVien.IChuyenNganh>('khoa-nganh/chuyen-sinh-vien', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
