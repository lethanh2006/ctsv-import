import ViewDetailDiemRenLuyen from '@/pages/DiemRenLuyen/BieuMau/components/FormViewDetailDiemRenLuyen';
import ThongTinChung from '@/pages/DiemRenLuyen/Dot/components/ThongTinChung';
import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
const { Step } = Steps;

const ViewChiTiet = () => {
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('diemrenluyen.dot');
	const { getByIdModel } = useModel('khaosat.bieumau');
	const [current, setCurrent] = useState<number>(0);

	useEffect(() => {
		if (record?.idBieuMau) getByIdModel(record?.idBieuMau, true);
	}, [record]);

	return (
		<Card title={intl.formatMessage({ id: 'diemrenluyen.dot.chitiet.title' })}>
			<Steps type={'navigation'} current={current} onChange={(val) => setCurrent(val)} style={{ marginBottom: 16 }}>
				<Step title={intl.formatMessage({ id: 'diemrenluyen.dot.chitiet.thongtinchung' })} />
				<Step title={intl.formatMessage({ id: 'diemrenluyen.dot.chitiet.bieumau' })} />
			</Steps>
			{current === 0 && <ThongTinChung />}
			{current === 1 && <ViewDetailDiemRenLuyen hideClose hideCard={true} />}
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};
export default ViewChiTiet;
