import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCapKyLuat = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('danhmuc.capkyluat');
	const title = props?.title ?? '';

	useEffect(() => {
		if (record?._id) form.setFieldsValue(record);
		else form.resetFields();
	}, [record?._id, visibleForm]);
	const { TextArea } = Input;

	useEffect(() => {
		if (!visibleForm) form.resetFields();
	}, [visibleForm]);

	const onFinish = async (values: CapKyLuat.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getModel)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, getModel)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={12}>
						<Form.Item name='ma' label='Mã nội bộ' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
							<Input placeholder='Mã nội bộ' />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='ten'
							label='Tên cấp kỷ luật'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Tên cấp kỷ luật' />
						</Form.Item>
					</Col>

					{/* <Col span={24} md={12}>
            <Form.Item
              name="soThuTu"
              label="Số thứ tự"
              rules={[...rules.required, ...rules.number(undefined, 1, false)]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Số thứ tự" min={1} />
            </Form.Item>
          </Col> */}
					{/* <Col
						span={24}
						// md={12}
					>
						<Form.Item name='maCapKyLuatHemis' label='Cấp kỷ luật tham khảo'>
							<SelectCapKyLuatHeMis hasCreate={false} />
						</Form.Item>
					</Col> */}

					<Col span={24} md={24}>
						<Form.Item name='moTa' label='Mô tả' rules={[...rules.text, ...rules.length(550)]}>
							<TextArea placeholder='Mô tả' />
						</Form.Item>
					</Col>

					{/* <Col span={24} md={12} style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item name="suDung" valuePropName="checked" initialValue={true}>
              <Checkbox>Sử dụng</Checkbox>
            </Form.Item>
          </Col> */}
				</Row>

				<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
					<Button loading={formSubmiting} style={{ marginRight: 8 }} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button
						onClick={() => {
							setVisibleForm(false);
							form.resetFields();
						}}
					>
						Đóng
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default FormCapKyLuat;
