import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import HoatDongChung from '.';

const VanHoaTheThao = () => {
	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.VAN_HOA_THE_THAO}
			phanLoaiCap2={EHoatDongChungType2.VAN_HOA_VAN_NGHE_THE_THAO}
		/>
	);
};

export default VanHoaTheThao;
