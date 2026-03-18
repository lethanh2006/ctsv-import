import MyDatePicker from '@/components/MyDatePicker';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import {
	EChucVuThanhVienCauLacBo,
	ELoaiThanhVienCauLacBo,
	ETrangThaiThanhVien,
	EVaiTroThanhVienPhongBan,
	MapKeyChucVuThanhVienCLB,
	MapKeyColorTrangThaiThanhVienCLB,
	MapKeyVaiTroThanhVienPhongBanCLB,
} from '@/services/CauLacBo/constant';
import type { CauLacBo } from '@/services/CauLacBo/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row, Select, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormThanhVienCLB = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, getModel } =
		useModel('caulacbo.thanhvien');
	const { record: recordCLB } = useModel('caulacbo.caulacbo');
	const { danhSach: danhSachPhongBan } = useModel('caulacbo.phongban');

	const { danhSach: danhSachSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	const banBoPhanId = Form.useWatch('banBoPhanId', form);
	const trangThai = Form.useWatch('trangThai', form);
	const getData = () => {
		getModel({ cauLacBoId: recordCLB?._id });
	};

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			const initData: any = { ...record, banBoPhanId: record.danhSachBanBoPhan.map((item) => item.banBoPhanId) };
			record.danhSachBanBoPhan.map((item) => {
				initData[item.banBoPhanId] = item.vaiTroThanhVienBanBoPhan;
			});
			form.setFieldsValue(initData);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (
		values: CauLacBo.ThanhVien & { banBoPhanId: string[]; vaiTroThanhVienBanBoPhan: EVaiTroThanhVienPhongBan[] },
	) => {
		if (!recordCLB?._id) return;
		const recSinhVien = danhSachSinhVien.find((item) => item.ssoId === values?.sinhVienSsoId);
		const payload: any = {
			...record,
			...values,
			cauLacBoId: recordCLB._id,
			hoTen: recSinhVien?.ten,
			maSinhVien: recSinhVien?.ma,
			namHoc: new Date().getFullYear().toString(),
			chucVuThanhVienCauLacBo: values?.chucVuThanhVienCauLacBo ?? null,
			danhSachBanBoPhan:
				values?.banBoPhanId?.map((item) => ({
					vaiTroThanhVienBanBoPhan: values?.[item] ?? null,
					banBoPhanId: item,
				})) ?? [],
			vaiTroThanhVienBanBoPhan: undefined,
			banBoPhanId: undefined,
		};

		if (edit) {
			putModel(record?._id ?? '', payload, getData);
		} else {
			postModel(payload, getData);
		}
	};

	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={24}>
						<Form.Item name='sinhVienSsoId' label='Sinh viên' rules={[...rules.required, ...rules.text]}>
							<SelectSinhVienDebounce />
						</Form.Item>
					</Col>

					<Col xs={12}>
						<Form.Item rules={[...rules.required]} name='trangThai' label='Trạng thái'>
							<Select
								allowClear
								placeholder='Trạng thái'
								options={Object.values(ETrangThaiThanhVien).map((item) => ({
									value: item,
									label: <Tag color={MapKeyColorTrangThaiThanhVienCLB[item]}>{item}</Tag>,
								}))}
							/>
						</Form.Item>
					</Col>
					<Col xs={12}>
						<Form.Item rules={[...rules.required]} name='loaiThanhVien' label='Loại thành viên'>
							<Select
								allowClear
								placeholder='Loại thành viên'
								options={Object.values(ELoaiThanhVienCauLacBo).map((item) => ({
									value: item,
									label: item,
								}))}
							/>
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item rules={[...rules.required]} name='thoiGianBatDau' label='Thời gian bắt đầu hoạt động'>
							<MyDatePicker format='DD/MM/YYYY' />
						</Form.Item>
					</Col>
					{trangThai === ETrangThaiThanhVien.NGUNG_HOAT_DONG && (
						<Col xs={24}>
							<Form.Item rules={[...rules.required]} name='thoiGianKetThuc' label='Thời gian ngừng hoạt động'>
								<MyDatePicker format='DD/MM/YYYY' />
							</Form.Item>
						</Col>
					)}

					<Col xs={24}>
						<Form.Item name='chucVuThanhVienCauLacBo' label='Vai trò trong ban chủ nhiệm câu lạc bộ'>
							<Select
								allowClear
								placeholder='Chọn vai trò'
								options={Object.values(EChucVuThanhVienCauLacBo).map((item) => ({
									value: item,
									label: MapKeyChucVuThanhVienCLB[item],
								}))}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='banBoPhanId' label='Thuộc ban/bộ phận khác?'>
							<Select
								mode='multiple'
								allowClear
								placeholder='Chọn ban/bộ phận'
								options={danhSachPhongBan.map((item) => ({
									value: item._id,
									label: item.ten,
								}))}
							/>
						</Form.Item>
					</Col>
					{banBoPhanId?.map((item: string) => (
						<Col key={item} xs={24} md={24}>
							<Form.Item name={item} label={`Vai trò trong ${danhSachPhongBan.find((ele) => ele._id === item)?.ten}`}>
								<Select
									allowClear
									placeholder='Chọn vai trò'
									options={Object.values(EVaiTroThanhVienPhongBan).map((ele) => ({
										value: ele,
										label: MapKeyVaiTroThanhVienPhongBanCLB[ele],
									}))}
								/>
							</Form.Item>
						</Col>
					))}
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThanhVienCLB;
