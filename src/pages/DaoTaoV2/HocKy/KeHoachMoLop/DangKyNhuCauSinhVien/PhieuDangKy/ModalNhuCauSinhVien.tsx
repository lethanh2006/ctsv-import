import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormPhieuDangKyNhuCau from './Form';

const ModalNhuCauSinhVien = (props: any) => {
	const { record, edit, setVisibleForm } = useModel('daotaov2.hocky.dangkynhucau');
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
				<Steps.Step title='Thông tin chung' />
				<Steps.Step title='Học phần đăng ký' disabled={!record?._id} />
			</Steps>

			{
				currentStep === 0 ? (
					<FormPhieuDangKyNhuCau afterAddNew={() => setCurrentStep(1)} getData={props.getData} />
				) : null
				// <NhuCauHocPhanPage getDataPhieu={props.getData} />
			}

			{currentStep !== 0 ? (
				<div style={{ textAlign: 'center', marginBottom: 0, marginTop: 18 }}>
					<Button onClick={() => setVisibleForm(false)}>Hoàn thành</Button>
				</div>
			) : null}
		</Card>
	);
};

export default ModalNhuCauSinhVien;
