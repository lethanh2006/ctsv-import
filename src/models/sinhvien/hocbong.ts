import useInitModel from '@/hooks/useInitModel';
import { type SinhVien } from '@/services/SinhVien/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<SinhVien.IHocBongSinhVien>('hoc-bong', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
