import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormThemDot = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'daotaov2.sinhvien.dotcapnhathoso',
	);
	const { getData } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DotCapNhatHoSo.IRecord) => {
		if (edit) {
			putModel(
				record?._id ?? '',
				{ ...values, kichHoat: true },
				getData,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(
				{ ...values, kichHoat: true },
				getData,
				undefined,
				intl.formatMessage({ id: 'global.message.themmoithanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'dotcapnhathoso.title.chinhsua' })
					: intl.formatMessage({ id: 'dotcapnhathoso.title.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item
							name='tenDot'
							label={intl.formatMessage({ id: 'dotcapnhathoso.form.tendot' })}
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'dotcapnhathoso.form.tendot.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='thoiGianBatDau'
							label={intl.formatMessage({ id: 'dotcapnhathoso.form.tgbt' })}
							rules={[...rules.required]}
						>
							<MyDatePicker
								format={'HH:mm DD/MM/YYYY'}
								showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
								placeholder={intl.formatMessage({ id: 'dotcapnhathoso.form.tgbt.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='thoiGianKetThuc'
							label={intl.formatMessage({ id: 'dotcapnhathoso.form.tgkt' })}
							rules={[...rules.required]}
						>
							<MyDatePicker
								format={'HH:mm DD/MM/YYYY'}
								showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
								placeholder={intl.formatMessage({ id: 'dotcapnhathoso.form.tgkt.place' })}
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

export default FormThemDot;
