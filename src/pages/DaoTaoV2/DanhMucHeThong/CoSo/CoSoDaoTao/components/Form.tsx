import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCoSoDaoTao = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('daotaov2.danhmuc.cosodaotao');
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: CoSoDaoTao.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item
							name='ten'
							label='Tên cơ sở đào tạo'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập tên cơ sở đào tạo' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='ma' label='Ký hiệu' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
							<Input placeholder='Nhập ký hiệu' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='soDienThoai' label='Số điện thoại' rules={[...rules.required, ...rules.soDienThoai]}>
							<Input placeholder='Nhập số điện thoại' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='diaChi' label='Địa chỉ' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập địa chỉ' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCoSoDaoTao;
