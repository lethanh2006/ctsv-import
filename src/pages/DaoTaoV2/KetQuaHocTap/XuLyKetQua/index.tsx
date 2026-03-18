import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Row, Steps } from 'antd';
import { useState } from 'react';
import DotXetHocVuStep from './DotXetHocVu';
import KetQuaXuLyStep from './KetQuaXuLy';
import SinhVienXuLyStep from './SinhVienXuLy';
import { useIntl, useModel } from 'umi';

const XuLyKetQuaHocTapPage = () => {
	const intl = useIntl();
	const [currentStep, setCurrentStep] = useState(0);
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	return (
		<Card title={intl.formatMessage({ id: 'ketquahoctap.xulyketqua.title' })}>
			<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
				<FilterHocKy isSetHocKy />
			</div>

			{recHocKy?.daChotKqCanhBao && recHocKy?.daChotKqThoiHoc ? (
				<Alert
					showIcon
					type='success'
					description='Đã chốt danh sách cảnh báo học tập và thôi học'
					style={{ marginBottom: 18 }}
				/>
			) : null}

			<Steps
				type='navigation'
				current={currentStep}
				onChange={(step) => setCurrentStep(step)}
				style={{ marginBottom: 18 }}
			>
				<Steps.Step title={intl.formatMessage({ id: 'ketquahoctap.xulyketqua.step1' })} />
				<Steps.Step title={intl.formatMessage({ id: 'ketquahoctap.xulyketqua.step2' })} />
				<Steps.Step title={intl.formatMessage({ id: 'ketquahoctap.xulyketqua.step3' })} />
			</Steps>

			{currentStep === 0 ? (
				<DotXetHocVuStep />
			) : currentStep === 1 ? (
				<SinhVienXuLyStep />
			) : currentStep === 2 ? (
				<KetQuaXuLyStep />
			) : null}

			<Row gutter={12} style={{ marginTop: 18 }}>
				<Col span={12}>
					{currentStep > 0 ? (
						<Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep((step) => step - 1)}>
							Quay lại
						</Button>
					) : null}
				</Col>
				<Col span={12} style={{ textAlign: 'right' }}>
					{currentStep < 2 ? (
						<Button icon={<ArrowRightOutlined />} onClick={() => setCurrentStep((step) => step + 1)}>
							Tiếp theo
						</Button>
					) : null}
				</Col>
			</Row>
		</Card>
	);
};

export default XuLyKetQuaHocTapPage;
