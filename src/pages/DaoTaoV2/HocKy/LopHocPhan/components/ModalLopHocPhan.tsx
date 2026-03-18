import { ELoaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Steps, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import NhanSuLopHocPhan from '../../NhanSuLopHocPhan';
import SinhVienLopHocPhan from '../../SvLopHocPhan';
import TableThoiKhoaBieu from '../../ThoiKhoaBieu/ThoiKhoaBieuView';
import FormLopHocPhan from './Form';

const ModalLopHocPhan = () => {
	const { record, edit, setRecord, setVisibleForm } = useModel('daotaov2.hocky.lophocphan');
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
				<>
					{edit && record?.loai === ELoaiLopHocPhan.THUC_HANH && record.parent?._id ? (
						<Tooltip title='Trở về lớp tín chỉ'>
							<Button
								icon={<ArrowLeftOutlined />}
								type='text'
								style={{ marginRight: 8 }}
								onClick={() => setRecord(record.parent)}
							/>
						</Tooltip>
					) : null}
					{edit ? 'Chỉnh sửa' : 'Thêm mới'}{' '}
					{record?.loai === ELoaiLopHocPhan.THUC_HANH ? 'nhóm lớp thực hành' : 'lớp tín chỉ'}
				</>
			}
		>
			<Steps
				current={currentStep}
				progressDot
				size='small'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
			>
				<Steps.Step title='Thông tin chung' />
				<Steps.Step title='Lịch học' disabled={!record?._id} />
				<Steps.Step title='Giảng viên' disabled={!record?._id} />
				{/* <Steps.Step title="DS phiếu đăng ký" disabled={!record?._id} /> */}
				<Steps.Step title='DS sinh viên' disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<FormLopHocPhan afterAddNew={() => setCurrentStep(1)} />
			) : currentStep === 1 ? (
				<TableThoiKhoaBieu fromLopHP />
			) : currentStep === 2 ? (
				<NhanSuLopHocPhan />
			) : currentStep === 3 ? (
				<SinhVienLopHocPhan />
			) : // <LopThucHanhPage />
			// currentStep === 4 ? null :
			null}

			{currentStep !== 0 ? (
				<div className='form-footer'>
					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			) : null}
		</Card>
	);
};

export default ModalLopHocPhan;
