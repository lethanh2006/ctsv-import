import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import HoatDongChung from '.';

const ThucThiChinhSach = () => {
	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.PHUC_VU_CONG_DONG}
			phanLoaiCap2={EHoatDongChungType2.THUC_THI_CHINH_SACH}
		/>
	);
};

export default ThucThiChinhSach;
