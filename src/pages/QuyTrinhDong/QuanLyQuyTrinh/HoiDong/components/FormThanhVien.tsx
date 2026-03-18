import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import { ELoaiThanhVien, EVaiTroHoiDong } from '@/services/QuyTrinh/HoiDong/constant';
import type { HoiDong } from '@/services/QuyTrinh/HoiDong/typings';
import { EHocHam, EHocVi } from '@/services/QuyTrinh/constant';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row, Select, message } from 'antd';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormThanhVien = (props: { onCancel: any; record?: HoiDong.ThanhVienHoiDong; edit: boolean }) => {
	const [form] = Form.useForm();
	const { record, edit } = props;
	const { record: recordHoiDong, setRecord: setRecordHoiDong } = useModel('quytrinh.hoidong');

	const [loai, setLoai] = useState<ELoaiThanhVien>(
		record?.ma ? ELoaiThanhVien.TRONG_HE_THONG : ELoaiThanhVien.NGOAI_HE_THONG,
	);

	const [hoVaTen, setHoVaTen] = useState<string>(record?.ten ?? '');
	const [maDonVi, setMaDonVi] = useState<string>(record?.maDonVi ?? '');
	const [maDinhDanh, setMaDinhDanh] = useState<string>(record?.ma ?? '');

	const { danhSach } = useModel('tochucnhansu.nhansu');

	useEffect(() => {
		if (record && edit) {
			form.setFieldsValue({
				...record,
				loai: record?.ma ? ELoaiThanhVien.TRONG_HE_THONG : ELoaiThanhVien.NGOAI_HE_THONG,
			});
		} else {
			form.setFieldsValue({ ...form, loai: ELoaiThanhVien.TRONG_HE_THONG });
			setLoai(ELoaiThanhVien.TRONG_HE_THONG);
		}
	}, [record]);

	const onFinish = async (values: HoiDong.ThanhVienHoiDong) => {
		const payload = {
			...values,
			ssoId: values?.ssoId ? values.ssoId : nanoid(),
			maDonVi,
			ma: maDinhDanh,
			ten: values?.ten ?? hoVaTen,
		};

		if (edit && record && recordHoiDong) {
			const index = recordHoiDong.danhSachThanhVien
				.map((item, indexTemp: number) => indexTemp + 1)
				.indexOf(record.index);
			const danhSachThanhVien = [...recordHoiDong.danhSachThanhVien];
			danhSachThanhVien.splice(index, 1, { ...record, ...payload });
			setRecordHoiDong({ ...recordHoiDong, danhSachThanhVien });
		} else {
			const length = recordHoiDong?.danhSachThanhVien?.length;
			setRecordHoiDong({
				...(recordHoiDong || {}),
				danhSachThanhVien: [
					...(recordHoiDong?.danhSachThanhVien ?? []),
					{ ...payload, index: length ? length + 1 : 1 },
				],
			} as HoiDong.IRecord);
		}

		message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
		props.onCancel();
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'thành viên'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item rules={[...rules.required]} name='loai' label='Loại'>
					<Select
						placeholder='Loại'
						onChange={(val) => setLoai(val)}
						options={Object.values(ELoaiThanhVien).map((item) => ({ value: item, label: item }))}
					/>
				</Form.Item>

				{loai === ELoaiThanhVien.TRONG_HE_THONG ? (
					<>
						<Form.Item name={['ssoId']} label='Họ và tên' rules={[...rules.required]}>
							<SelectNhanSuDebounce
								// recNhanSu={record}
								onChange={(val) => {
									if (!val) return;
									const recNhanSu = danhSach.find((item) => item.ssoId === val);
									setMaDinhDanh(recNhanSu?.maCanBo ?? '');
									setHoVaTen(`${recNhanSu?.hoDem ?? ''} ${recNhanSu?.ten ?? ''}`);
									setMaDonVi(recNhanSu?.donViChinh?.maDonVi ?? '');
									form.setFieldsValue({
										email: recNhanSu?.email ?? '',
										donVi: recNhanSu?.donViChinh?.ten ?? '',
										soDienThoai: recNhanSu?.sdtCaNhan ?? '',
										hocHam: recNhanSu?.danhSachHocHam?.[0]?.danhHieu || recNhanSu?.hocHam,
										hocVi: recNhanSu?.hocVi || recNhanSu?.chatLuongNhanSu,
									});
								}}
							/>
						</Form.Item>
					</>
				) : (
					<>
						<Form.Item
							name={['hoVaTen']}
							label='Họ và tên'
							rules={[...rules.required, ...rules.ten]}
							style={{ marginBottom: 10 }}
						>
							<Input placeholder='Nhập họ và tên' />
						</Form.Item>
					</>
				)}

				<Form.Item name={'vaiTroHoiDong'} label='Vai trò' rules={[...rules.required]} style={{ marginBottom: 10 }}>
					<Select
						placeholder='Chọn hoặc nhập Vai trò của thành viên'
						options={Object.values(EVaiTroHoiDong)?.map((item) => ({
							value: item,
							label: item,
						}))}
					/>
				</Form.Item>

				<Form.Item
					rules={[...rules.required, ...rules.text, ...rules.length(200)]}
					style={{ marginBottom: 10 }}
					label='Cơ quan/đơn vị công tác'
					name={'donVi'}
				>
					<Input.TextArea rows={3} placeholder='Nhập tên cơ quan, đơn vị công tác' />
				</Form.Item>

				<Row gutter={[10, 0]}>
					<Col xs={24} sm={12}>
						<Form.Item
							name={['soDienThoai']}
							label='Số điện thoại'
							rules={[...rules.soDienThoai]}
							style={{ marginBottom: 10 }}
						>
							<Input placeholder='Nhập Số điện thoại' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item name={['email']} label='Email' rules={[...rules.email]} style={{ marginBottom: 10 }}>
							<Input placeholder='Nhập Email' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item name={['hocHam']} label='Học hàm' style={{ marginBottom: 10 }}>
							<Select
								allowClear
								placeholder='Học hàm'
								options={Object.values(EHocHam)?.map((item) => ({
									value: item,
									label: item,
								}))}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item name={['hocVi']} label='Học vị' style={{ marginBottom: 10 }}>
							<Select
								allowClear
								placeholder='Học vị'
								options={Object.values(EHocVi)?.map((item) => ({
									value: item,
									label: item,
								}))}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => props.onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThanhVien;
