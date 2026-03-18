import { Card, Tabs } from 'antd';
import CauHinhChung from './components/CauHinhChung';
import CauHinhGiaiThuong from './components/CauHinhGiaiThuong';

const CauHinhVongQuayPage = () => {

	return (
		<Card title='Cấu hình vòng quay'>
			<Tabs>
                <Tabs.TabPane key={1} tab={'Cấu hình chung'}>
                    <CauHinhChung/>
                </Tabs.TabPane>
                <Tabs.TabPane key={2} tab={'Cấu hình giải thưởng'}>
                    <CauHinhGiaiThuong/>
                </Tabs.TabPane>
            </Tabs>
		</Card>
	);
};

export default CauHinhVongQuayPage;
