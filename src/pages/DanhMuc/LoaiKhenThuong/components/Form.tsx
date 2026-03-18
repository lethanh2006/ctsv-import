import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormLoaiKhenThuong = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('danhmuc.loaikhenthuong');
	const title = props?.title ?? '';

	useEffect(() => {
		if (record?._id) form.setFieldsValue(record);
		else form.resetFields();
	}, [record?._id, visibleForm]);

	useEffect(() => {
		if (!visibleForm) form.resetFields();
	}, [visibleForm]);
	const { TextArea } = Input;

	const onFinish = async (values: LoaiKhenThuong.IRecord) => {
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
							label='Tên loại khen thưởng'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Tên loại khen thưởng' />
						</Form.Item>
					</Col>

					{/* <Col span={24} md={12}>
            <Form.Item
              name="soThuTu"
              label="Số thứ tự"
              rules={[...rules.required, ...rules.number(undefined, 1, false)]}
            >
              <InputNumber placeholder="Số thứ tự" style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col> */}
					{/* <Col
						span={24}
						//  md={12}
					>
						<Form.Item name='maLoaiKhenThuongHemis' label='Loại khen thưởng tham khảo'>
							<SelectLoaiKhenThuongHemis hasCreate={false} />
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

export default FormLoaiKhenThuong;
