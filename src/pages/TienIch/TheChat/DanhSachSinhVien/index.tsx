import { Alert, Card, Empty, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ChiSoTheHinhPage from '../ChiSoTheHinh';
import KetQuaTheChatPage from '../Dot/KetQuaTheChat';
import SelectDotTheChat from '../Dot/components/Select';
import StatSinhVienTheChat from './components/Stat';
import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import moment from 'moment';

const DSsinhvienTheChat = () => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record, setRecord, danhSach } = useModel('tienich.thechat.dot');
	const [currentStep, setCurrentStep] = useState<number>(0);
	useEffect(() => {
		setCurrentStep(0);
	}, []);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	const now = moment();
	const start = record?.thoiGianBatDau ? moment(record.thoiGianBatDau) : null;
	const end = record?.thoiGianKetThuc ? moment(record.thoiGianKetThuc) : null;
	const isTrongThoiGian = start && end && now.isAfter(start) && now.isBefore(end);

	return (
		<Card title='Tổng hợp sinh viên thể chất'>
			<div style={{ marginBottom: 12 }}>
				<FilterHocKy isSetHocKy>
					<SelectDotTheChat
						isSetRecord
						style={{ width: 250 }}
						value={record?._id}
						condition={{ maHocKy: recHocKy?.ma }}
						onChange={(val) => setRecord(danhSach?.find((item) => item?._id === val))}
					/>
				</FilterHocKy>
			</div>
			{record?._id ? (
				<>
					<Alert
						showIcon
						message={
							isTrongThoiGian
								? `Đang trong thời gian đánh giá: ${start?.format('DD/MM/YYYY')} - ${end?.format('DD/MM/YYYY')}`
								: `Ngoài thời gian đánh giá: ${start?.format('DD/MM/YYYY')} - ${end?.format('DD/MM/YYYY')}`
						}
						type={isTrongThoiGian ? 'success' : 'warning'}
						style={{ marginBottom: 12 }}
					/>
					<StatSinhVienTheChat />
					<Steps
						current={currentStep}
						type='navigation'
						style={{ marginBottom: 18, paddingTop: 0 }}
						onChange={record?._id ? onChangeStep : undefined}
					>
						<Steps.Step title='Kết quả sinh viên' disabled={!record?._id} />
						<Steps.Step title='Chỉ số hình thể sinh viên' disabled={!record?._id} />
					</Steps>

					{currentStep === 0 ? <KetQuaTheChatPage /> : currentStep === 1 ? <ChiSoTheHinhPage /> : null}
				</>
			) : (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không tồn tại đợt' />
			)}
		</Card>
	);
};

export default DSsinhvienTheChat;
