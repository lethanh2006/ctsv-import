import { Modal } from 'antd';
import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useIntl } from 'umi';
import LichHocLopHocPhanMulti from './Calendar/Multi';
import ModalChiTietLichHocSinhVien from './ModalChiTietLichHoc';

const ModalLichHocSinhVien = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	danhSachLop?: string[];
	tenSinhVien?: string;
}) => {
	const intl = useIntl();
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const { visible, setVisible, danhSachLop, tenSinhVien = '' } = props;

	return (
		<Modal
			title={`${intl.formatMessage({ id: 'loptinchi.lichhoc.title' })} ${tenSinhVien}`}
			open={visible}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText={intl.formatMessage({ id: 'global.button.dong' })}
			width={1000}
		>
			{visible ? <LichHocLopHocPhanMulti danhSachLop={danhSachLop} onClickLop={() => setVisibleDetail(true)} /> : null}

			<ModalChiTietLichHocSinhVien visible={visibleDetail} setVisible={setVisibleDetail} />
		</Modal>
	);
};

export default ModalLichHocSinhVien;
