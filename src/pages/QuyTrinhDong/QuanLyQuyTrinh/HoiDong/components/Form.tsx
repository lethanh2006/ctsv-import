import { Button, Card, Col, Form, Input, Row, Select, Spin } from 'antd';
import rules from '@/utils/rules';
import { useModel } from 'umi';
import { useEffect } from 'react';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableThanhVien from './TableThanhVien';
import dayjs from 'dayjs';

const FormHoiDong = () => {
	const [form] = Form.useForm();
	const { record, edit, postModel, putModel, setVisibleForm, loading } = useModel('quytrinh.hoidong');
	const { record: recordDot } = useModel('quytrinh.dotquytrinh');
	const { record: recordQuyTrinh } = useModel('quytrinh.quanlyquytrinh');
	const onFinish = async (values: any) => {
		try {
			const payload = {
				...record,
				...values,
				startDate: values?.thoiGian?.[0],
				endDate: values?.thoiGian?.[1],
				thoiGian: undefined,
				quyTrinhId: recordQuyTrinh?._id,
				dotQuyTrinhId: recordDot?._id,
			};
			if (edit) {
				putModel(record?._id ?? '', payload);
			} else {
				postModel(payload);
			}
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		if (record && edit) {
			form.setFieldsValue({ ...record, thoiGian: [dayjs(record?.startDate), dayjs(record?.endDate)] });
		}
	}, [record, edit]);
	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Spin spinning={loading}>
				<Form onFinish={onFinish} layout={'vertical'} form={form}>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Form.Item label={'Tên hội đồng'} name={'ten'} rules={[...rules.required, ...rules.length(500)]}>
								<Input placeholder={'Nhập tên hội đồng'} autoFocus />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label={'Thời gian diễn ra'} name={'thoiGian'} rules={[...rules.required]}>
								<MyDateRangePicker showTime format={'HH:mm DD/MM/YYYY'} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label={'Bước xử lý'} name={'maBuoc'} rules={[...rules.required]}>
								<Select
									placeholder='Chọn bước xử lý'
									options={recordQuyTrinh?.danhSachBuocXuLy?.map((item) => ({ value: item.ma, label: item.ten }))}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<div className='ant-descriptions-title' style={{ marginBottom: 12 }}>
								Danh sách thành viên
							</div>
							<TableThanhVien mode='edit' />
						</Col>

						<Col span={24}>
							<Form.Item>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
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
			</Spin>
		</Card>
	);
};
export default FormHoiDong;
