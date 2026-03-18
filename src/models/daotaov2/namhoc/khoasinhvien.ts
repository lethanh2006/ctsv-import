import useInitModel from '@/hooks/useInitModel';
import type { KhoaSinhVien } from '@/services/DaoTaoV2/NamHoc/KhoaSinhVien/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<KhoaSinhVien.IRecord>('khoa-sinh-vien', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
