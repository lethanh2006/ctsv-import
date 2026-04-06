import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCompetency = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.competency');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				isActive: false,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: Competency.IRecord) => {
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
		} else {
			const payload = {
				...values,
			};

			postModel(payload as any, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'competency.form.chinhsua' })
					: isView
						? intl.formatMessage({ id: 'competency.form.chitiet' })
						: intl.formatMessage({ id: 'competency.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item
							name='code'
							label={intl.formatMessage({ id: 'competency.form.id' })}
							rules={[...rules.required, ...rules.text, ...rules.length(10)]}
						>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'competency.form.id.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='name'
							label={intl.formatMessage({ id: 'competency.form.name' })}
							rules={[...rules.required, ...rules.text, ...rules.length(80)]}
						>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'competency.form.name.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='order' label={intl.formatMessage({ id: 'competency.form.order' })}>
							<InputNumber
								disabled={isView}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'competency.form.order.place' })}
								min={1}
								precision={0}
								step={1}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='isActive'
							label={intl.formatMessage({ id: 'competency.form.active' })}
							valuePropName='checked'
						>
							<Switch disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='description'
							label={intl.formatMessage({ id: 'competency.form.des' })}
							rules={[...rules.text, ...rules.length(255)]}
						>
							<Input.TextArea
								disabled={isView}
								rows={3}
								placeholder={intl.formatMessage({ id: 'competency.form.des.place' })}
								showCount
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<div className='fw500' style={{ marginBottom: 6 }}>
							{intl.formatMessage({ id: 'competency.form.typical' })}
						</div>
						<Form.List name='typicalActivityList'>
							{(fields, { add, remove }) => (
								<>
									{fields.map((field) => (
										<Form.Item key={field.key} required={false}>
											<Form.Item {...field} rules={[...rules.required, ...rules.text]} noStyle>
												<Input
													placeholder={intl.formatMessage({ id: 'competency.form.typical.value' })}
													style={{ width: '95%' }}
													disabled={isView}
												/>
											</Form.Item>

											<Button
												disabled={isView}
												icon={<CloseOutlined />}
												type='link'
												danger
												onClick={() => remove(field.name)}
											/>
										</Form.Item>
									))}

									<Form.Item>
										<Button
											disabled={isView}
											type='dashed'
											onClick={() => add('')}
											style={{ width: '100%' }}
											icon={<PlusOutlined />}
										>
											{intl.formatMessage({ id: 'competency.form.typical.add' })}
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
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

export default FormCompetency;
