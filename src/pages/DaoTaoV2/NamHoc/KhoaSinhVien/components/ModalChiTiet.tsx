import { Button, Card, Modal, Tabs } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import KhoaNganh from '../../KhoaNganh';
import ViewChiTiet from './ViewChiTiet';

const ModalChiTietKhoaSinhVien = (props: {
	visible: boolean;
	setVisible: any;
	maKhoaSinhVien: string;
	hasEdit?: boolean;
}) => {
	const intl = useIntl();
	const { visible, setVisible, maKhoaSinhVien, hasEdit } = props;
	const { getOneModel } = useModel('daotaov2.namhoc.khoasinhvien');

	useEffect(() => {
		if (maKhoaSinhVien) getOneModel({ ma: maKhoaSinhVien });
	}, [maKhoaSinhVien]);

	return (
		<Modal
			footer={<Button onClick={() => setVisible(false)}>Đóng</Button>}
			styles={{ body: { padding: 0 } }}
			width={800}
			open={visible}
			onCancel={() => setVisible(false)}
		>
			<Card bordered={false}>
				<Tabs>
					<Tabs.TabPane tab={intl.formatMessage({ id: 'namhoc.khoasinhvien.tab1' })} key={0}>
						<ViewChiTiet setVisible={setVisible} hasEdit={hasEdit} />
					</Tabs.TabPane>
					<Tabs.TabPane tab={intl.formatMessage({ id: 'namhoc.khoasinhvien.tab2' })} key={1}>
						<KhoaNganh hideCard />
					</Tabs.TabPane>
				</Tabs>
			</Card>
		</Modal>
	);
};

export default ModalChiTietKhoaSinhVien;
