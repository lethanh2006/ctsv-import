import { Button, Card, Col, DatePicker, Form, Input, Row } from 'antd';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { RangePickerProps } from 'antd/lib/date-picker';
import rules from "@/utils/rules";

const FormDotQuyTrinh = () => {
	const { postModel, getModel, edit, record, putModel, setVisibleForm } = useModel('quytrinh.dotquytrinh');
	const { record: recordQuyTrinh } = useModel('quytrinh.quanlyquytrinh');
	const [form] = Form.useForm();
	const [startDate, setStartDate] = useState<any>();
	const [endDate, setEndDate] = useState<any>();
	const onFinish = async (values: any) => {
		try {
			const payload = {
				...values,
				thoiGianBatDau: dayjs(values?.thoiGianBatDau).toISOString(),
				thoiGianKetThuc: dayjs(values?.thoiGianKetThuc).toISOString(),
				quyTrinhId: recordQuyTrinh?._id,
			};
			if (edit) {
				putModel(record?._id ?? '', payload, () => {
					getModel({ quyTrinhId: recordQuyTrinh?._id });
				});
			} else {
				postModel(payload, () => {
					getModel({ quyTrinhId: recordQuyTrinh?._id });
				});
			}
		} catch (e) {
			console.log(e);
		}
	};
	const disabledDate: RangePickerProps['disabledDate'] = (current) => {
		// Can not select days before today and today
		return current && endDate && dayjs(current).isAfter(endDate);
	};
	const disabledEndDate: RangePickerProps['disabledDate'] = (current) => {
		// Can not select days before today and today
		return current && startDate && dayjs(current).isBefore(startDate);
	};
	useEffect(() => {
		if (record && edit) {
			form.setFieldsValue({
				...record,
				thoiGianBatDau: dayjs(record?.thoiGianBatDau),
				thoiGianKetThuc: dayjs(record?.thoiGianKetThuc),
			});
		}
	}, [record, edit]);
	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Form onFinish={onFinish} layout={'vertical'} form={form}>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item name={'ten'} label={'Tên đợt'} rules={[...rules.required,...rules.length(200)]}>
							<Input placeholder={'Nhập tên đợt'} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name={'thoiGianBatDau'} label={'Thời gian bắt đầu'} rules={[...rules.required]}>
							<DatePicker
								style={{ width: '100%' }}
								disabledDate={disabledDate}
								onChange={(val) => {
									setStartDate(val);
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name={'thoiGianKetThuc'} label={'Thời gian kết thúc'} rules={[...rules.required]}>
							<DatePicker
								style={{ width: '100%' }}
								disabledDate={disabledEndDate}
								onChange={(val) => {
									setEndDate(val);
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item>
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<Button type={'primary'} htmlType={'submit'} style={{ marginRight: 8 }}>
									{edit ? 'Lưu' : 'Thêm mới'}
								</Button>
								<Button
									onClick={() => {
										setVisibleForm(false);
									}}
								>
									Đóng
								</Button>
							</div>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Card>
	);
};
export default FormDotQuyTrinh;
