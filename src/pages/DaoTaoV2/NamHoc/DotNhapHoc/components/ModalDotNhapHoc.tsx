import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SinhVienDotNhapHocPage from '../SinhVienDotNhapHoc';
import FormLopHanhChinh from './Form';

const ModalDotNhapHoc = (props: any) => {
	const intl = useIntl();
	const { record, edit } = useModel('daotaov2.namhoc.dotnhaphoc');
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
				<Steps.Step title={intl.formatMessage({ id: 'namhoc.namhoc.step1' })} />
				<Steps.Step title={intl.formatMessage({ id: 'namhoc.lophanhchinh.tab2' })} disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<FormLopHanhChinh afterAddNew={() => setCurrentStep(1)} />
			) : currentStep === 1 ? (
				<SinhVienDotNhapHocPage />
			) : null}
		</Card>
	);
};

export default ModalDotNhapHoc;
