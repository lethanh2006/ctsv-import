import { Card, Steps } from 'antd';
import { useIntl, useModel } from 'umi';
import { useEffect, useState } from 'react';
import FormNganhCoSo from './Form';
import ChuyenNganhLocal from '../ChuyenNganh';

const ModalFormNganh = (props: any) => {
	const intl = useIntl();
	const { record, edit } = useModel('daotaov2.danhmuc.nganhdaotao');
	const title = props?.title ?? '';
	const [currentStep, setCurrentStep] = useState<number>(0);

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
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={record?._id ? onChangeStep : undefined}
			>
				<Steps.Step title={intl.formatMessage({ id: 'danhmuchethong.step1' })} />
				<Steps.Step title={intl.formatMessage({ id: 'danhmuchethong.coso.nganh.step2' })} disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? <FormNganhCoSo afterAddNew={() => setCurrentStep(1)} /> : <ChuyenNganhLocal hideCard />}
		</Card>
	);
};

export default ModalFormNganh;
