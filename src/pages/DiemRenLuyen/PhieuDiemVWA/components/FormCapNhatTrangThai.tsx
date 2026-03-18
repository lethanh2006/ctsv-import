import { ETrangThaiChamDiem, MapKeyNameTrangThaiChamDiem } from '@/services/DiemRenLuyen/constants';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Row, Select } from 'antd';
import { useIntl, useModel } from 'umi';

const FormCapNhatTrangThai = (props: { onCancel: any; getData: any }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { loading, doiTrangThaiPhieuDiemModel, condition } = useModel('diemrenluyen.phieudiem');
	const onFinish = async (values: any) => {
		if (!condition?.dotDrlId) return;
		await doiTrangThaiPhieuDiemModel(condition.dotDrlId, values?.trangThaiCu, values?.trangThaiMoi, props.getData);
		props.onCancel();
	};

	return (
		<Card title={intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.formtrangthai.title' })}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col md={12}>
						<Form.Item
							name='trangThaiCu'
							label={intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.formtrangthai.trangthaicu' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.formtrangthai.trangthaicu' })}
								options={Object.values(ETrangThaiChamDiem).map((item) => ({
									value: item,
									label: MapKeyNameTrangThaiChamDiem[item],
								}))}
							/>
						</Form.Item>
					</Col>
					<Col md={12}>
						<Form.Item
							name='trangThaiMoi'
							label={intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.formtrangthai.trangthaimoi' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.formtrangthai.trangthaimoi' })}
								options={Object.values(ETrangThaiChamDiem).map((item) => ({
									value: item,
									label: MapKeyNameTrangThaiChamDiem[item],
								}))}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
					<Button loading={loading} style={{ marginRight: 8 }} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button
						onClick={() => {
							props.onCancel();
						}}
					>
						{intl.formatMessage({ id: 'global.button.dong' })}
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default FormCapNhatTrangThai;
