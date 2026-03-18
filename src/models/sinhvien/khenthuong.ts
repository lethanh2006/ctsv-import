import useInitModel from '@/hooks/useInitModel';
import { type SinhVien } from '@/services/SinhVien/typings';

export default () => {
	const objInit = useInitModel<SinhVien.IKhenThuongSinhVien>('khen-thuong');

	return {
		...objInit,
	};
};
