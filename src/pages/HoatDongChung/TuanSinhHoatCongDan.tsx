import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import HoatDongChung from '.';

const TuanSinhHoatCongDan = () => {
	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG}
			phanLoaiCap2={EHoatDongChungType2.TUAN_LE_CONG_DAN}
		/>
	);
};

export default TuanSinhHoatCongDan;
