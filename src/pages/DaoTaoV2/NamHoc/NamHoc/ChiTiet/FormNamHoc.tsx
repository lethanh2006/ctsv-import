import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { Col, Divider, Form, Input, InputNumber, Row, type FormInstance } from 'antd';
import { useModel } from 'umi';
import dayjs from 'dayjs';

const FormNamHocDetail = (props: { form: FormInstance }) => {
	const { edit } = useModel('daotaov2.namhoc.namhoc');
	const { form } = props;

	const setTenNamHoc = (thoiGian?: string | null, tuan?: number) => {
		if (!!thoiGian && !!tuan) {
			const start = dayjs(thoiGian);
			const newDate = start.clone().add(tuan, 'week');
			const ten = `Năm học ${start.year()} - ${newDate.year()}`;
			form.setFieldsValue({ ten });
		}
	};

	const onChangeThoiGian = (val: string | null) => setTenNamHoc(val, 52);

	return (
		<>
			<Divider>Thông tin chung</Divider>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={12} md={6}>
					<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
						<MyDatePicker onChange={(val) => onChangeThoiGian(val)} />
					</Form.Item>
				</Col>

				<Col xs={12} md={6}>
					<Form.Item name='ten' label='Tên năm học' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
						<Input placeholder='Nhập tên năm học' />
					</Form.Item>
				</Col>

				<Col span={12} md={6}>
					<Form.Item name='soKyChinh' label='Số kỳ chính' rules={[...rules.number(10, 1), ...rules.required]}>
						<InputNumber min={1} max={10} placeholder='Nhập số kỳ chính' style={{ width: '100%' }} disabled={edit} />
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item name='soKyPhu' label='Số kỳ phụ' rules={[...rules.number(10, 0)]}>
						<InputNumber min={0} max={10} placeholder='Nhập số kỳ phụ' style={{ width: '100%' }} disabled={edit} />
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item name='soTuan' label='Số tuần' rules={[...rules.number(52, 1, false)]}>
						<InputNumber style={{ width: '100%' }} disabled />
					</Form.Item>
				</Col>
			</Row>
		</>
	);
};

export default FormNamHocDetail;
