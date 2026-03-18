import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import KhoaNganhPage from '../../KhoaNganh';
import FormKhoaSinhVien from './Form';

const ModalKhoaSinhVien = (props: any) => {
	const intl = useIntl();
	const { record, edit, setVisibleForm } = useModel('daotaov2.namhoc.khoasinhvien');
	const title = props?.title ?? '';
	const [currentStep, setCurrentStep] = useState(0);

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
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
				type='navigation'
			>
				<Steps.Step title={intl.formatMessage({ id: 'namhoc.khoasinhvien.step1' })} />
				<Steps.Step title={intl.formatMessage({ id: 'namhoc.khoasinhvien.step2' })} disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? <FormKhoaSinhVien afterAddNew={() => setCurrentStep(1)} /> : <KhoaNganhPage hideCard />}

			{currentStep !== 0 ? (
				<div style={{ textAlign: 'center', marginBottom: 0, marginTop: 18 }}>
					<Button onClick={() => setVisibleForm(false)}>Hoàn thành</Button>
				</div>
			) : null}
		</Card>
	);
};

export default ModalKhoaSinhVien;
