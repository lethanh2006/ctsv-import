import HocKyPage from '@/pages/DaoTaoV2/HocKy/HocKy';
import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import KeHoachNamHocPage from '../../KeHoachNamHoc';
import FormNamHoc from './Form';

const ModalNamHoc = (props: any) => {
	const intl = useIntl();
	const { record, edit, setVisibleForm } = useModel('daotaov2.namhoc.namhoc');
	const [currentStep, setCurrentStep] = useState(1);

	useEffect(() => {
		setCurrentStep(1);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} năm học`}>
			<Steps
				current={currentStep}
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
				type='navigation'
			>
				<Steps.Step title={intl.formatMessage({ id: 'namhoc.namhoc.step1' })} />
				<Steps.Step title={intl.formatMessage({ id: 'namhoc.namhoc.step2' })} disabled={!record?._id} />
				{/* <Steps.Step title={intl.formatMessage({ id: 'namhoc.namhoc.step3' })} disabled={!record?._id} /> */}
			</Steps>

			{currentStep === 0 ? (
				<FormNamHoc afterAddNew={() => setCurrentStep(1)} />
			) : currentStep === 2 ? (
				<HocKyPage fromNamHoc />
			) : (
				<KeHoachNamHocPage hideSelect />
			)}

			{currentStep !== 0 ? (
				<div style={{ textAlign: 'center', marginBottom: 0, marginTop: 18 }}>
					<Button onClick={() => setVisibleForm(false)}>Hoàn thành</Button>
				</div>
			) : null}
		</Card>
	);
};

export default ModalNamHoc;
