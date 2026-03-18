import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectActivitiesTypeDomain from '../../CCD/components/Select';
import SelectTrack from '../../Track/components/Select';
import FormItemAttributesCCA from '../Attributes/FormItem';
import AttributesCCAModel from '../AttributesModel';

const FormActivities = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.activities');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				isActive: false,
			});
		}
	}, [record?._id, visibleForm]);

	const normalizeCompetencyAttributesForCreate = (list?: ActivitiesManagement.IActivitiesTypeAttributes[]) =>
		list?.map((item) => ({
			attributesId: item.attributesId,
		}));

	const onFinish = async (values: ActivitiesManagement.IRecord) => {
		if (edit) {
			putModel(
				record?._id ?? '',
				values,
				undefined,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else {
			const payload = {
				...values,
				activitiesTypeAttributesList: normalizeCompetencyAttributesForCreate(values.activitiesTypeAttributesList),
			};

			postModel(payload as any, undefined, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'activitiesmanagement.form.chinhsua' })
					: isView
						? intl.formatMessage({ id: 'activitiesmanagement.form.chitiet' })
						: intl.formatMessage({ id: 'activitiesmanagement.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item
							name='code'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.id' })}
							rules={[...rules.required, ...rules.text, ...rules.length(10)]}
						>
							<Input disabled={isView} placeholder={intl.formatMessage({ id: 'activitiesmanagement.form.id.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='name'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.name' })}
							rules={[...rules.required, ...rules.text, ...rules.length(80)]}
						>
							<Input
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'activitiesmanagement.form.name.place' })}
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<div className='fw500' style={{ marginBottom: 6 }}>
							{intl.formatMessage({ id: 'activitiesmanagement.form.attributes' })}
						</div>
						{record?._id ? (
							<AttributesCCAModel disabled={isView} />
						) : (
							<Form.Item name='activitiesTypeAttributesList'>
								<FormItemAttributesCCA disabled={isView} />
							</Form.Item>
						)}
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='trackId'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.track' })}
							rules={[...rules.required]}
						>
							<SelectTrack disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='activitiesTypeDomainId'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.group' })}
							rules={[...rules.required]}
						>
							<SelectActivitiesTypeDomain disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='order' label={intl.formatMessage({ id: 'activitiesmanagement.form.order' })}>
							<InputNumber
								disabled={isView}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'activitiesmanagement.form.order.place' })}
								min={1}
								precision={0}
								step={1}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='isActive'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.active' })}
							valuePropName='checked'
						>
							<Switch disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='description'
							label={intl.formatMessage({ id: 'activitiesmanagement.form.des' })}
							rules={[...rules.text, ...rules.length(255)]}
						>
							<Input.TextArea
								disabled={isView}
								rows={3}
								placeholder={intl.formatMessage({ id: 'activitiesmanagement.form.des.place' })}
								showCount
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<div className='fw500' style={{ marginBottom: 6 }}>
							{intl.formatMessage({ id: 'activitiesmanagement.form.evidence' })}
						</div>
						<Form.List name='requiredEvidenceList'>
							{(fields, { add, remove }) => (
								<>
									{fields.map((field) => (
										<Form.Item key={field.key} required={false}>
											<Form.Item {...field} rules={[...rules.required, ...rules.text]} noStyle>
												<Input
													placeholder={intl.formatMessage({ id: 'activitiesmanagement.form.evidence.value' })}
													style={{ width: '95%' }}
													disabled={isView}
												/>
											</Form.Item>

											<Button
												icon={<CloseOutlined />}
												type='link'
												danger
												onClick={() => remove(field.name)}
												disabled={isView}
											/>
										</Form.Item>
									))}

									<Form.Item>
										<Button
											type='dashed'
											onClick={() => add('')}
											style={{ width: '100%' }}
											icon={<PlusOutlined />}
											disabled={isView}
										>
											{intl.formatMessage({ id: 'activitiesmanagement.form.evidence.add' })}
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

export default FormActivities;
