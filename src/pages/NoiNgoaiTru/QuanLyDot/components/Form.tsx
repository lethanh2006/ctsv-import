import MyDatePicker from '@/components/MyDatePicker';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import { ETrangThaiNoiNgoaiTru } from '@/services/NoiNgoaiTru/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDotKhaoBaoNoiNgoaiTru = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('noingoaitru.dotkhaibao');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const thoiGianBatDau = Form.useWatch('thoiGianBatDau', form);
	const { title } = props;

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const data = { ...values, maHocKy: recHocKy?.ma };
		if (edit) {
			putModel(record?._id ?? '', data, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(data, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={12}>
						<Form.Item label='Kỳ học'>
							<Input disabled value={recHocKy?.ten} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='tenDot'
							label='Tên đợt khai báo'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập tên đợt đăng ký' />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
							<MyDatePicker
								onChange={(val) => {
									form.validateFields(['thoiGianKetThuc']);
								}}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='thoiGianKetThuc'
							label='Thời gian kết thúc'
							rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'Thời gian bắt đầu')]}
						>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(thoiGianBatDau)} />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='danhSachKhoaSinhVienKhaiBao' label='Khóa sinh viên' rules={[...rules.required]}>
							<SelectKhoaSinhVien selectMa multiple />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='trangThai' label='Kích hoạt'>
							<Select
								placeholder='Chọn kích hoạt'
								options={Object.values(ETrangThaiNoiNgoaiTru).map((item) => ({
									value: item,
									label: item,
								}))}
							/>
						</Form.Item>
					</Col>
					<Form.Item name='trangThaiDuyet' label='Trạng thái' hidden />
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Chỉnh sửa'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDotKhaoBaoNoiNgoaiTru;
