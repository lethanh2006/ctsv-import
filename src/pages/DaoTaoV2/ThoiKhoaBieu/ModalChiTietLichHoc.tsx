import ViewChiTietLopHp from '@/pages/DaoTaoV2/HocKy/LopHocPhan/components/ViewChiTiet';
import { Modal, Spin } from 'antd';
import { useIntl, useModel } from 'umi';

const ModalChiTietLichHocSinhVien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { loading } = useModel('daotaov2.hocky.lophocphan');
	const { visible, setVisible } = props;

	return (
		<Modal
			open={visible}
			title={intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.title' })}
			destroyOnClose
			width={800}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText={intl.formatMessage({ id: 'global.button.dong' })}
		>
			<Spin spinning={loading}>
				<ViewChiTietLopHp />
			</Spin>
		</Modal>
	);
};

export default ModalChiTietLichHocSinhVien;
