import MyDatePicker from '@/components/MyDatePicker';
import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDotQuyDoiDiem = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, setRecord } = useModel(
		'ketquahoctap.quydoidiem.dotquydoidiem',
	);
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { title, getData } = props;
	const thoiGianBatDau: Date = Form.useWatch('thoiGianBatDau', form);
	const thoiGianBatDauLayYKien: Date = Form.useWatch('thoiGianBatDauLayYKien', form);
	const thoiGianKetThucLayYKien: Date = Form.useWatch('thoiGianKetThucLayYKien', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DotQuyDoiDiem.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', { ...values, maHocKy: recHocKy?.ma }, getData)
				.then((rec) => setRecord(rec))
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, maHocKy: recHocKy?.ma }, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={12}>
						<Form.Item label='Kỳ học'>
							<Input disabled value={record?.hocKy?.ten ?? recHocKy?.ten} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='tenDot' label='Tên đợt quy đổi điểm' rules={[...rules.required]}>
							<Input placeholder='Nhập tên đợt quy đổi điểm ' />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
							<MyDatePicker onChange={() => form.validateFields(['thoiGianBatDauLayYKien'])} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='thoiGianBatDauLayYKien'
							label='Thời gian bắt đầu lấy ý kiến'
							rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'Thời gian bắt đầu')]}
						>
							<MyDatePicker
								onChange={() => form.validateFields(['thoiGianKetThucLayYKien'])}
								disabledDate={(cur) => dayjs(cur).isBefore(thoiGianBatDau)}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item
							name='thoiGianKetThucLayYKien'
							label='Thời gian kết thúc lấy ý kiến'
							rules={[...rules.required, ...rules.sauNgay(thoiGianBatDauLayYKien, 'Thời gian bắt đầu lấy ý kiến')]}
						>
							<MyDatePicker
								onChange={() => form.validateFields(['thoiGianKetThuc'])}
								disabledDate={(cur) => dayjs(cur).isBefore(thoiGianBatDauLayYKien)}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='thoiGianKetThuc'
							label='Thời gian kết thúc'
							rules={[...rules.required, ...rules.sauNgay(thoiGianKetThucLayYKien, 'Thời gian kết thúc lấy ý kiến')]}
						>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(thoiGianKetThucLayYKien)} />
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

export default FormDotQuyDoiDiem;
