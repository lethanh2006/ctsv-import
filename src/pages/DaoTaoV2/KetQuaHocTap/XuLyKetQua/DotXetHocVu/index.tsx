import { Divider } from 'antd';
import { useIntl } from 'umi';
import ThanhVienHoiDongTable from '../ThongTinHoiDong';
import FormDotXetHocVu from './FormDotXetHocVu';

const DotXetHocVuStep = () => {
	const intl = useIntl();
	return (
		<>
			<Divider orientation='center'>{intl.formatMessage({ id: 'ketquahoctap.xulyketqua.dotxethocvu.dotxet' })}</Divider>
			<div style={{ maxWidth: '800px', margin: 'auto' }}>
				<FormDotXetHocVu />
			</div>

			<Divider orientation='center' style={{ marginTop: 24 }}>
				{intl.formatMessage({ id: 'ketquahoctap.xulyketqua.dotxethocvu.hoidong' })}
			</Divider>
			<ThanhVienHoiDongTable />
		</>
	);
};

export default DotXetHocVuStep;
