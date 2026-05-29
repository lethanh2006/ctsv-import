import UploadFile from '@/components/Upload/UploadFile';
import { EFileScope, uploadFileManagerMultipart } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Switch } from 'antd';
import { Colorpicker } from 'antd-colorpicker';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const getUploadedFileId = (file: any) => {
	return file?.response?.file?._id ?? file?.response?._id ?? file?.url ?? null;
};

const getUploadErrorMessage = (error: any) =>
	error?.response?.data?.message ??
	error?.response?.data?.detail?.exception?.message ??
	error?.message ??
	'File upload failed. Please try again.';

const uploadActivityFileRequest = async ({ file, onSuccess, onError }: any) => {
	try {
		const response = await uploadFileManagerMultipart({
			file,
			scope: EFileScope.PRIVATE,
			module: 'co-curriculum',
		});

		const fileId = response?.data?.data?.file?._id ?? response?.data?.data?._id;

		if (!fileId) {
			throw new Error('Missing uploaded file id');
		}

		onSuccess?.({ ...response?.data?.data, _id: fileId, fileId }, file);
	} catch (error) {
		message.error(getUploadErrorMessage(error));
		onError?.(error);
	}
};

const getUploadedSingleFileId = (fileValue: any) => {
	if (!fileValue) return null;

	if (typeof fileValue === 'string') return fileValue;

	const fileList = fileValue?.fileList ?? [];
	const file = fileList?.[0];

	if (!file) return null;

	if (file?.status === 'uploading') {
		throw new Error('File is still uploading. Please wait for the upload to complete.');
	}

	if (file?.status === 'error') {
		throw new Error('File upload failed. Please remove the failed file and upload again.');
	}

	const fileId = getUploadedFileId(file);

	if (!fileId) {
		throw new Error('File has not been uploaded successfully. Please upload again.');
	}

	return fileId;
};

const FormAttributes = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, setFormSubmiting, formSubmiting, visibleForm } =
		useModel('danhmuc.attributes');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			return;
		}

		if (record?._id) {
			form.setFieldsValue({
				...record,
				color: record?.color || '#fafafa',
			});
		} else {
			form.setFieldsValue({
				isActive: false,
				color: '#fafafa',
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: AttributesManagement.IRecord) => {
		try {
			setFormSubmiting(true);
			try {
				values.icon = getUploadedSingleFileId(values.icon);
			} catch (error: any) {
				message.error(error?.message);
				setFormSubmiting(false);
				return;
			}
			setFormSubmiting(false);

			values.color = values.color || '#fafafa';

			if (edit) {
				await putModel(
					record?._id ?? '',
					values,
					getData,
					undefined,
					undefined,
					intl.formatMessage({ id: 'global.message.luuthanhcong' }),
				);
			} else {
				await postModel(values, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }));
			}
		} catch (error) {
			console.log(error);
		} finally {
		}
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'attributesmanagement.form.chinhsua' })
					: isView
						? intl.formatMessage({ id: 'attributesmanagement.form.chitiet' })
						: intl.formatMessage({ id: 'attributesmanagement.form.themmoi' })
			}
		>
			<Form
				onFinish={onFinish}
				form={form}
				layout='vertical'
				initialValues={{
					isActive: false,
					color: '#fafafa',
				}}
			>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item
							name='icon'
							label={intl.formatMessage({ id: 'attributesmanagement.form.icon' })}
							rules={[...rules.fileRequired]}
						>
							<UploadFile
								isPrivate
								disabled={isView}
								accept='.png, .jpeg, .jpg'
								buttonDescription={intl.formatMessage({
									id: 'attributesmanagement.form.icon.place',
								})}
								extra={intl.formatMessage({
									id: 'attributesmanagement.form.icon.extra',
								})}
								otherProps={{
									customRequest: uploadActivityFileRequest,
								}}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='color'
							label={intl.formatMessage({ id: 'attributesmanagement.form.color' })}
							rules={[...rules.required]}
							getValueProps={(value) => ({
								value: value || '#fafafa',
							})}
						>
							<Colorpicker disabled={isView} popup onColorResult={(color) => color?.hex || '#fafafa'} />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='code'
							label={intl.formatMessage({ id: 'attributesmanagement.form.id' })}
							rules={[...rules.required, ...rules.text, ...rules.length(10)]}
						>
							<Input
								disabled={isView}
								placeholder={intl.formatMessage({
									id: 'attributesmanagement.form.id.place',
								})}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='name'
							label={intl.formatMessage({ id: 'attributesmanagement.form.name' })}
							rules={[...rules.required, ...rules.text, ...rules.length(80)]}
						>
							<Input
								disabled={isView}
								placeholder={intl.formatMessage({
									id: 'attributesmanagement.form.name.place',
								})}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='order'
							label={intl.formatMessage({ id: 'attributesmanagement.form.order' })}
							rules={[...rules.required]}
						>
							<InputNumber
								disabled={isView}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({
									id: 'attributesmanagement.form.order.place',
								})}
								min={1}
								precision={0}
								step={1}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='isActive'
							label={intl.formatMessage({
								id: 'attributesmanagement.form.active',
							})}
							valuePropName='checked'
						>
							<Switch disabled={isView} />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item
							name='description'
							label={intl.formatMessage({
								id: 'attributesmanagement.form.des',
							})}
							rules={[...rules.text, ...rules.length(255)]}
						>
							<Input.TextArea
								disabled={isView}
								rows={3}
								placeholder={intl.formatMessage({
									id: 'attributesmanagement.form.des.place',
								})}
								showCount
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					{!isView && (
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
					)}
					<Button onClick={() => setVisibleForm(false)}>
						{intl.formatMessage({
							id: isView ? 'global.button.dong' : 'global.button.huy',
						})}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormAttributes;
