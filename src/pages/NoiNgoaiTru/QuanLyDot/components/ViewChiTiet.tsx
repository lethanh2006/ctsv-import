import { Modal, Tabs } from 'antd';
import DanhSachSinhVienKhaiBaoPage from '../../DanhSachSinhVienKhaiBao';
import ThongKePage from '../../ThongKe';

const ViewChiTiet = (props: { visibleForm: boolean; setVisibleForm: (val: boolean) => void }) => {
	const { visibleForm, setVisibleForm } = props;
	return (
		<Modal
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			title='Chi tiết đợt khai báo nội - ngoại trú'
			footer={null}
			width={1100}
		>
			<Tabs>
				<Tabs.TabPane tab='Tổng quan' key='1'>
					<ThongKePage />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Danh sách khai báo' key='2'>
					<DanhSachSinhVienKhaiBaoPage />
				</Tabs.TabPane>
			</Tabs>
		</Modal>
	);
};

export default ViewChiTiet;
