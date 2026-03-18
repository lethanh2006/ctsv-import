import rules from '@/utils/rules';
import { Col, Form, InputNumber, Row } from 'antd';

const FormItemSiSo = () => {
	return (
		<Row gutter={[12, 0]}>
			<Col span={24} md={12}>
				<Form.Item name='siSoLopToiThieu' label='Sĩ số lớp tín chỉ tối thiểu' rules={[...rules.number(200, 0, false)]}>
					<InputNumber max={200} min={0} step={1} style={{ width: '100%' }} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name='siSoLopToiDa'
					label='Sĩ số lớp tín chỉ tối đa'
					rules={[...rules.required, ...rules.number(200, 1, false)]}
				>
					<InputNumber max={200} min={1} step={1} style={{ width: '100%' }} />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item
					name='siSoNhomToiThieu'
					label='Sĩ số nhóm thực hành tối thiểu'
					rules={[...rules.number(200, 0, false)]}
				>
					<InputNumber max={200} min={0} step={1} style={{ width: '100%' }} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='siSoNhomToiDa' label='Sĩ số nhóm thực hành tối đa' rules={[...rules.number(200, 0, false)]}>
					<InputNumber max={200} min={0} step={1} style={{ width: '100%' }} />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormItemSiSo;
