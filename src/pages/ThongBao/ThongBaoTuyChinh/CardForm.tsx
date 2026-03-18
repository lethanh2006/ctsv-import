import ModalExpandable from '@/components/Table/ModalExpandable';
import type { NotificationType } from '@/services/ThongBao/constant';
import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ConfirmThongBaoTuyChinh from './Confirm';
import FormThongBaoTuyChinh from './Form';

const CardFormThongBaoTuyChinh = (props: { getData: () => void; type: NotificationType }) => {
	const intl = useIntl();
	const { getData, type } = props;
	const { visibleThongBaoDanhSach, setVisibleThongBaoDanhSach, recordThongBaoDanhSach } = useModel('thongbao.thongbao');
	const [currentStep, setCurrentStep] = useState<number>(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [recordThongBaoDanhSach?.title]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<ModalExpandable
			title={intl.formatMessage({ id: 'thongbao.cardtuychinh.title' })}
			open={visibleThongBaoDanhSach}
			onCancel={() => setVisibleThongBaoDanhSach(false)}
			footer={null}
			width={900}
		>
			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, paddingTop: 0 }}
				onChange={recordThongBaoDanhSach?.title ? onChangeStep : undefined}
			>
				<Steps.Step title={intl.formatMessage({ id: 'thongbao.cardtuychinh.step.thongtinchung' })} />
				<Steps.Step
					title={intl.formatMessage({ id: 'thongbao.cardtuychinh.step.xacnhanthongbao' })}
					disabled={!recordThongBaoDanhSach?.title}
				/>
			</Steps>

			{currentStep === 0 ? (
				<FormThongBaoTuyChinh afterAddNew={() => setCurrentStep(1)} type={type} />
			) : (
				<ConfirmThongBaoTuyChinh getData={getData} type={type} />
			)}
		</ModalExpandable>
	);
};

export default CardFormThongBaoTuyChinh;
