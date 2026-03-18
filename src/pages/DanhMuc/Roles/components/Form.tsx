import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormRoles = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.roles');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				isActive: false,
				autoApproval: true,
			});
		}
	}, [record?._id, visibleForm]);

	useEffect(() => {
		if (!visibleForm) form.resetFields();
	}, [visibleForm]);

	const onFinish = async (values: RolesManagement.IRecord) => {
		if (edit) {
			putModel(
				record?._id ?? '',
				values,
				getData,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'rolesmanagement.form.chinhsua' })
					: isView
						? intl.formatMessage({ id: 'rolesmanagement.form.chitiet' })
						: intl.formatMessage({ id: 'rolesmanagement.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item
							name='code'
							label={intl.formatMessage({ id: 'rolesmanagement.form.id' })}
							rules={[...rules.required, ...rules.text, ...rules.length(10)]}
						>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'rolesmanagement.form.id.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='name'
							label={intl.formatMessage({ id: 'rolesmanagement.form.name' })}
							rules={[...rules.required, ...rules.text, ...rules.length(80)]}
						>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'rolesmanagement.form.name.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='order' label={intl.formatMessage({ id: 'rolesmanagement.form.order' })}>
							<InputNumber
								disabled={isView}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'rolesmanagement.form.order.place' })}
								min={1}
								precision={0}
								step={1}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='isActive'
							label={intl.formatMessage({ id: 'rolesmanagement.form.active' })}
							valuePropName='checked'
						>
							<Switch disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='autoApproval'
							label={intl.formatMessage({ id: 'rolesmanagement.form.auto' })}
							valuePropName='checked'
							extra={intl.formatMessage({ id: 'rolesmanagement.form.auto.place' })}
						>
							<Checkbox disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='description'
							label={intl.formatMessage({ id: 'rolesmanagement.form.des' })}
							rules={[...rules.text, ...rules.length(255)]}
						>
							<Input.TextArea
								disabled={isView}
								rows={3}
								placeholder={intl.formatMessage({ id: 'rolesmanagement.form.des.place' })}
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
						{intl.formatMessage({ id: isView ? 'global.button.dong' : 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormRoles;
