import MyDatePicker from '@/components/MyDatePicker';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory, EApprovalStatus, Evalidation, mapNameApprovalStatus } from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { buildDisabledDateTime, resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Modal, Radio, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalChinhSuaTrangThai = (props: { getData?: () => void }) => {
	const intl = useIntl();
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, putApproveActivityModel, visibleChangeStatus, setVisibleChangeStatus } =
		useModel('cct.activityoutcome');
	const workflow: EApprovalStatus = Form.useWatch('workflow', form);

	useEffect(() => {
		if (!visibleChangeStatus) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				...record,
				workflow: record?.workflow ?? EApprovalStatus.DRAFT,
				dueDate:
					record?.activityCategory === EActivityCategory.REGISTERED
						? dayjs(record?.dueDate || record?.activities?.dueDate || null)
						: record?.dueDate
							? dayjs(record?.dueDate)
							: null,
			});
		}
	}, [record?._id, visibleChangeStatus]);

	const onFinish = async (values: ActivityOutCome.IRecord) => {
		putApproveActivityModel(record?._id ?? '', values, getData).then(() => {
			setVisibleChangeStatus(false);
		});
	};

	return (
		<Modal
			open={visibleChangeStatus}
			onCancel={() => setVisibleChangeStatus(false)}
			title={intl.formatMessage({ id: 'activityresult.xuly.status.title' })}
			footer={null}
			width={600}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Col span={24}>
							<Form.Item
								name='workflow'
								label={intl.formatMessage({ id: 'activityresult.xuly.status' })}
								rules={[...rules.required]}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'activityresult.xuly.status.place' })}
									options={Object.values([
										EApprovalStatus.APPROVED,
										EApprovalStatus.REJECTED,
										EApprovalStatus.CHANGES_REQUIRED,
									]).map((item) => ({
										value: item,
										label: mapNameApprovalStatus[item as EApprovalStatus],
									}))}
								/>
							</Form.Item>
						</Col>
					</Col>

					{workflow === EApprovalStatus.REJECTED && (
						<Col span={24}>
							<Form.Item
								name='activityRejectionNote'
								label={intl.formatMessage({ id: 'activityresult.xuly.activityRejectionNote' })}
								rules={[...rules.required]}
							>
								<Input.TextArea
									rows={3}
									placeholder={intl.formatMessage({ id: 'activityresult.xuly.activityRejectionNote.place' })}
								/>
							</Form.Item>
						</Col>
					)}

					{workflow === EApprovalStatus.CHANGES_REQUIRED && (
						<>
							<Col span={24}>
								<Form.Item
									name='dueDate'
									label={intl.formatMessage({ id: 'activity.info.form.duedate' })}
									rules={
										record?.activityCategory === EActivityCategory.REGISTERED
											? [
													...rules.required,
													...rules.sauThoiDiem(
														dayjs(record?.activities?.endDate),
														intl.formatMessage({ id: 'activity.info.form.endDate' }),
													),
												]
											: [...rules.required]
									}
								>
									<MyDatePicker
										showTime={{ showHour: true, showMinute: true }}
										format='HH:mm DD/MM/YYYY'
										placeholder={intl.formatMessage({ id: 'activity.info.form.duedate.place' })}
										allowClear
										{...buildDisabledDateTime({
											min:
												record?.activityCategory === EActivityCategory.REGISTERED && record?.activities?.endDate
													? dayjs(record?.activities?.endDate)
													: undefined,
										})}
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item
									name='revisionNote'
									label={intl.formatMessage({ id: 'activityresult.xuly.revisionNote' })}
									rules={[...rules.required]}
								>
									<Input.TextArea
										rows={3}
										placeholder={intl.formatMessage({ id: 'activityresult.xuly.revisionNote.place' })}
									/>
								</Form.Item>
							</Col>
						</>
					)}

					{workflow === EApprovalStatus.APPROVED && (
						<Col span={24}>
							<Form.Item name='validation' label={intl.formatMessage({ id: 'activityresult.xuly.impact' })}>
								<Radio.Group>
									<Space direction='vertical'>
										<Radio value={Evalidation.VERIFIED}>
											<div>
												<div>
													<strong>{intl.formatMessage({ id: 'activityresult.xuly.verified' })}</strong>
												</div>
												<div style={{ color: '#666' }}>
													{intl.formatMessage({ id: 'activityresult.xuly.verified.place' })}
												</div>
											</div>
										</Radio>

										<Radio value={Evalidation.ENDORSED}>
											<div>
												<div>
													<strong>{intl.formatMessage({ id: 'activityresult.xuly.endorsed' })}</strong>
												</div>
												<div style={{ color: '#666' }}>
													{intl.formatMessage({ id: 'activityresult.xuly.endorsed.place' })}
												</div>
											</div>
										</Radio>

										<Radio value={Evalidation.FEATURED}>
											<div>
												<div>
													<strong>{intl.formatMessage({ id: 'activityresult.xuly.featured' })}</strong>
												</div>
												<div style={{ color: '#666' }}>
													{intl.formatMessage({ id: 'activityresult.xuly.featured' })}{' '}
												</div>
											</div>
										</Radio>
									</Space>
								</Radio.Group>
							</Form.Item>
						</Col>
					)}
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.xacnhan' })}
					</Button>
					<Button onClick={() => setVisibleChangeStatus(false)}>
						{intl.formatMessage({ id: 'global.button.dong' })}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalChinhSuaTrangThai;
