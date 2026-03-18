import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { Button, Col, Form, InputNumber, Row, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectKhoaSinhVien from '../../KhoaSinhVien/components/Select';
import { resetFieldsForm } from '@/utils/utils';

const FormDotNhapHoc = (props: { afterAddNew?: (rec: DotNhapHoc.IRecord) => void }) => {
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
	} = useModel('daotaov2.namhoc.dotnhaphoc');
	const { afterAddNew } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DotNhapHoc.IRecord) => {
		if (dayjs(values.thoiGianKetThuc).diff(dayjs(values.thoiGianBatDau), 'minutes') <= 0) {
			message.error('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!');
			return;
		}
		if (edit) {
			putModel(record?._id ?? '', values, getModel, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, getModel, false)
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
				<Col span={24} md={12}>
					<Form.Item name='khoaSinhVienId' label='Khóa sinh viên' rules={[...rules.required]}>
						<SelectKhoaSinhVien />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='soThuTu' label='Số thứ tự' rules={[...rules.required, ...rules.number(30, 1)]}>
						<InputNumber min={1} max={30} placeholder='Nhập tiết học' style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu'>
						<MyDatePicker allowClear style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item name='thoiGianKetThuc' label='Thời gian kết thúc'>
						<MyDatePicker allowClear style={{ width: '100%' }} />
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

export default FormDotNhapHoc;
