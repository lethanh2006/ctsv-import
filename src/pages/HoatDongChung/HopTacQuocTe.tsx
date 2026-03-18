import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { useIntl } from 'umi';
import HoatDongChung from '.';

const HopTacQuocTe = () => {
	const intl = useIntl();

	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.PHUC_VU_CONG_DONG}
			phanLoaiCap2={EHoatDongChungType2.HOP_TAC_NGUYEN_CUU_CHUYEN_GAO}
			title={intl.formatMessage({ id: 'hoptacquocte.title' })}
		/>
	);
};

export default HopTacQuocTe;
