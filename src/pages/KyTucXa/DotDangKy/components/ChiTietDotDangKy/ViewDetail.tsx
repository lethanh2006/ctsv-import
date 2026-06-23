import { Tabs } from 'antd';

const ViewDetail = () => {
	return (
		<>
			<Tabs defaultActiveKey='1'>
				<Tabs.TabPane tab={'Thống kê'} key='1'>
					tap1
				</Tabs.TabPane>
				<Tabs.TabPane tab={'Danh sách sinh viên đăng ký'} key='2'>
					tap2
				</Tabs.TabPane>
			</Tabs>
		</>
	);
};

export default ViewDetail;
