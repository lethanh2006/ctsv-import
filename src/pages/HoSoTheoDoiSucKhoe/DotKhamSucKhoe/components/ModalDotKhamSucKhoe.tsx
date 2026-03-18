import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import KhoaNganhDotKhaiBaoPage from '../../KhoaNganhDotKham';
import SinhVienDotKhaiBaoPage from '../../SinhVienDotKham';
import FormDotKhamSucKhoe from './Form';

const ModalDotKhamSucKhoe = () => {
	const intl = useIntl();
	const { record, edit, setVisibleForm } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'dotkhamsuckhoe.title.themmoi' })
					: intl.formatMessage({ id: 'dotkhamsuckhoe.title.chinhsua' })
			}
		>
			<Steps
				current={currentStep}
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
				type='navigation'
			>
				<Steps.Step title={intl.formatMessage({ id: 'dotkhamsuckhoe.step.thongtinchung' })} />
				<Steps.Step title={intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh' })} disabled={!record?._id} />
				<Steps.Step title={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv' })} disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<FormDotKhamSucKhoe afterAddNew={() => setCurrentStep(1)} />
			) : currentStep === 1 ? (
				<KhoaNganhDotKhaiBaoPage />
			) : (
				<SinhVienDotKhaiBaoPage />
			)}

			{currentStep !== 0 ? (
				<div style={{ textAlign: 'center', marginBottom: 0, marginTop: 18 }}>
					<Button type='primary' onClick={() => setVisibleForm(false)}>
						{intl.formatMessage({ id: 'dotkhamsuckhoe.button.hoanthanh' })}
					</Button>
				</div>
			) : null}
		</Card>
	);
};

export default ModalDotKhamSucKhoe;
