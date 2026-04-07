import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, message, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectAttributesManagement from '../../Attributes/components/Select';

const FormCompetencyCCAModel = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getData } = props;
	const { record: recCCA } = useModel('danhmuc.activities');
	const { setVisibleForm, visibleForm, edit, postModel, formSubmiting, danhSach } = useModel('danhmuc.ccaattributes');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: ActivitiesManagement.IActivitiesTypeAttributes): Promise<void> => {
		const currentList = danhSach || [];

		if (currentList.length >= 2) {
			message.error(intl.formatMessage({ id: 'activitiesmanagement.attribute.form.error' }));
			return;
		}

		const existedIds = currentList.find((item) => item.attributesId === values.attributesId);

		if (existedIds?._id) {
			message.error(intl.formatMessage({ id: 'activitiesmanagement.attribute.form.error.duplicate' }));
			return;
		}

		postModel(
			{
				...values,
				activitiesTypeId: recCCA?._id,
			},
			getData,
			undefined,
			intl.formatMessage({ id: 'global.message.themmoithanhcong' }),
		)
			.then()
			.catch((err) => console.log(err));
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'activitiesmanagement.attribute.form.chinhsua' })
					: intl.formatMessage({ id: 'activitiesmanagement.attribute.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item
							name='attributesId'
							label={intl.formatMessage({ id: 'activitiesmanagement.attribute.form.attribute' })}
							rules={[...rules.required]}
						>
							<SelectAttributesManagement />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCompetencyCCAModel;
