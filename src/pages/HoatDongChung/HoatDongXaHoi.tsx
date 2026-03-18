import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { useIntl } from 'umi';
import HoatDongChung from '.';

const HoatDongXaHoi = () => {
	const intl = useIntl();

	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.PHUC_VU_CONG_DONG}
			phanLoaiCap2={EHoatDongChungType2.HOAT_DONG_XA_HOI}
			title={intl.formatMessage({ id: 'hoatdongxahoi.title' })}
		/>
	);
};

export default HoatDongXaHoi;
