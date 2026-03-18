import MyDatePicker from '@/components/MyDatePicker';
import FormItemUrlOrUpload from '@/components/Upload/FormItemUrlOrUpload';
import { SaveOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Col, Divider, Form, Input, InputNumber, Row } from 'antd';

const FormTotNghiepVanBang = () => {
	const intl = useIntl();
	const [form] = Form.useForm();

	return (
		<Form layout='vertical'>
			<Button icon={<SaveOutlined />} type='primary' htmlType='submit'>
				{intl.formatMessage({ id: 'sinhvien.totnghiepvb.button.capnhat' })}
			</Button>

			<Divider orientation='center'>
				{intl.formatMessage({ id: 'sinhvien.totnghiepvb.divider.thongtintotnghiep' })}
			</Divider>
			<Row gutter={[12, 0]}>
				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.thoigiantotnghiep' })}>
						<MyDatePicker />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.loaitotnghiep' })}>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.soquyetdinhtotnghiep' })}>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.ngaybanhanhqd' })}>
						<MyDatePicker />
					</Form.Item>
				</Col>
			</Row>

			<Divider orientation='center'>{intl.formatMessage({ id: 'sinhvien.totnghiepvb.divider.thongtinvbang' })}</Divider>
			<Row gutter={[12, 0]}>
				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.manganh' })}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.machuongtrinhdaotao' })}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.tendonvibangcap' })}>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.trinhdodaotao' })}>
						<Input disabled />
					</Form.Item>
				</Col>

				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.namtotnghiep' })}>
						<InputNumber style={{ width: '100%' }} min={2020} max={2300} />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.soqdcongnhantotnghiep' })}>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.soqdthanhlaphoidong' })}>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.ngaybaove' })}>
						<MyDatePicker />
					</Form.Item>
				</Col>

				<Col span={24} md={8}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.tenvanbang' })}>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.sohieuvanbang' })}>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item label={intl.formatMessage({ id: 'sinhvien.totnghiepvb.id.ngaycap' })}>
						<MyDatePicker />
					</Form.Item>
				</Col>

				<Col xs={24}>
					<FormItemUrlOrUpload form={form} accept='.pdf' />
				</Col>
			</Row>
		</Form>
	);
};

export default FormTotNghiepVanBang;
