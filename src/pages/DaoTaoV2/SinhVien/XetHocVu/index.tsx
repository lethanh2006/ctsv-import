import { Collapse } from 'antd';
import { useIntl, useModel } from 'umi';
import KetQuaToanKhoaSinhVien from '../../KetQuaHocTap/KetQuaToanKhoa/KetQuaToanKhoaSinhVien';
import SinhVienCanhBaoTable from './Table';

const SinhVienHocVuPage = () => {
	const { record } = useModel('daotaov2.sinhvien.sinhvien');
	const intl = useIntl();

	return (
		<Collapse defaultActiveKey='3'>
			<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.lichsucanhbao.ketqua' })} key='3'>
				<KetQuaToanKhoaSinhVien sinhVienSsoId={record?.ssoId} />
			</Collapse.Panel>

			<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.lichsucanhbao.hoctap' })} key='1'>
				<SinhVienCanhBaoTable />
			</Collapse.Panel>

			<Collapse.Panel header={intl.formatMessage({ id: 'sinhvien.lichsucanhbao.thoihoc' })} key='2'>
				<SinhVienCanhBaoTable isThoiHoc />
			</Collapse.Panel>
		</Collapse>
	);
};

export default SinhVienHocVuPage;
