import { Modal, Tabs } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import KyLuatPage from '.';

const ModalKyLuat = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const [activeKey, setActiveKey] = useState('1');

	return (
		<Modal title='Sinh viên bị kỷ luật' open={visible} footer={null} width={1000} onCancel={() => setVisible(false)}>
			<Tabs activeKey={activeKey} onChange={(val) => setActiveKey(val)}>
				<Tabs.TabPane key='1' tab={intl.formatMessage({ id: 'ketquahoctap.xulyketqua.kyluat.thiho' })} />
				<Tabs.TabPane key='2' tab={intl.formatMessage({ id: 'ketquahoctap.xulyketqua.kyluat.nohocphi' })} />
			</Tabs>

			<KyLuatPage type={activeKey === '1' ? 'thi-ho' : 'no-hoc-phi'} />
		</Modal>
	);
};

export default ModalKyLuat;
