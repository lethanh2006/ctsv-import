import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { useIntl } from 'umi';
import HoatDongChung from '.';

const DonViNgoaiHocVien = () => {
	const intl = useIntl();

	return (
		<HoatDongChung
			phanLoaiCap1={EHoatDongChungType1.PHUC_VU_CONG_DONG}
			phanLoaiCap2={EHoatDongChungType2.NGOAI_HOC_VIEN}
			title={intl.formatMessage({ id: 'donvingoaihocvien.title' })}
		/>
	);
};

export default DonViNgoaiHocVien;
