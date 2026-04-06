import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDebounce';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormStudentApprover = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('danhmuc.studentdomain');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				mainApprover: false,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: ActivitiesManagement.IStudentDeclaration) => {
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
					? intl.formatMessage({ id: 'studentapprover.form.chinhsua' })
					: isView
						? intl.formatMessage({ id: 'studentapprover.form.chitiet' })
						: intl.formatMessage({ id: 'studentapprover.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item
							name='ssoId'
							label={intl.formatMessage({ id: 'studentapprover.form.student' })}
							rules={[...rules.required]}
						>
							<SelectNhanSuDebounce
								onChange={(val, option) => {
									const nhanSu = option?.rawData;
									form.setFieldsValue({
										name: nhanSu?.hoTen ? nhanSu?.hoTen : [nhanSu?.hoDem, nhanSu?.ten].filter(Boolean).join(' '),
										email: nhanSu?.emailCanBo ?? nhanSu?.email,
										code: nhanSu?.maCanBo ?? nhanSu?.ma,
									});
								}}
								disabled={isView}
							/>
						</Form.Item>
						<Form.Item name='name' hidden />
						<Form.Item name='email' hidden />
						<Form.Item name='code' hidden />
					</Col>
					<Col span={24}>
						<Form.Item name='mainApprover' label='' valuePropName='checked'>
							<Checkbox disabled={isView}>{intl.formatMessage({ id: 'studentapprover.form.main' })}</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>
						{intl.formatMessage({ id: isView ? 'global.button.dong' : 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormStudentApprover;
