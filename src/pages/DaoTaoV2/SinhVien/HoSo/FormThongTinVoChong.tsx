import rules from '@/utils/rules';
import { Col, Form, Input, Row } from 'antd';

const FormThongTinVoChong = () => {
	return (
		<Row gutter={[12, 0]}>
			<Col span={12} md={8}>
				<Form.Item name='tenVoChong' label='Họ tên' rules={[...rules.text, ...rules.length(250)]}>
					<Input placeholder='Nhập họ tên vợ/chồng' />
				</Form.Item>
			</Col>
			<Col span={12} md={8}>
				<Form.Item name='soDienThoaiVoChong' label='SĐT' rules={[...rules.soDienThoai]}>
					<Input placeholder='Nhập số điện thoại' />
				</Form.Item>
			</Col>
			<Col span={12} md={8}>
				<Form.Item name='emailVoChong' label='Email' rules={[...rules.email]}>
					<Input placeholder='Nhập Email' />
				</Form.Item>
			</Col>
			<Col span={12} md={12}>
				<Form.Item name='ngheNghiepVoChong' label='Nghề nghiệp' rules={[...rules.text, ...rules.length(250)]}>
					<Input placeholder='Nhập nghề nghiệp' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='diaChiVoChong' label='Địa chỉ' rules={[...rules.text, ...rules.length(250)]}>
					<Input placeholder='Nhập địa chỉ vợ/chồng' />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormThongTinVoChong;
