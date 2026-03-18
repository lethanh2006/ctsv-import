import rules from '@/utils/rules';
import { Button, Card, Col, Form, Row, InputNumber, message } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import MyDatePicker from '@/components/MyDatePicker';
import dayjs from 'dayjs';
import { resetFieldsForm } from '@/utils/utils';

const FormTietHoc = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('daotaov2.danhmuc.tiethoc');
	const { record: recNhomTietHoc } = useModel('daotaov2.danhmuc.nhomtiethoc');
	const { title } = props;

	const getData = () => getModel({ maNhomTietHoc: recNhomTietHoc?.ma });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (dayjs(values.timeKetThuc).diff(dayjs(values.timeBatDau), 'minutes') <= 0) {
			message.error('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!');
			return;
		}
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			const valuesFinal = { ...values, maNhomTietHoc: recNhomTietHoc?.ma };
			postModel(valuesFinal, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item name='tietHoc' label='Tiết học' rules={[...rules.required, ...rules.number(15, 1)]}>
							<InputNumber min={1} max={30} placeholder='Nhập tiết học' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='timeBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
							<MyDatePicker
								pickerStyle='time'
								format='HH:mm'
								placeholder='Chọn thời gian bắt đầu'
								showTime={{ minuteStep: 5 }}
								saveFormat='HH:mm'
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='timeKetThuc' label='Thời gian kết thúc' rules={[...rules.required]}>
							<MyDatePicker
								pickerStyle='time'
								placeholder='Chọn thời gian kết thúc'
								format='HH:mm'
								showTime={{ minuteStep: 5 }}
								saveFormat='HH:mm'
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
		</Card>
	);
};

export default FormTietHoc;
