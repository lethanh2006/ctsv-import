import MyDatePicker from '@/components/MyDatePicker';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory, EApprovalStatus, Evalidation } from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { buildDisabledDateTime, resetFieldsForm } from '@/utils/utils';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Radio, Row, Space } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalXuLyActivityStudent = (props: { title: string; trangThai: EApprovalStatus; getData?: () => void }) => {
	const intl = useIntl();
	const { title, trangThai, getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, putApproveActivityModel, visibleXuLy, setVisibleXuLy, setVisibleForm } =
		useModel('cct.activityoutcome');

	useEffect(() => {
		if (!visibleXuLy) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				...record,
				validation: record?.validation ?? Evalidation?.VERIFIED,
				dueDate:
					record?.activityCategory === EActivityCategory.REGISTERED
						? dayjs(record?.dueDate || record?.activities?.dueDate || null)
						: record?.dueDate
							? dayjs(record?.dueDate)
							: null,
			});
		}
	}, [record?._id, visibleXuLy]);

	const onFinish = async (values: ActivityOutCome.IRecord) => {
		putApproveActivityModel(
			record?._id ?? '',
			{
				...values,
				workflow: trangThai,
			},
			getData,
			intl.formatMessage({ id: 'global.message.luuthanhcong' }),
		).then(() => {
			setVisibleXuLy(false);
			setVisibleForm(false);
		});
	};

	return (
		<Modal
			open={visibleXuLy}
			onCancel={() => setVisibleXuLy(false)}
			title={title}
			footer={null}
			width={600}
			zIndex={1000}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<div
					style={{ fontSize: 48 }}
					className={
						trangThai === EApprovalStatus.APPROVED
							? 'text-success'
							: trangThai === EApprovalStatus.REJECTED
								? 'text-error'
								: 'text-warning'
					}
				>
					{trangThai === EApprovalStatus.APPROVED ? (
						<CheckCircleOutlined />
					) : trangThai === EApprovalStatus.REJECTED ? (
						<CloseCircleOutlined />
					) : (
						<WarningOutlined />
					)}
				</div>
				<div>{`${title} !`}</div>
			</div>

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					{trangThai === EApprovalStatus.REJECTED && (
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

					{trangThai === EApprovalStatus.CHANGES_REQUIRED && (
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

					{trangThai === EApprovalStatus.APPROVED && (
						<Col span={24}>
							<Form.Item
								name='validation'
								label={intl.formatMessage({ id: 'activityresult.xuly.impact' })}
								rules={[...rules.required]}
							>
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
													{intl.formatMessage({ id: 'activityresult.xuly.featured.place' })}
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
					<Button onClick={() => setVisibleXuLy(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalXuLyActivityStudent;
