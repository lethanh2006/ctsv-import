import { Card, Collapse } from 'antd';
import ChucNang from './components/FormChucNang';

const { Panel } = Collapse;

const AppSlink = () => {
	const onChange = (val: any) => {};
	return (
		<Card title={'App Slink'}>
			<Collapse defaultActiveKey={['1']} onChange={onChange}>
				<Panel header='Chức năng sinh viên' key='1'>
					<ChucNang />
				</Panel>
        <Panel header='Chức năng giảng viên' key='2'>
          <ChucNang />
        </Panel>
			</Collapse>
		</Card>
	);
};

export default AppSlink;
