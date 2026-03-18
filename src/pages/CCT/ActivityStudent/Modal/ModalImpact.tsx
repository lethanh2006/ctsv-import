import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { Evalidation } from '@/services/CCT/constant';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Modal, Radio, Row, Space } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalChinhSuaImpact = (props: { getData?: () => void }) => {
	const intl = useIntl();
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, putModel, visibleImpact, setVisibleImpact } = useModel('cct.activityoutcome');

	useEffect(() => {
		if (!visibleImpact) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				...record,
				validation: record?.validation ?? Evalidation.VERIFIED,
			});
		}
	}, [record?._id, visibleImpact]);

	const onFinish = async (values: ActivityOutCome.IRecord) => {
		putModel(record?._id ?? '', values, getData).then(() => {
			setVisibleImpact(false);
		});
	};

	return (
		<Modal
			open={visibleImpact}
			onCancel={() => setVisibleImpact(false)}
			title={'Verify Impact'}
			footer={null}
			width={600}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Col span={24}>
							<Form.Item name='validation'>
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
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.xacnhan' })}
					</Button>
					<Button onClick={() => setVisibleImpact(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalChinhSuaImpact;
