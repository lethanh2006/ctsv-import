import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLoaiKhenThuong from '../../LoaiKhenThuong/components/Select';

const FormHinhThucKhenThuong = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	// const anhHuongThoiGianKhenThuong = useWatch(['anhHuongThoiGianKhenThuong'], form);

	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('danhmuc.hinhthuckhenthuong');
	const title = props?.title ?? '';

	useEffect(() => {
		if (record?._id) form.setFieldsValue(record);
		else form.resetFields();
	}, [record?._id, visibleForm]);
	const { TextArea } = Input;

	useEffect(() => {
		if (!visibleForm) form.resetFields();
	}, [visibleForm]);

	const onFinish = async (values: HinhThucKhenThuong.IRecord) => {
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
		<Card
			title={intl.formatMessage({ id: edit ? 'global.title.chinhsua' : 'global.title.themmoi' }) + title?.toLowerCase()}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={12}>
						<Form.Item
							name='ma'
							label={intl.formatMessage({ id: 'chinhsach.formhinhthuckhenthuong.id.ma' })}
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'chinhsach.formhinhthuckhenthuong.id.ma' })} />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='ten'
							label={intl.formatMessage({ id: 'chinhsach.formhinhthuckhenthuong.id.ten' })}
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'chinhsach.formhinhthuckhenthuong.id.ten' })} />
						</Form.Item>
					</Col>

					<Col
						span={24}
						// md={12}
					>
						<Form.Item
							name='loaiKhenThuongId'
							label={intl.formatMessage({ id: 'chinhsach.formhinhthuckhenthuong.id.loaikhenthuong' })}
							rules={[...rules.required]}
						>
							<SelectLoaiKhenThuong hasCreate={false} />
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
						<Form.Item name='maHinhThucKhenThuongHemis' label='Hình thức khen thưởng tham khảo'>
							<SelectHinhThucKhenThuonghemis hasCreate={false} />
						</Form.Item>
					</Col> */}

					<Col span={24} md={24}>
						<Form.Item
							name='moTa'
							label={intl.formatMessage({ id: 'chinhsach.formhinhthuckhenthuong.id.mota' })}
							rules={[...rules.text, ...rules.length(550)]}
						>
							<TextArea placeholder={intl.formatMessage({ id: 'chinhsach.formhinhthuckhenthuong.id.mota' })} />
						</Form.Item>
					</Col>

					{/* <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
						<Form.Item name='anhHuongThoiGianKhenThuong' valuePropName='checked'>
							<Checkbox>Ảnh hưởng đến thời gian điều chỉnh lương</Checkbox>
						</Form.Item>
					</Col>
					{anhHuongThoiGianKhenThuong && (
						<Col span={24}>
							<Form.Item
								name='thoiGianDieuChinh'
								label='Thời gian điều chỉnh lương trước hạn (Tháng)'
								rules={[...rules.required, ...rules.float(Number.MAX_SAFE_INTEGER, 0)]}
							>
								<InputNumber style={{ width: '100%' }} placeholder='Thời gian điều chỉnh lương trước hạn (Tháng)' />
							</Form.Item>
						</Col>
					)} */}
				</Row>

				<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
					<Button loading={formSubmiting} style={{ marginRight: 8 }} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: edit ? 'global.button.luulai' : 'global.button.themmoi' })}
					</Button>
					<Button
						onClick={() => {
							setVisibleForm(false);
							form.resetFields();
						}}
					>
						{intl.formatMessage({ id: 'global.button.dong' })}
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default FormHinhThucKhenThuong;
