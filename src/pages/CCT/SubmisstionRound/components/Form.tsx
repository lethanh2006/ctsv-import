import MyDatePicker from '@/components/MyDatePicker';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { buildDisabledDateTime, resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { getActivityMeta } from '..';

const FormSubmisstionRound = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record: recHocKy, danhSach: dsHocKy } = useModel('daotaov2.hocky.hocky');
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('cct.submissionround');
	const startDate: Date = Form.useWatch('startDate', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		} else if (!record?._id && recHocKy?._id) {
			form.setFieldsValue({
				semesterCode: recHocKy?.ma,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: SubmisstionRound.IRecord) => {
		values.semesterName = dsHocKy?.find((item) => item?.ma === values?.semesterCode)?.ten ?? '';

		try {
			if (edit) {
				await putModel(
					record?._id ?? '',
					values,
					getData,
					undefined,
					undefined,
					intl.formatMessage({ id: 'global.message.luuthanhcong' }),
				);
			} else {
				await postModel(values, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }));
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={24} md={12}>
					<Form.Item
						name='semesterCode'
						label={intl.formatMessage({ id: 'submisstion.form.hocky' })}
						rules={[...rules.required]}
					>
						<SelectHocKy disabled={isView} selectMa placeHolder='Select Semester' />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='roundName'
						label={intl.formatMessage({ id: 'submisstion.form.name' })}
						rules={[...rules.required, ...rules.text, ...rules.length(80)]}
					>
						<Input disabled={isView} placeholder={intl.formatMessage({ id: 'submisstion.form.name.place' })} />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item
						name='startDate'
						label={intl.formatMessage({ id: 'activity.info.form.startDate' })}
						rules={[...rules.required, ...rules.sauThoiDiem(dayjs(), 'Past')]}
					>
						<MyDatePicker
							showTime={{ showHour: true, showMinute: true }}
							format='HH:mm DD/MM/YYYY'
							disabled={isView || (edit && record?._id && getActivityMeta(record).status === 'Ongoing')}
							placeholder={intl.formatMessage({ id: 'activity.info.form.startDate.place' })}
							allowClear
							{...buildDisabledDateTime({
								min: dayjs(),
							})}
							onChange={() => form.resetFields(['endDate'])}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='endDate'
						label={intl.formatMessage({ id: 'activity.info.form.endDate' })}
						rules={[
							...rules.required,
							...rules.sauThoiDiem(dayjs(), 'Past'),
							...rules.sauThoiDiem(dayjs(startDate), intl.formatMessage({ id: 'activity.info.form.startDate' })),
						]}
					>
						<MyDatePicker
							showTime={{ showHour: true, showMinute: true }}
							format='HH:mm DD/MM/YYYY'
							disabled={isView}
							placeholder={intl.formatMessage({ id: 'activity.info.form.endDate.place' })}
							allowClear
							{...buildDisabledDateTime({
								min: startDate ? dayjs(startDate) : dayjs(),
							})}
							onChange={(val) => form.setFieldValue('dueDate', dayjs(val).add(10, 'day'))}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='note'
						label={intl.formatMessage({ id: 'submisstion.form.note' })}
						rules={[...rules.text, ...rules.length(255)]}
					>
						<Input.TextArea
							disabled={isView}
							rows={3}
							placeholder={intl.formatMessage({ id: 'submisstion.form.note.place' })}
							showCount
						/>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				{!isView && (
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
				)}
				<Button onClick={() => setVisibleForm(false)}>
					{intl.formatMessage({
						id: isView ? 'global.button.dong' : 'global.button.huy',
					})}
				</Button>
			</div>
		</Form>
	);
};

export default FormSubmisstionRound;
