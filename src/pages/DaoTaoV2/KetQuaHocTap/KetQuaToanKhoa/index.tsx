import { useIntl, useModel } from 'umi';
import CardLopHanhChinh from '../KetQuaHocKy/components/CardLopHanhChinh';
import '../KetQuaHocKy/components/style.less';
import KetQuaToanKhoaSinhVien from './KetQuaToanKhoaSinhVien';
import './components/style.less';

const KetQuaToanKhoaPage = () => {
	const intl = useIntl();
	const { record: recordSVLopHC } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');

	return (
		<CardLopHanhChinh title={intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.title' })}>
			<KetQuaToanKhoaSinhVien sinhVienSsoId={recordSVLopHC?.sinhVienSsoId} />
		</CardLopHanhChinh>
	);
};

export default KetQuaToanKhoaPage;
