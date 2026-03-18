import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
const { TextArea } = Input;

const FormTags = () => {
	const intl = useIntl();
	const { setVisibleForm, edit, record, postModel, putModel } = useModel('thongbao.tags');
	const [form] = Form.useForm();
	const handleFinish = async (values: any) => {
		try {
			if (edit) {
				putModel(record?._id, { ...values });
			} else {
				postModel({ ...values });
			}
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		if (edit) {
			form.setFieldsValue({ ...record });
		}
	}, [record, edit]);

	return (
		<Card title={intl.formatMessage({ id: edit ? 'global.title.chinhsua' : 'global.title.themmoi' })}>
			<Form onFinish={handleFinish} form={form} layout={'vertical'}>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'thongbao.tags.form.name.label' })}
							name={'ten'}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'thongbao.tags.form.name.placeholder' })} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'thongbao.tags.form.description.label' })}
							name={'moTa'}
							rules={[...rules.required]}
						>
							<TextArea
								placeholder={intl.formatMessage({ id: 'thongbao.tags.form.description.placeholder' })}
								rows={3}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Form.Item>
								<Button style={{ marginRight: 8 }} htmlType={'submit'} type={'primary'}>
									{intl.formatMessage({ id: 'global.button.luulai' })}
								</Button>
								<Button
									onClick={() => {
										setVisibleForm(false);
									}}
								>
									{intl.formatMessage({ id: 'global.button.dong' })}
								</Button>
							</Form.Item>
						</div>
					</Col>
				</Row>
			</Form>
		</Card>
	);
};
export default FormTags;
