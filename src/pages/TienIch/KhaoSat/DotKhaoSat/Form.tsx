import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { ELoaiDoiTuong, ELoaiDot } from '@/services/TienIch/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Switch } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectMauKhaoSat from '../components/Select';
import GroupTagVaiTro from './GroupTagVaiTro';
import SelectLopHanhChinhDebounce from '@/pages/DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import SelectLopHocPhanDebounce from '@/pages/DaoTaoV2/HocKy/LopHocPhan/components/SelectLopHocPhanDebounce';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';

const FormDotKhaoSat = (props: any) => {
	const [form] = Form.useForm();
	const { formSubmiting, record, setVisibleForm, edit, putModel, postModel, visibleForm } =
		useModel('tienich.dotkhaosat');
	const [doiTuong, setDoiTuong] = useState<ELoaiDoiTuong | undefined>(
		record?.loaiDoiTuongSuDung?.[0] ?? ELoaiDoiTuong.TAT_CA,
	);
	// const [phamVi, setPhamVi] = useState<EPhamViChuDe>(record?.phamVi ?? EPhamViChuDe.TAT_CA);
	const isNguoiDungCuThe = doiTuong === ELoaiDoiTuong.NGUOI_DUNG_CU_THE;
	const title = props?.title ?? '';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else
			form.setFieldsValue({
				...record,
				thoiGian: [
					record?.thoiGianBatDau ? dayjs(record.thoiGianBatDau) : undefined,
					record?.thoiGianKetThuc ? dayjs(record.thoiGianKetThuc) : undefined,
				],
				// phamVi: record?.phamVi ?? EPhamViChuDe.TAT_CA,
				loaiDoiTuongSuDung: record?.loaiDoiTuongSuDung?.[0] ?? ELoaiDoiTuong.TAT_CA,
			});
	}, [record?._id, visibleForm]);

	// const buildListDoiTuongSuDung = (value: string[], arrName: string) => {
	// 	return value?.map((item) => {
	// 		const info = item?.split('||');
	// 		if (info.length === 1) {
	// 			return record?.[arrName as keyof DotKhaoSat.IRecord]?.find(
	// 				(ele: BieuMau.GeneralInfo) => ele?.name === info?.[0],
	// 			);
	// 		} else
	// 			return {
	// 				id: info?.[0],
	// 				name: info?.[1],
	// 			};
	// 	});
	// };

	const onFinish = async (values: any) => {
		console.log('values', values);
		if (isNguoiDungCuThe) {
			values.danhSachLopHanhChinh = [];
			values.danhSachLopTinChi = [];
			values.danhSachNganhHoc = [];
			values.danhSachKhoaHoc = [];
			values.danhSachVaiTro = [];
		} else {
			// values.danhSachLopHanhChinh = buildListDoiTuongSuDung(
			//   values?.danhSachLopHanhChinh ?? [],
			//   'danhSachLopHanhChinh',
			// );
			// values.danhSachLopTinChi = buildListDoiTuongSuDung(
			//   values?.danhSachLopTinChi ?? [],
			//   'danhSachLopTinChi',
			// );
			// values.danhSachNganhHoc = buildListDoiTuongSuDung(
			//   values?.danhSachNganhHoc ?? [],
			//   'danhSachNganhHoc',
			// );
			// values.danhSachKhoaHoc = buildListDoiTuongSuDung(
			//   values?.danhSachKhoaHoc ?? [],
			//   'danhSachKhoaHoc',
			// );
		}
		// values.danhSachNguoiDung = values?.danhSachNguoiDung?.map((item: string) => {
		//   const infoUser = item?.split('||');
		//   if (infoUser.length === 1) {
		//     return record?.danhSachNguoiDung?.find(
		//       (ele: BieuMau.GeneralInfo) => ele?.code === infoUser?.[0]?.split('-')?.[0],
		//     );
		//   } else
		//     return {
		//       code: infoUser?.[0],
		//       name: infoUser?.[1],
		//     };
		// });
		const thoiGianBatDau = values?.thoiGian?.[0] ?? values.thoiGianBatDau;
		const thoiGianKetThuc = values?.thoiGian?.[1] ?? values.thoiGianKetThuc;
		delete values.thoiGian;

		values.loaiDoiTuongSuDung = doiTuong === ELoaiDoiTuong.TAT_CA ? [] : [doiTuong];

		// if (values?.hinhThucDaoTaoId === -1) {
		//   values.hinhThucDaoTaoId = undefined;
		//   values.isTatCaHe = true;
		// } else {
		//   values.isTatCaHe = false;
		// }

		const payload = {
			...record,
			...values,
			loai: ELoaiDot.BIEU_MAU,
			thoiGianBatDau,
			thoiGianKetThuc,
			doiTuong: ELoaiDoiTuong.TAT_CA,
		};
		if (edit) {
			putModel(record?._id ?? '', payload)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(payload)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Form.Item name='ten' label='Tên đợt' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
					<Input placeholder='Nhập tên đợt' />
				</Form.Item>
				<Form.Item name='moTa' label='Mô tả' rules={[...rules.text, ...rules.length(2000)]}>
					<Input.TextArea rows={3} placeholder='Nhập mô tả' />
				</Form.Item>

				<Form.Item name='idKhaoSat' label='Biểu mẫu khảo sát' rules={[...rules.required]}>
					<SelectMauKhaoSat />
				</Form.Item>

				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='thoiGian' label='Thời gian khảo sát' rules={[...rules.required]}>
							<DatePicker.RangePicker
								format='HH:mm DD/MM/YYYY'
								disabledDate={(cur) => dayjs(cur).isBefore(dayjs(), 'days')}
								style={{ width: '100%' }}
								placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
								showTime
							/>
						</Form.Item>
					</Col>

					{/* <Col xs={24} md={phamVi === EPhamViChuDe.HINH_THUC_DAO_TAO ? 6 : 12}>
            <Form.Item rules={[...rules.required]} name="phamVi" label="Phạm vi">
              <Select
                onChange={(val: EPhamViChuDe) => setPhamVi(val)}
                placeholder="Chọn phạm vi"
                options={Object.values(EPhamViChuDe).map((item) => ({
                  key: item,
                  value: item,
                  label: item,
                }))}
              />
            </Form.Item>
          </Col>

          {phamVi === EPhamViChuDe.HINH_THUC_DAO_TAO && (
            <Col xs={24} md={6}>
              <Form.Item
                rules={[...rules.required]}
                name="hinhThucDaoTaoId"
                label="Hình thức đào tạo"
              >
                <SelectHinhThuc />
              </Form.Item>
            </Col>
          )} */}

					<Col xs={24} sm={12}>
						<Form.Item rules={[...rules.required]} name='loaiDoiTuongSuDung' label='Đối tượng khảo sát'>
							<Select
								onChange={(val: ELoaiDoiTuong) => {
									if (val === ELoaiDoiTuong.NGUOI_DUNG_CU_THE) {
										form.setFieldsValue({
											danhSachLopHanhChinh: [],
											danhSachLopTinChi: [],
											danhSachNganhHoc: [],
											danhSachKhoaHoc: [],
											danhSachVaiTro: [],
										});
									}
									setDoiTuong(val);
								}}
								placeholder='Chọn đối tượng'
								options={Object.values(ELoaiDoiTuong).map((item) => ({
									key: item,
									value: item,
									label: item,
								}))}
							/>
						</Form.Item>
					</Col>
				</Row>

				{doiTuong === ELoaiDoiTuong.LOP_HANH_CHINH ? (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Form.Item
							extra={!isNguoiDungCuThe && <div>Để trống nếu muốn gửi tới tất cả lớp hành chính</div>}
							style={{ marginBottom: 8, width: isNguoiDungCuThe ? '100%' : '100%' }}
							// rules={[...rules.required]}
							name='danhSachLopHanhChinh'
							label={isNguoiDungCuThe ? 'Lọc theo lớp hành chính' : 'Lớp hành chính'}
							initialValue={isNguoiDungCuThe ? [] : record?.danhSachLopHanhChinh?.map((item) => item.name)}
						>
							<SelectLopHanhChinhDebounce multiple={true} selectMa />
						</Form.Item>
						{/* {!isNguoiDungCuThe && renderButtonImportExcel('danhSachLopHanhChinh')} */}
					</div>
				) : doiTuong === ELoaiDoiTuong.LOP_TIN_CHI ? (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Form.Item
							extra={!isNguoiDungCuThe && <div>Để trống nếu muốn gửi tới tất cả lớp tín chỉ</div>}
							style={{ marginBottom: 8, width: isNguoiDungCuThe ? '100%' : '100%' }}
							// rules={[...rules.required]}
							name='danhSachLopTinChi'
							label={isNguoiDungCuThe ? 'Lọc theo lớp tín chỉ' : 'Lớp tín chỉ'}
							initialValue={isNguoiDungCuThe ? [] : record?.danhSachLopTinChi?.map((item) => item.name)}
						>
							<SelectLopHocPhanDebounce multiple selectMa />
						</Form.Item>
						{/* {!isNguoiDungCuThe && renderButtonImportExcel('danhSachLopTinChi')} */}
					</div>
				) : doiTuong === ELoaiDoiTuong.KHOA ? (
					<Form.Item
						extra={!isNguoiDungCuThe && <div>Để trống nếu muốn gửi tới tất cả các khóa</div>}
						style={{ marginBottom: 8, width: isNguoiDungCuThe ? '100%' : '100%' }}
						// rules={[...rules.required]}
						name='danhSachKhoaHoc'
						label={isNguoiDungCuThe ? 'Lọc theo khóa' : 'Khóa'}
						initialValue={isNguoiDungCuThe ? [] : record?.danhSachKhoaHoc?.map((item) => `${item.id}||${item.name}`)}
					>
						{/*<Select*/}
						{/*  maxTagCount={8}*/}
						{/*  onChange={(val: string[]) => {*/}
						{/*    if (!isNguoiDungCuThe) return;*/}
						{/*    setConditionNguoiDungCuThe({*/}
						{/*      ...conditionNguoiDungCuThe,*/}
						{/*      khoaSinhVienIds:*/}
						{/*        val.length > 0 ? val?.map((item) => item?.split('||')?.[0]) : undefined,*/}
						{/*    });*/}
						{/*  }}*/}
						{/*  filterOption={(value, option) => includes(option?.props.children, value)}*/}
						{/*  showSearch*/}
						{/*  allowClear*/}
						{/*  mode="tags"*/}
						{/*  placeholder="Chọn khóa"*/}
						{/*>*/}

						{/*</Select>*/}
						<SelectKhoaSinhVien multiple={true} />
					</Form.Item>
				) : doiTuong === ELoaiDoiTuong.NGANH ? (
					<Form.Item
						extra={!isNguoiDungCuThe && <div>Để trống nếu muốn gửi tới tất cả các ngành</div>}
						style={{ marginBottom: 8, width: isNguoiDungCuThe ? '100%' : '100%' }}
						// rules={[...rules.required]}
						name='danhSachNganhHoc'
						label={isNguoiDungCuThe ? 'Lọc theo ngành học' : 'Ngành học'}
						initialValue={isNguoiDungCuThe ? [] : record?.danhSachNganhHoc?.map((item) => `${item.id}||${item.name}`)}
					>
						<SelectNganhCoSo multiple={true} />
					</Form.Item>
				) : doiTuong === ELoaiDoiTuong.NGUOI_DUNG_CU_THE ? (
					<>
						{/*<Form.Item*/}
						{/*  style={{ marginBottom: 8, marginRight: 8, width: '100%' }}*/}
						{/*  label="Chọn khoá ngành"*/}
						{/*>*/}
						{/*  <SelectKhoaNganh />*/}
						{/*</Form.Item>*/}

						<Form.Item
							style={{ marginBottom: 8, marginRight: 8, width: '100%' }}
							rules={[...rules.required]}
							name='danhSachNguoiDung'
							label='Người dùng cụ thể'
							initialValue={record?.danhSachNguoiDung}
						>
							<SelectSinhVienDebounce multiple={true} />
						</Form.Item>
					</>
				) : null}

				<Row gutter={[12, 0]}>
					<Col xs={24} sm={12}>
						<Form.Item name='danhSachVaiTro' label={isNguoiDungCuThe ? 'Lọc theo vai trò' : 'Vai trò'}>
							<GroupTagVaiTro
							// onChange={(val: string[]) => {
							//   setConditionNguoiDungCuThe({
							//     ...conditionNguoiDungCuThe,
							//     vaiTroList: val?.length > 0 ? val : undefined,
							//   });
							// }}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Form.Item name='kichHoat' label='Kích hoạt' valuePropName='checked'>
							<Switch />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{edit ? 'Lưu lại' : 'Thêm mới'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDotKhaoSat;
