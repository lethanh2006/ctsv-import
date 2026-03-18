import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ChiSoTheHinhPage from '../../ChiSoTheHinh';
import KetQuaTheChatPage from '../KetQuaTheChat';
import FormDotTheChat from './Form';

const ModalDotTheChat = (props: any) => {
	const { title, getData } = props;
	const { record, edit } = useModel('tienich.thechat.dot');
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
			>
				<Steps.Step title='Thông tin chung' />
				<Steps.Step title='Kết quả sinh viên' disabled={!record?._id} />
				<Steps.Step title='Chỉ số hình thể sinh viên' disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<FormDotTheChat afterAddNew={() => setCurrentStep(1)} getData={getData} />
			) : currentStep === 1 ? (
				<KetQuaTheChatPage />
			) : currentStep === 2 ? (
				<ChiSoTheHinhPage />
			) : null}
		</Card>
	);
};

export default ModalDotTheChat;
