import { Button, Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import GiangVienDeCuongPage from '../GiangVienDeCuong';
import HocLieuDeCuongPage from '../HocLieuDeCuong';
import LichTrinhCuTheList from '../LichTrinhCuThe';
import FormDeCuong from './FormDeCuong';

const ModalDeCuongHocPhan = (props: any) => {
	const { record, edit, setVisibleForm } = useModel('daotaov2.hocphan.decuonghocphan');
	const { record: recHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const title = props?.title ?? '';
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()} ${recHocPhan?.ma}`}>
			<Steps
				current={currentStep}
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
				progressDot
				size='small'
			>
				<Steps.Step title='Thông tin chung' />
				<Steps.Step title='Giảng viên' disabled={!record?._id} />
				<Steps.Step title='Lịch trình cụ thể' disabled={!record?._id} />
				<Steps.Step title='Học liệu' disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<FormDeCuong afterAddNew={() => setCurrentStep(1)} maHocPhan={props.maHocPhan} />
			) : currentStep === 1 ? (
				<GiangVienDeCuongPage />
			) : currentStep === 2 ? (
				<LichTrinhCuTheList />
			) : currentStep === 3 ? (
				<HocLieuDeCuongPage />
			) : null}

			{currentStep !== 0 && currentStep !== 4 ? (
				<div style={{ textAlign: 'center', marginBottom: 0, marginTop: 18 }}>
					<Button onClick={() => setVisibleForm(false)}>Hoàn thành</Button>
				</div>
			) : null}
		</Card>
	);
};

export default ModalDeCuongHocPhan;
