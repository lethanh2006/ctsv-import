import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormSvLopHanhChinh = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postManyModel, putModel, formSubmiting, visibleForm } = useModel(
		'daotaov2.namhoc.sinhvienlophanhchinh',
	);
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');
	const { getData } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
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
			postManyModel(
				{ ...values, lopHanhChinhId: recLopHanhChinh?._id ?? '' },
				getData,
				undefined,
				intl.formatMessage({ id: 'global.message.themmoithanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'lophanhchinh.step.dssv.chinhsua' })
					: intl.formatMessage({ id: 'lophanhchinh.step.dssv.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label={intl.formatMessage({ id: 'lophanhchinh.step.dssv.form.tenlop' })}>
							<Input value={recLopHanhChinh?.ten} disabled />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='sinhVienSsoIds'
							label={intl.formatMessage({ id: 'lophanhchinh.step.dssv.form.sv' })}
							rules={[...rules.required]}
						>
							<SelectSinhVienDebounce multiple />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormSvLopHanhChinh;
