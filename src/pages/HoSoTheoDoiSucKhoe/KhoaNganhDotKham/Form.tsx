import SelectKhoaNganh from '@/pages/DaoTaoV2/NamHoc/KhoaNganh/components/Select';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormKhoaNganhDotKham = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, formSubmiting, postManyKhoaNganhModel, visibleForm } = useModel(
		'hosotheodoisuckhoe.dotkhamkhoanganh',
	);
	const { record: recDotKhaiBao } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
	const { danhSach: danhSachKhaoNganh } = useModel('daotaov2.namhoc.khoanganh');
	const { getData } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const danhSachKhoaNganh = values.maKhoaNganh?.map((item: any) => ({
			maKhoaNganh: item,
			dotKhamSucKhoeId: '',
			tenKhoaNganh: danhSachKhaoNganh.find((items) => items?.ma === item)?.ten,
			maKhoaSinhVien: danhSachKhaoNganh.find((items) => items?.ma === item)?.maKhoaSinhVien,
			maNganh: danhSachKhaoNganh.find((items) => items?.ma === item)?.maNganh,
		}));
		postManyKhoaNganhModel(recDotKhaiBao?._id ?? '', { danhSachKhoaNganh: danhSachKhoaNganh })
			.then(() => getData())
			.catch((err) => console.log(err));
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.chinhsua' })
					: intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.form.dot' })}>
							<Input value={recDotKhaiBao?.ten} disabled />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item
							name='maKhoaNganh'
							label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.form.tennganh' })}
							rules={[...rules.required]}
						>
							<SelectKhoaNganh multiple />
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

export default FormKhoaNganhDotKham;
