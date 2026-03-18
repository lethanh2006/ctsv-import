import MyDatePicker from '@/components/MyDatePicker';
import { ELoaiThoiGianNhapDiem } from '@/services/DaoTaoV2/HocKy/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Divider, Form, InputNumber, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const CauHinhThoiGianHocKyPage = (props: { onlyPhanCong?: boolean }) => {
	const { putModel, record, setRecord, formSubmiting, visibleForm, setVisibleForm, guiThongBaoPhanCongGiangDayModel } =
		useModel('daotaov2.hocky.hocky');
	const [form] = Form.useForm();
	const { onlyPhanCong } = props;
	const loaiThoiGianNhapDiemHocKy: ELoaiThoiGianNhapDiem = Form.useWatch('loaiThoiGianNhapDiemHocKy', form);
	const tgBdLayYKienKhgd = Form.useWatch('tgBdLayYKienKhgd', form);
	const tgBdPhanCongGiangDay = Form.useWatch('tgBdPhanCongGiangDay', form);
	const thoiGianNhapDiemBatDau = Form.useWatch('thoiGianNhapDiemBatDau', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = (values: any) => {
		if (onlyPhanCong)
			guiThongBaoPhanCongGiangDayModel(record?.ma ?? '', values)
				.then((res) => (setRecord(res), setVisibleForm(false)))
				.catch((er) => console.log(er));
		else
			putModel(record?._id ?? '', values)
				.then((res) => setRecord(res))
				.catch((er) => console.log(er));
	};

	return (
		<>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				{!onlyPhanCong ? (
					<>
						<Divider>Thời gian lấy ý kiến kế hoạch giảng dạy</Divider>
						<Row gutter={[12, 0]} style={{ maxWidth: 600, margin: 'auto' }}>
							<Col span={12}>
								<Form.Item
									name='tgBdLayYKienKhgd'
									label='Thời gian bắt đầu'
									// rules={[...rules.sauNgay(record?.thoiGianBatDau, 'Thời gian bắt đầu kỳ học')]}
								>
									<MyDatePicker
										onChange={() => form.validateFields(['tgKtLayYKienKhgd'])}
										// disabledDate={(cur) => dayjs(cur).isBefore(record?.thoiGianBatDau)}
										allowClear
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='tgKtLayYKienKhgd'
									label='Thời gian kết thúc'
									rules={[...rules.sauNgay(tgBdLayYKienKhgd, 'Thời gian bắt đầu')]}
								>
									<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(tgBdLayYKienKhgd)} allowClear />
								</Form.Item>
							</Col>
						</Row>
					</>
				) : null}

				<Divider>Thời gian phân công giảng dạy</Divider>
				<Row gutter={[12, 0]} style={{ maxWidth: 600, margin: 'auto' }}>
					<Col span={12}>
						<Form.Item name='tgBdPhanCongGiangDay' label='Thời gian bắt đầu'>
							<MyDatePicker onChange={() => form.validateFields(['tgKtPhanCongGiangDay'])} allowClear />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='tgKtPhanCongGiangDay'
							label='Thời gian kết thúc'
							rules={[...rules.sauNgay(tgBdPhanCongGiangDay, 'Thời gian bắt đầu')]}
						>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(tgBdPhanCongGiangDay)} allowClear />
						</Form.Item>
					</Col>
				</Row>

				{!onlyPhanCong ? (
					<>
						<Divider>Thời gian nộp điểm thành phần</Divider>
						<Row gutter={[12, 0]} style={{ maxWidth: 600, margin: 'auto' }}>
							<Col span={24}>
								<Form.Item name='loaiThoiGianNhapDiemHocKy' label='Loại thời gian'>
									<Select
										placeholder='Chọn loại thời gian'
										options={Object.values(ELoaiThoiGianNhapDiem).map((item) => ({
											key: item,
											label: item,
											value: item,
										}))}
									/>
								</Form.Item>
							</Col>
						</Row>

						{loaiThoiGianNhapDiemHocKy === ELoaiThoiGianNhapDiem.NUM_DAY ? (
							<Row gutter={[12, 0]} style={{ maxWidth: 600, margin: 'auto' }}>
								<Col span={24}>
									<Form.Item name='soNgayNhapDiem' label='Số ngày nhập điểm' rules={[...rules.number(50, 1, false)]}>
										<InputNumber style={{ width: '100%' }} min={1} max={50} placeholder='Nhập số ngày nhập điểm' />
									</Form.Item>
								</Col>
							</Row>
						) : (
							<Row gutter={[12, 0]} style={{ maxWidth: 600, margin: 'auto' }}>
								<Col span={12}>
									<Form.Item
										name='thoiGianNhapDiemBatDau'
										label='Thời gian bắt đầu'
										rules={[...rules.sauNgay(record?.thoiGianBatDau, 'Thời gian bắt đầu kỳ học')]}
									>
										<MyDatePicker
											onChange={(val) => {
												form.validateFields(['thoiGianNhapDiemKetThuc']);
											}}
											disabledDate={(cur) => dayjs(cur).isBefore(record?.thoiGianBatDau)}
										/>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										name='thoiGianNhapDiemKetThuc'
										label='Thời gian kết thúc'
										rules={[...rules.sauNgay(thoiGianNhapDiemBatDau, 'Thời gian bắt đầu')]}
									>
										<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(thoiGianNhapDiemBatDau)} />
									</Form.Item>
								</Col>
							</Row>
						)}
					</>
				) : null}

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Lưu lại
					</Button>
				</div>
			</Form>
		</>
	);
};

export default CauHinhThoiGianHocKyPage;
