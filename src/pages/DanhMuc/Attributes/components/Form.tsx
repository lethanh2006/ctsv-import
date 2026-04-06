import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import { ipCCT } from '@/utils/ip';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { Colorpicker } from 'antd-colorpicker';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

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

			const icon = await buildUpLoadFile(values, 'icon', undefined, undefined, ipCCT);
			values.icon = icon;
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
			setFormSubmiting(false);
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
								disabled={isView}
								accept='.png, .jpeg, .jpg'
								buttonDescription={intl.formatMessage({
									id: 'attributesmanagement.form.icon.place',
								})}
								extra={intl.formatMessage({
									id: 'attributesmanagement.form.icon.extra',
								})}
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
