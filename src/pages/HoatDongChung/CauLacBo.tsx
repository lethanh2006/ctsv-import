import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import HoatDongChung from '.';

const HoatDongCauLacBo = (props: { hideCard?: boolean; paramCondition?: any }) => {
	return (
		<HoatDongChung
			hideCard={props.hideCard}
			paramCondition={props.paramCondition}
			phanLoaiCap1={EHoatDongChungType1.VAN_HOA_THE_THAO}
			phanLoaiCap2={EHoatDongChungType2.HOAT_DONG_CAU_LAC_BO}
		/>
	);
};

export default HoatDongCauLacBo;
