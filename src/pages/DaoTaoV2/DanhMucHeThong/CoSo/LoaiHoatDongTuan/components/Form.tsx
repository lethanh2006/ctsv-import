import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { Colorpicker } from 'antd-colorpicker';

const FormLoaiHoatDongTuan = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting } = useModel(
		'daotaov2.danhmuc.loaihoatdongtuan',
	);
	const { title } = props;

	useEffect(() => {
		if (record?._id) {
			form.setFieldsValue(record);
			if (!record.maMau) form.setFieldsValue({ maMau: '#000' });
		} else form.resetFields();
	}, [record?._id]);

	const onFinish = async (values: LoaiHoatDongTuan.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getModel)
				.then()
				.catch((er) => console.log(er));
		} else {
			const finalValues = { ...values, active: true };
			postModel(finalValues, getModel)
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item
							name='ten'
							label='Tên loại hoạt động tuần'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập loại hoạt động tuần' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='kyHieu' label='Ký hiệu' rules={[...rules.required, ...rules.text, ...rules.length(5)]}>
							<Input placeholder='Nhập ký hiệu' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='maMau' label='Mã màu'>
							<Colorpicker popup onColorResult={(color) => color.hex} />
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

export default FormLoaiHoatDongTuan;
