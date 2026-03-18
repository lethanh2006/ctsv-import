import { EditOutlined } from '@ant-design/icons';
import { Button, Modal, Tabs } from 'antd';
import { useModel } from 'umi';
import NhanSuLopHocPhan from '../../NhanSuLopHocPhan';
import SinhVienLopHocPhan from '../../SvLopHocPhan';
import ViewChiTietLopHp from './ViewChiTiet';
import { useState } from 'react';
import LogLopHocPhanPage from '../../LogLopHocPhan';

const ModalChiTietLopHocPhan = (props: {
	visible: boolean;
	setVisible: any;
	hasEdit?: boolean;
	otherButtons?: JSX.Element[];
}) => {
	const { setEdit, setVisibleForm } = useModel('daotaov2.hocky.lophocphan');
	const [activeKey, setActiveKey] = useState<string>('1');
	const { visible, setVisible, hasEdit, otherButtons } = props;

	const handleEdit = () => {
		setEdit(true);
		setVisibleForm(true);
		props?.setVisible(false);
	};

	return (
		<Modal
			title='Thông tin lớp tín chỉ'
			footer={null}
			width={1000}
			open={visible}
			onCancel={() => setVisible(false)}
		>
			<ViewChiTietLopHp />

			<div className='ant-descriptions-title' style={{ marginTop: 18, marginBottom: 12 }}>
				Danh sách sinh viên
			</div>
			{/* <Tabs accessKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
				<Tabs.TabPane key='1' tab='Danh sách hiện tại' />
				<Tabs.TabPane key='2' tab='Danh sách đã hủy, chuyển' />
			</Tabs>
			{activeKey === '1' ? <SinhVienLopHocPhan isView /> : <LogLopHocPhanPage />} */}
			<SinhVienLopHocPhan isView />

			<div className='ant-descriptions-title' style={{ marginTop: 18 }}>
				Giảng viên
			</div>
			<NhanSuLopHocPhan isView />

			<div className='form-footer' style={{ marginTop: 20 }}>
				{hasEdit ? (
					<Button type='primary' icon={<EditOutlined />} onClick={() => handleEdit()}>
						Chỉnh sửa
					</Button>
				) : null}

				{otherButtons?.map((item) => item)}

				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div>
		</Modal>
	);
};

export default ModalChiTietLopHocPhan;
