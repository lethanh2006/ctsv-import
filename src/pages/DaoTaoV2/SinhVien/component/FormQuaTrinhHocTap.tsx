import { Collapse } from 'antd';
import { useIntl, useModel } from 'umi';
import HocTapSinhVienHienTaiPage from '../HocTapSinhVienHienTai';
import LichThiSinhVien from '../LichThi';
import LopHanhChinhSinhVien from '../LopHanhChinhSinhVien';
import LopTinChiSinhVien from '../LopTinChi';

const FormQuaTrinhHocTap = () => {
	const intl = useIntl();
	const { record } = useModel('daotaov2.sinhvien.sinhvien');

	return (
		<>
			<HocTapSinhVienHienTaiPage sinhVienSsoId={record?.ssoId} />

			<Collapse>
				<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.tab2.lophanhchinh.header' })} key='1'>
					<LopHanhChinhSinhVien />
				</Collapse.Panel>

				<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.tab2.loptinchi.header' })} key='2'>
					<LopTinChiSinhVien />
				</Collapse.Panel>

				<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.tab2.lichthi.header' })} key='lichthi'>
					<LichThiSinhVien />
				</Collapse.Panel>
			</Collapse>
		</>
	);
};

export default FormQuaTrinhHocTap;
