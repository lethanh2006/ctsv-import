import FormItemUrlOrUpload from '@/components/Upload/FormItemUrlOrUpload';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormVanBanQuyDinh = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, setFormSubmiting, visibleForm } = useModel(
		'daotaov2.danhmuc.vanbanquydinh',
	);
	const title = props?.title ?? '';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: VanBanQuyDinh.IRecord) => {
		if (!!values.url && typeof values.url !== 'string') {
			setFormSubmiting(true);
			await buildUpLoadFile(values, 'url')
				.then((url) => (values.url = url))
				.catch(() => (values.url = null))
				.finally(() => setFormSubmiting(false));
		}
		if (!values.url) return;

		if (edit) putModel(record?._id ?? '', values).catch((er) => console.log(er));
		else postModel(values).catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item name='ma' label='Mã căn cứ' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
							<Input placeholder='Nhập mã căn cứ' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='ten' label='Tên căn cứ' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập tên căn cứ' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='noiDung'
							label='Nội dung'
							rules={[...rules.required, ...rules.text, ...rules.length(5000)]}
						>
							<Input.TextArea rows={3} placeholder='Nhập nội dung' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<FormItemUrlOrUpload form={form} initValue={record?.url} isRequired />
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

export default FormVanBanQuyDinh;
