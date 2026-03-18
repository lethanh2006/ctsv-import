import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import TietHoc from '../../TietHoc';
import FormNhomTietHoc from './Form';

const ModalFormNhomTietHoc = (props: any) => {
	const intl = useIntl();
	const { record, edit } = useModel('daotaov2.danhmuc.nhomtiethoc');
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
				<Steps.Step
					title={intl.formatMessage({ id: 'danhmuchethong.coso.nhomtiethoc.step2' })}
					disabled={!record?._id}
				/>
			</Steps>

			{currentStep === 0 ? <FormNhomTietHoc afterAddNew={() => setCurrentStep(1)} /> : <TietHoc hideCard />}
		</Card>
	);
};

export default ModalFormNhomTietHoc;
