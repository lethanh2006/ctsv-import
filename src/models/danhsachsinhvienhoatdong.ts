import useInitModel from '@/hooks/useInitModel';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';

export default () => {
	const objInit = useInitModel<HoatDongChung.DanhSachSinhVienThamGia>('sv-hd-ctsv');

	return {
		...objInit,
	};
};
