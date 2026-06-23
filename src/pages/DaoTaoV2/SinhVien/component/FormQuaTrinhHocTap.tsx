import { Collapse } from 'antd';
import { useIntl, useModel } from 'umi';
// import LichSuSinhVienChuyenNganh from '../ChuyenNganh/components/LichSuChuyenNganh';
import LichSuSinhVienChuyenNganh from '../ChuyenNganh/LichSuChuyenNganh';
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

			<Collapse style={{ marginTop: 12 }}>
				<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.thongtindaotao.lophanhchinh' })} key='1'>
					<LopHanhChinhSinhVien />
				</Collapse.Panel>

				<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.thongtindaotao.loptinchi' })} key='4'>
					<LopTinChiSinhVien />
				</Collapse.Panel>

				<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.thongtindaotao.lichthi' })} key='lichthi'>
					<LichThiSinhVien />
				</Collapse.Panel>

				<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.thongtindaotao.chuyennganh' })} key='5'>
					<LichSuSinhVienChuyenNganh />
				</Collapse.Panel>
			</Collapse>
		</>
	);
};

export default FormQuaTrinhHocTap;
