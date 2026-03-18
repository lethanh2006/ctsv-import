import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import QuyDinhSoTinChiPage from '../../CauHinhHocKy/QuyDinhSoTinChi';

import ThongTinCauHinhPage from '../../CauHinhHocKy/CauHinh';
import Form from './Form';

const ModalHocKy = (props: any) => {
	const intl = useIntl();
	const { fromNamHoc } = props;
	const { record, edit } = useModel('daotaov2.hocky.hocky');
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} học kỳ`}>
			<Steps
				current={currentStep}
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
				type='navigation'
			>
				<Steps.Step title={intl.formatMessage({ id: 'kyhoc.kyhoc.step1' })} />
				<Steps.Step title={intl.formatMessage({ id: 'kyhoc.kyhoc.step2' })} disabled={!record?._id} />
				<Steps.Step title={intl.formatMessage({ id: 'kyhoc.kyhoc.step3' })} disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? (
				<Form afterAddNew={() => setCurrentStep(1)} fromNamHoc={fromNamHoc} />
			) : currentStep === 2 ? (
				<QuyDinhSoTinChiPage />
			) : (
				<ThongTinCauHinhPage />
			)}
		</Card>
	);
};

export default ModalHocKy;
