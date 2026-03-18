import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import SelectLopHocPhanDebounce from '@/pages/DaoTaoV2/HocKy/LopHocPhan/components/SelectLopHocPhanDebounce';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import SelectLopHanhChinhDebounce from '@/pages/DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import TableSelectNhanSu from '@/pages/ThongBao/components/TableSelectNhanSu';
import TableSelectSinhVien from '@/pages/ThongBao/components/TableSelectSinhVien';
import GroupTagVaiTro from '@/pages/TienIch/KhaoSat/DotKhaoSat/GroupTagVaiTro';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import {
	ELoaiSoLuong,
	ELoaiSuKienSinhVien,
	EReceiverType,
	ESuKienType,
	ETuanLeCongDan,
	LoaiDoiTuongThamGia,
} from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { EVaiTroBieuMau, TenVaiTroBieuMau } from '@/services/TienIch/constant';
import rules from '@/utils/rules';
import { inputFormat, resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Modal, Popconfirm, Radio, Row, Select, Tabs, Tag, Tooltip } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import { first } from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormDuTruKinhPhi from './FormDuTruKinhPhi';

interface Props {
	hideCard?: boolean;
}

export type FormValues = SuKien.IRecord & {
	danhSachDoiTuong?: any;
	variantDanhSachThamGia?: 'Tất cả' | 'Cụ thể';
};

const FormSuKien = ({ hideCard }: Props) => {
	const {
		record,
		edit,
		isView,
		setVisibleForm,
		formSubmiting,
		visibleForm,
		getSuKienType,
		putModel,
		postModel,
		getModel,
		setRecordKinhPhi,
		setEditKinhPhi,
		dataKinhPhi,
		setDataKinhPhi,
	} = useModel('sukien');
	const [form] = Form.useForm<FormValues>();
	const thoiGianBatDau = useWatch(['thoiGianBatDau'], form);

	const [activeKey, setActiveKey] = useState<string>();
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<SuKien.IUser[]>([]);
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<SuKien.IUser[]>([]);
	const roles: EVaiTroBieuMau[] = Form.useWatch(['filter', 'roles'], form);
	const receiverType: EReceiverType = Form.useWatch('receiverType', form) ?? EReceiverType.All;
	const variantDanhSachThamGia = Form.useWatch('variantDanhSachThamGia', form) ?? 'Tất cả';
	const danhSachDoiTuong: string[] = Form.useWatch('danhSachDoiTuong', form);
	// const [dataDuTruKinhPhi, setDataDuTruKinhPhi] = useState<SuKien.IKinhPhiDuTru[]>([]);
	const [visibleFormDuTruKinhPhi, setVisibleFormDuTruKinhPhi] = useState(false);

	useEffect(() => {
		setDanhSachNhanSu([]);
		setDanhSachSinhVien([]);
		resetFieldsForm(form, {
			...record,
			receiverType: record?.receiverType ?? EReceiverType.All,
			variantDanhSachThamGia: record?.roles?.length ? 'Cụ thể' : 'Tất cả',
			filter: {
				...record?.filter,
				roles: record?.filter?.roles?.length ? record?.filter?.roles : record?.roles,
			},
			danhSachDoiTuong: [
				...(record?.filter?.idKhoa ?? []),
				...(record?.filter?.idKhoaSinhVien ?? []),
				...(record?.filter?.idLopHanhChinh ?? []),
				...(record?.filter?.idLopHocPhan ?? []),
				...(record?.filter?.idNganh ?? []),
			],
		} as FormValues);
		setDanhSachNhanSu((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.NHAN_VIEN));
		setDanhSachSinhVien((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.SINH_VIEN));
		setActiveKey(first(record?.roles ?? []));
		setDataKinhPhi(record?.kinhPhiDuTru ?? []);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: FormValues) => {
		const key_ = `id${receiverType}` as keyof Required<SuKien.IRecord>['filter'];
		if (values?.filter) {
			values.filter[key_] = values.danhSachDoiTuong;
		}
		if (receiverType === EReceiverType.All) {
			values.users = [];
		}
		delete values.danhSachDoiTuong;

		if (variantDanhSachThamGia === 'Cụ thể') {
			values.users = [
				...danhSachNhanSu.map((item) => ({
					...item,
					vaiTro: EVaiTroBieuMau.NHAN_VIEN,
				})),
				...danhSachSinhVien.map((item) => ({
					...item,
					vaiTro: EVaiTroBieuMau.SINH_VIEN,
				})),
			];
			delete values.filter?.roles;
		}
		delete values.variantDanhSachThamGia;
		values.kinhPhiDuTru = dataKinhPhi;

		if (edit) {
			putModel(record?._id ?? '', values, getModel)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel({ ...values, loaiSuKien: getSuKienType() }, getModel)
				.then()
				.catch((er) => console.log(er));
		}
	};
	const columns: IColumn<SuKien.IKinhPhiDuTru>[] = [
		{
			title: 'Nội dung',
			width: 200,
			dataIndex: 'noiDung',
			align: 'center',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Đơn vị tính',
			width: 90,
			dataIndex: 'dvTinh',
			align: 'center',
		},
		{
			title: 'Số lượng',
			// dataIndex: 'soLuong',
			width: 150,
			// align: 'center',
			children: [
				{
					title: 'Người',
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.NGUOI && inputFormat(val)}</>;
					},
				},
				{
					title: 'Ngày',
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.NGAY && inputFormat(val)}</>;
					},
				},
				{
					title: 'Khác',
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.KHAC && inputFormat(val)}</>;
					},
				},
			],
		},
		{
			title: 'Lượt',
			dataIndex: 'luot',
			width: 90,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: 'Phòng',
			dataIndex: 'phong',
			width: 120,
			align: 'center',
		},
		{
			title: 'Định mức',
			dataIndex: 'dinhMuc',
			width: 90,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: 'Dự toán',
			dataIndex: 'duToan',
			width: 120,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: 'Phân bổ nguồn',
			// dataIndex: 'phanBoNguon',
			width: 300,
			align: 'center',
			children: [
				{
					title: 'NSNN',
					dataIndex: 'nguonNSNN',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
				{
					title: 'Tự chủ',
					dataIndex: 'nguonTuChu',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
				{
					title: 'Vận động tài trợ',
					dataIndex: 'nguonTaiTro',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
			],
		},
		{
			title: 'Tiến độ hoàn thành',
			dataIndex: 'hoanThanh',
			width: 120,
			align: 'center',
			render: (val) => (val ? <Tag color={'green'}>Hoàn thành</Tag> : <Tag color={'red'}>Chưa hoàn thành</Tag>),
		},
		{
			title: 'Chứng từ yêu cầu',
			dataIndex: 'chungTuYeuCau',
			width: 150,
			align: 'center',
		},
		{
			title: 'Ý kiến TCKT',
			dataIndex: 'yKienTCKT',
			width: 200,
			align: 'center',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (_, recordVal) => {
				return (
					<>
						<Tooltip title='Chỉnh sửa'>
							<Button
								onClick={() => {
									setRecordKinhPhi(recordVal);
									setEditKinhPhi(true);
									setVisibleFormDuTruKinhPhi(true);
								}}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>
						<Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => {
									if (dataKinhPhi) {
										setDataKinhPhi(dataKinhPhi?.filter((item) => item?.id !== recordVal?.id));
									}
								}}
								title='Bạn có chắc chắn muốn xóa ngành đào tạo này?'
								placement='topLeft'
							>
								<Button danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					</>
				);
			},
		},
	];
	const renderContent = () => {
		return (
			<>
				<Form
					id='FormSuKien'
					form={form}
					layout='vertical'
					onFinish={onFinish}
					onFieldsChange={() => console.log(form.getFieldsValue())}
					disabled={isView}
				>
					<Row gutter={[12, 0]}>
						<Col xs={24}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='tenSuKien'
								label='Tên hoạt động'
							>
								<Input placeholder='Tên hoạt động' />
							</Form.Item>
						</Col>
						{getSuKienType() === ESuKienType.TUAN_LE_CONG_DAN && (
							<Col xs={24}>
								<Form.Item
									rules={[...rules.required, ...rules.text, ...rules.length(250)]}
									name='tuanLeCongDan'
									label='Loại'
								>
									<Select
										placeholder='Loại'
										options={Object.values(ETuanLeCongDan).map((item) => ({
											value: item,
											label: item,
										}))}
									/>
								</Form.Item>
							</Col>
						)}
						<Col xs={24}>
							<Form.Item rules={[...rules.required, ...rules.text, ...rules.length(250)]} name='kyHoc' label='Học kỳ'>
								<SelectHocKy />
							</Form.Item>
						</Col>
						{getSuKienType() === ESuKienType.CAC_HOAT_DONG && (
							<Col xs={24}>
								<Form.Item rules={[...rules.required]} name='loaiSuKienSinhVien' label='Loại'>
									<Select
										options={Object.values(ELoaiSuKienSinhVien).map((item) => ({ label: item, value: item }))}
										placeholder='Loại'
									/>
								</Form.Item>
							</Col>
						)}

						<Col xs={24} md={12}>
							<Form.Item
								rules={[...rules.required, ...(edit ? [] : rules.sauHomNay)]}
								name='thoiGianBatDau'
								label='Thời gian bắt đầu'
							>
								<MyDatePicker showTime={{ showHour: true, showMinute: true }} format='HH:mm DD/MM/YYYY' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'thời gian bắt đầu')]}
								name='thoiGianKetThuc'
								label='Thời gian kết thúc'
							>
								<MyDatePicker
									showTime={{ showHour: true, showMinute: true }}
									format='HH:mm DD/MM/YYYY'
									disabledDate={thoiGianBatDau ? (cur) => dayjs(cur).isBefore(thoiGianBatDau) : undefined}
								/>
							</Form.Item>
						</Col>

						<Col xs={24} md={getSuKienType() !== ESuKienType.TUAN_LE_CONG_DAN ? 12 : 24}>
							<Form.Item rules={[...rules.text, ...rules.length(250)]} name='diaDiem' label='Địa điểm'>
								<Input placeholder='Địa điểm' />
							</Form.Item>
						</Col>
						{/* {getSuKienType() !== ESuKienType.TUAN_LE_CONG_DAN && (
							<Col xs={24} md={12}>
								<Form.Item rules={[...rules.number(Number.MAX_SAFE_INTEGER, 0)]} name='kinhPhi' label='Kinh phí'>
									<InputNumber
										style={{ width: '100%' }}
										placeholder='Kinh phí'
										formatter={(value) => {
											const value_ = Number(value);
											return isNaN(value_) ? (value as any) : tienVietNam(value_);
										}}
										parser={(value) => (value ? Number(value?.replace(/[^0-9]/g, '')) : '')}
									/>
								</Form.Item>
							</Col>
						)} */}

						<Col span={24} md={8}>
							<Form.Item name='receiverType' label='Đối tượng tham gia' rules={[...rules.required]}>
								<Select
									options={Object.entries(LoaiDoiTuongThamGia)
										.filter(([value, label]) => value !== EReceiverType.User)
										.map(([value, label]) => ({
											key: value,
											value,
											label,
											disabled: value === EReceiverType.User,
										}))}
									placeholder='Đối tượng tham gia'
									onChange={() => {
										form.setFieldsValue({
											filter: { roles: [] } as any,
											danhSachDoiTuong: [],
										});
										setDanhSachNhanSu([]);
										setDanhSachSinhVien([]);
									}}
								/>
							</Form.Item>
						</Col>
						{receiverType !== EReceiverType.Khac && (
							<Col span={24} md={8}>
								<Form.Item name={['filter', 'roles']} label='Thành phần' rules={[...rules.required]}>
									<GroupTagVaiTro
										onChange={(arr) => {
											setActiveKey(arr?.[0]);
											if (!arr.includes(EVaiTroBieuMau.SINH_VIEN)) setDanhSachSinhVien([]);
											if (!arr.includes(EVaiTroBieuMau.NHAN_VIEN)) setDanhSachNhanSu([]);
										}}
										listVaiTro={
											[EReceiverType.KhoaSinhVien, EReceiverType.Nganh].includes(receiverType)
												? [EVaiTroBieuMau.SINH_VIEN]
												: receiverType === EReceiverType.Khoa
													? [EVaiTroBieuMau.NHAN_VIEN]
													: undefined
										}
									/>
								</Form.Item>
							</Col>
						)}
						{roles?.length ? (
							<Col span={24} md={8}>
								<Form.Item name='variantDanhSachThamGia' label='Danh sách người tham gia'>
									<Radio.Group
										buttonStyle='solid'
										optionType='button'
										onChange={() => {
											setActiveKey(first(roles));
										}}
									>
										<Radio value={'Tất cả'}>Tất cả</Radio>
										<Radio value={'Cụ thể'}>Cụ thể</Radio>
									</Radio.Group>
								</Form.Item>
							</Col>
						) : null}

						{receiverType !== EReceiverType.All && receiverType !== EReceiverType.Khac ? (
							<Col span={24}>
								<Form.Item name='danhSachDoiTuong' requiredMark>
									{receiverType === EReceiverType.Khoa ? (
										<SelectDonVi multiple selectMa />
									) : receiverType === EReceiverType.KhoaSinhVien ? (
										<SelectKhoaSinhVien multiple />
									) : receiverType === EReceiverType.LopHanhChinh ? (
										<SelectLopHanhChinhDebounce multiple selectMa />
									) : receiverType === EReceiverType.LopHocPhan ? (
										<SelectLopHocPhanDebounce multiple selectMa />
									) : receiverType === EReceiverType.Nganh ? (
										<SelectNganhCoSo multiple />
									) : null}
								</Form.Item>
							</Col>
						) : null}

						{roles?.length && variantDanhSachThamGia === 'Cụ thể' ? (
							<Col span={24} style={{ marginBottom: 12 }}>
								<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
									{Object.values(EVaiTroBieuMau).map((item) =>
										roles.includes(item) ? <Tabs.TabPane key={item} tab={TenVaiTroBieuMau[item]} /> : null,
									)}
								</Tabs>

								{activeKey === EVaiTroBieuMau.SINH_VIEN ? (
									<TableSelectSinhVien
										selectedUsers={danhSachSinhVien}
										setSelectedUsers={setDanhSachSinhVien}
										danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
									/>
								) : activeKey === EVaiTroBieuMau.NHAN_VIEN ? (
									<TableSelectNhanSu
										selectedUsers={danhSachNhanSu}
										setSelectedUsers={setDanhSachNhanSu}
										danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
									/>
								) : null}
							</Col>
						) : null}

						<Col xs={24}>
							<div>Dự trù kinh phí</div>
							<TableStaticData size='small' data={dataKinhPhi} addStt columns={columns}>
								<Button
									onClick={() => {
										setEditKinhPhi(false);
										setRecordKinhPhi(undefined);
										setVisibleFormDuTruKinhPhi(true);
									}}
									type='primary'
									size='small'
								>
									Thêm mới
								</Button>
								<Modal
									footer={null}
									width={700}
									styles={{ padding: 0 }}
									open={visibleFormDuTruKinhPhi}
									onCancel={() => {
										setVisibleFormDuTruKinhPhi(false);
									}}
									destroyOnClose
								>
									<FormDuTruKinhPhi setData={setDataKinhPhi} setVisibleForm={setVisibleFormDuTruKinhPhi} />
								</Modal>
							</TableStaticData>
						</Col>
						<Col xs={24}>
							<Form.Item rules={[...rules.text, ...rules.length(1000)]} name='ghiChu' label='Ghi chú'>
								<Input.TextArea placeholder='Ghi chú' rows={3} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<div className='form-footer'>
					{!isView && (
						<Button form='FormSuKien' loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit ? 'Thêm mới' : 'Lưu lại'}
						</Button>
					)}
					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			</>
		);
	};

	if (hideCard) {
		return <div>{renderContent()}</div>;
	}

	return <Card title={`${isView ? 'Chi tiết' : edit ? 'Chỉnh sửa' : 'Thêm mới'} hoạt động`}>{renderContent()}</Card>;
};

export default FormSuKien;
