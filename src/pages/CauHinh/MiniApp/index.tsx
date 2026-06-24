import { Card, Collapse } from 'antd';
import TableDanhMuc from './components/TableDanhMuc';
import TableMiniApp from './components/TableMiniApp';

const { Panel } = Collapse;

const MiniAppPage = () => {
	return (
		<Card title='Cấu hình Mini App'>
			<Collapse defaultActiveKey={['1']}>
				<Panel header='Danh mục Mini App' key='1'>
					<TableDanhMuc />
				</Panel>
				<Panel header='Cấu hình Mini App' key='2'>
					<TableMiniApp />
				</Panel>
			</Collapse>
		</Card>
	);
};

export default MiniAppPage;
