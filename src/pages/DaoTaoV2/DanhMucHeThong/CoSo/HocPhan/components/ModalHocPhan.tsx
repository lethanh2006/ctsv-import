import { Card, Steps } from 'antd';
import { useIntl, useModel } from 'umi';
import FormHocPhan from './Form';
import { useEffect, useState } from 'react';
import DeCuongHocPhanPage from '../../DeCuongHocPhan';

const ModalHocPhan = (props: any) => {
	const intl = useIntl();
	const { record, edit } = useModel('daotaov2.hocphan.hocphan');
	const title = props?.title ?? '';
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		setCurrentStep(props.focusDeCuong ? 1 : 0);
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
				<Steps.Step title={intl.formatMessage({ id: 'danhmuchethong.step1' })} />
				<Steps.Step title={intl.formatMessage({ id: 'danhmuchethong.coso.hocphan.step2' })} disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? <FormHocPhan afterAddNew={() => setCurrentStep(1)} /> : <DeCuongHocPhanPage />}
		</Card>
	);
};

export default ModalHocPhan;
