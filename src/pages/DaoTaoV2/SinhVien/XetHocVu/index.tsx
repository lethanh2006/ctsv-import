// import KetQuaToanKhoaSinhVien from '@/pages/KetQuaHocTap/KetQuaToanKhoa/KetQuaToanKhoaSinhVien';
// import SelectSongNganh from '@/pages/NamHoc/KhoaNganh/components/SelectSongNganh';
import { Collapse } from 'antd';
import { useIntl, useModel } from 'umi';
import KetQuaToanKhoaSinhVien from '../../KetQuaHocTap/KetQuaToanKhoa/KetQuaToanKhoaSinhVien';
import SelectSongNganh from '../../NamHoc/KhoaNganh/components/SelectSongNganh';
import SinhVienCanhBaoTable from './Table';

const SinhVienHocVuPage = () => {
	const { record, khoaNganhSelected, setKhoaNganhSelected } = useModel('daotaov2.sinhvien.sinhvien');
	const intl = useIntl();

	return (
		<Collapse defaultActiveKey='3'>
			<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.lichsucanhbao.ketqua' })} key='3'>
				<SelectSongNganh
					ssoId={record?.ssoId ?? ''}
					style={{ width: 250, marginBottom: 12 }}
					value={khoaNganhSelected}
					onChange={(val) => setKhoaNganhSelected(val)}
				/>

				<KetQuaToanKhoaSinhVien sinhVienSsoId={record?.ssoId} maKhoaNganh={khoaNganhSelected} fixedSize />
			</Collapse.Panel>

			<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.lichsucanhbao.hoctap' })} key='1'>
				<SinhVienCanhBaoTable />
			</Collapse.Panel>
		</Collapse>
	);
};

export default SinhVienHocVuPage;
