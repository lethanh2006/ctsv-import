import { ELoaiToChucDayHoc } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormLichTrinhCuThe = (props: { initWeek?: number; getData: any }) => {
	const [form] = Form.useForm();
	const { initWeek, getData } = props;
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, putOrPostNoiDungModel, visibleForm } =
		useModel('daotaov2.hocphan.tientrinhhp');
	const { record: recDeCuong } = useModel('daotaov2.hocphan.decuonghocphan');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue(record);
			record.ndTienTrinhList?.forEach((item) => {
				form.setFieldsValue({ [item.loaiToChucDayHoc]: item.soTiet });
			});
		} else if (initWeek) form.setFieldsValue({ tuan: initWeek });
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = { ...values, deCuongId: recDeCuong?._id ?? '' };
		if (edit) {
			putModel(record?._id ?? '', payload, () => {}) // not get data
				.then(() => {
					// Cập nhật các loại hình thức
					Promise.all(
						Object.values(ELoaiToChucDayHoc).map((loai) =>
							putOrPostNoiDungModel(record?.ndTienTrinhList ?? [], {
								loaiToChucDayHoc: loai,
								soTiet: values?.[loai] ?? 0,
								tienTrinhHpId: record?._id,
							}),
						),
					).then(() => getData()); // Xong mới get Data
				})
				.catch((er) => console.log(er));
		} else
			postModel(payload, () => {}) // not get data
				.then((rec) => {
					// Thêm mới các loại hình thức
					Promise.all(
						Object.values(ELoaiToChucDayHoc).map((loai) =>
							putOrPostNoiDungModel(record?.ndTienTrinhList ?? [], {
								loaiToChucDayHoc: loai,
								soTiet: values?.[loai] ?? 0,
								tienTrinhHpId: rec._id,
							}),
						),
					).then(() => getData()); // Xong mới get Data
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24} md={6}>
					<Form.Item name='tuan' label='Tuần học' rules={[...rules.required, ...rules.number(53, 1, false)]}>
						<InputNumber placeholder='Tuần học' min={1} max={53} style={{ width: '100%' }} disabled />
					</Form.Item>
				</Col>

				<Col span={24} md={18}>
					<Form.Item name='noiDung' label='Nội dung' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
						<Input placeholder='Nhập nội dung' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='noiDungChinh' label='Nội dung chính' rules={[...rules.text]}>
						<Input.TextArea rows={3} placeholder='Nhập nội dung chính' />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='yeuCauSinhVien' label='Yêu cầu đối với sinh viên' rules={[...rules.text]}>
						<Input.TextArea rows={3} placeholder='Nhập yêu cầu đối với sinh viên' />
					</Form.Item>
				</Col>

				<Col span={24}>
					<div className='fw500'>Hình thức tổ chức dạy học (tiết)</div>
				</Col>
				{Object.values(ELoaiToChucDayHoc).map((item) => (
					<Col span={24} md={12} key={item}>
						<Form.Item name={item} label={item} initialValue={0}>
							<InputNumber min={0} max={50} placeholder={`Số tiết ${item}`} style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				))}

				<Col span={24}>
					<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text]}>
						<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit ? 'Thêm mới ' : 'Lưu lại'}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormLichTrinhCuThe;
