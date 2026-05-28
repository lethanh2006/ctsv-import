import { unitName } from '@/services/base/constant';
import { Card } from 'antd';
import { useIntl, useModel } from 'umi';
import ThongKeCCT from '../CCT/ThongKe';
import './components/style.less';

const Home = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const roles = initialState?.currentUser?.realm_access?.roles?.map((item) => item);

	const quanTri = ['QUAN_TRI_VIEN', 'CHUYEN_VIEN_CTSV']?.some((role: string) => roles?.includes(role));

	return (
		<>
			<Card styles={{ body: { height: '100%' } }} variant='borderless'>
				<div className='home-welcome'>
					<h1 className='title'>{intl.formatMessage({ id: 'pages.trangchu.title' })}</h1>
					<h2 className='sub-title'>
						{intl.formatMessage({ id: 'pages.trangchu.subtitle' })} –{' '}
						{intl.formatMessage({ id: unitName }).toUpperCase()}
					</h2>
				</div>
			</Card>

			{quanTri && <ThongKeCCT />}
		</>
	);
};

export default Home;
