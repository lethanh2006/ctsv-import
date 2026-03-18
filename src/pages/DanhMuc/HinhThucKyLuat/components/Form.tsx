import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectCapKyLuat from '../../CapKyLuat/components/Select';

const FormHinhThucKyLuat = (props: any) => {
	const [form] = Form.useForm();
	// const anhHuongThoiGianKyLuat = useWatch(['anhHuongThoiGianKyLuat'], form);

	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('danhmuc.hinhthuckyluat');
	const title = props?.title ?? '';

	useEffect(() => {
		if (record?._id) form.setFieldsValue(record);
		else form.resetFields();
	}, [record?._id, visibleForm]);
	const { TextArea } = Input;

	useEffect(() => {
		if (!visibleForm) form.resetFields();
	}, [visibleForm]);

	const onFinish = async (values: HinhThucKyLuat.IRecord) => {
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
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
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
							label='Tên hình thức kỷ luật'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Tên hình thức kỷ luật' />
						</Form.Item>
					</Col>

					<Col
						span={24}
						// md={12}
					>
						<Form.Item name='capKyLuatId' label='Cấp kỷ luật' rules={[...rules.required]}>
							<SelectCapKyLuat hasCreate={false} />
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
					{/* <Col span={24} md={12}>
						<Form.Item name='maHinhThucKyLuatHemis' label='Hình thức kỷ luật tham khảo'>
							<SelectHinhThucKyLuatHemis hasCreate={false} />
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

					{/* <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
						<Form.Item name='anhHuongThoiGianKyLuat' valuePropName='checked'>
							<Checkbox>Ảnh hưởng đến thời gian điều chỉnh lương</Checkbox>
						</Form.Item>
					</Col>
					{anhHuongThoiGianKyLuat && (
						<Col span={24}>
							<Form.Item
								name='thoiGianDieuChinh'
								label='Thời gian kéo dài điều chỉnh lương (Tháng)'
								rules={[...rules.required, ...rules.float(Number.MAX_SAFE_INTEGER, 0)]}
							>
								<InputNumber style={{ width: '100%' }} placeholder='Thời gian kéo dài điều chỉnh lương (Tháng)' />
							</Form.Item>
						</Col>
					)} */}
				</Row>

				<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
					<Button loading={formSubmiting} style={{ marginRight: 8 }} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
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

export default FormHinhThucKyLuat;
