import { EStatusMyCCT } from '@/services/CCT/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalXuLyMyCCT = (props: { title: string; trangThai: EStatusMyCCT; getData?: () => void }) => {
	const intl = useIntl();
	const { title, trangThai, getData } = props;
	const [form] = Form.useForm();
	const { record, formSubmiting, visibleXuLy, setVisibleXuLy, putApproveMyCCTModel, setVisibleForm } =
		useModel('cct.mycct');

	useEffect(() => {
		if (!visibleXuLy) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				...record,
			});
		}
	}, [record?._id, visibleXuLy]);

	const onFinish = async (values: MyCCT.IRecord) => {
		putApproveMyCCTModel(
			record?._id ?? '',
			{
				...values,
				status: trangThai,
			},
			getData,
			intl.formatMessage({ id: 'global.message.luuthanhcong' }),
		).then(() => {
			setVisibleXuLy(false);
			setVisibleForm(false);
		});
	};

	return (
		<Modal open={visibleXuLy} onCancel={() => setVisibleXuLy(false)} title={title} footer={null} width={600}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<div style={{ fontSize: 48 }} className={trangThai === EStatusMyCCT.APPROVED ? 'text-success' : 'text-warning'}>
					{trangThai === EStatusMyCCT.APPROVED ? <CheckCircleOutlined /> : <WarningOutlined />}
				</div>
				<div>{`${title} !`}</div>
			</div>

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					{trangThai === EStatusMyCCT.CHANGES_REQUIRED && (
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

export default ModalXuLyMyCCT;
