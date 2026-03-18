import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormDotDangKyNhuCau from './Form';
import KhoaNganhDotDangKyNhuCauPage from './KhoaNganhDotDangKyNhuCau';
import SinhVienDotDangKyNhuCauPage from './SinhVienDotDangKyNhuCau';

const ModalDotDangKyNhuCau = (props: any) => {
	const { record, edit, setVisibleForm } = useModel('daotaov2.hocky.dotdangkynhucau');
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
				<Steps.Step title='Khóa ngành' disabled={!record?._id} />
				<Steps.Step title='Phạm vi đăng ký' disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<FormDotDangKyNhuCau afterAddNew={() => setCurrentStep(1)} />
			) : currentStep === 1 ? (
				<KhoaNganhDotDangKyNhuCauPage />
			) : (
				<SinhVienDotDangKyNhuCauPage />
			)}

			{currentStep !== 0 ? (
				<div style={{ textAlign: 'center', marginBottom: 0, marginTop: 18 }}>
					<Button onClick={() => setVisibleForm(false)}>Hoàn thành</Button>
				</div>
			) : null}
		</Card>
	);
};

export default ModalDotDangKyNhuCau;
