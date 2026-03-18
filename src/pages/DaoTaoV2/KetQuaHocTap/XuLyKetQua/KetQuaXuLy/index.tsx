import { Divider } from 'antd';
import { useIntl } from 'umi';
import SinhVienXuLyStep from '../SinhVienXuLy';
import TaiLieuHocVuPage from '../TaiLieuHocVu';

const KetQuaXuLyStep = () => {
	const intl = useIntl();
	return (
		<>
			<SinhVienXuLyStep isKetQua />
			<Divider orientation='center' style={{ marginTop: 24 }}>
				{intl.formatMessage({ id: 'ketquahoctap.xulyketqua.dotxethocvu.hoso' })}
			</Divider>
			<TaiLieuHocVuPage />
		</>
	);
};

export default KetQuaXuLyStep;
