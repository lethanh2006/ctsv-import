import { Card, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import KhoiHocPhanCTDTList from '../KhoiHocPhanCTDT';
import FormChuongTrinhDaoTao from './Form';

const ModalChuongTrinh = (props: { isKeHoach?: boolean; title?: string; [key: string]: any }) => {
	const { isKeHoach, title = '' } = props;
	const intl = useIntl();
	const { record, edit } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		setCurrentStep(isKeHoach ? 1 : 0);
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
					title={intl.formatMessage({ id: 'danhmuchethong.coso.chuongtrinhdaotao.step2' })}
					disabled={!record?._id}
				/>
			</Steps>

			{currentStep === 0 ? (
				<FormChuongTrinhDaoTao afterAddNew={() => setCurrentStep(1)} isKeHoach={isKeHoach} />
			) : (
				<KhoiHocPhanCTDTList isKeHoach={isKeHoach} />
			)}
		</Card>
	);
};

export default ModalChuongTrinh;
