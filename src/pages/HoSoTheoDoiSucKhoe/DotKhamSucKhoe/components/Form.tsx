import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDotKhamSucKhoe = (props: { afterAddNew?: (rec: any) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		getModel,
		formSubmiting,
		setRecord,
		setEdit,
		visibleForm,
	} = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const thoiGianBatDau = Form.useWatch('thoiGianBatDau', form);
	const { afterAddNew } = props;

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	const resetFields = () => {
		resetFieldsForm(form);
	};

	useEffect(() => {
		if (!visibleForm) resetFields();
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const data = { ...values, maHocKy: recHocKy?.ma, tenHocKy: recHocKy?.ten };
		if (edit) {
			putModel(
				record?._id ?? '',
				data,
				getData,
				undefined,
				false,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(data, getData, false, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.thongtinchung.form.hocky' })}>
						<Input disabled value={recHocKy?.ten} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='ten'
						label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.thongtinchung.form.tendot' })}
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'dotkhamsuckhoe.step.thongtinchung.form.tendot.place' })} />
					</Form.Item>
				</Col>

				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianBatDau'
						label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.thongtinchung.form.tgbd' })}
						rules={[...rules.required]}
					>
						<MyDatePicker
							onChange={(val) => {
								form.validateFields(['thoiGianKetThuc']);
							}}
							format='DD/MM/YYYY'
							showTime
							placeholder={intl.formatMessage({ id: 'dotkhamsuckhoe.step.thongtinchung.form.tgbd.place' })}
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianKetThuc'
						label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.thongtinchung.form.tgkt' })}
						rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'Thời gian bắt đầu')]}
					>
						<MyDatePicker
							format='DD/MM/YYYY'
							showTime
							disabledDate={(cur) => dayjs(cur).isBefore(thoiGianBatDau)}
							placeholder={intl.formatMessage({ id: 'dotkhamsuckhoe.step.thongtinchung.form.tgkt.place' })}
						/>
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
	);
};

export default FormDotKhamSucKhoe;
