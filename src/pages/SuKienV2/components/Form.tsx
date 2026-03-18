import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import { ELoaiGiaTri } from '@/pages/CauHinh/constants';
import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import SelectLopHocPhanDebounce from '@/pages/DaoTaoV2/HocKy/LopHocPhan/components/SelectLopHocPhanDebounce';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import SelectLopHanhChinhDebounce from '@/pages/DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import SelectMinhChung from '@/pages/DiemRenLuyen/MinhChung/CauHinh/Select';
import TableSelectUser from '@/pages/ThongBao/components/TableSelect';
import GroupTagVaiTro from '@/pages/TienIch/KhaoSat/DotKhaoSat/GroupTagVaiTro';
import SelectMauKhaoSat from '@/pages/TienIch/KhaoSat/components/Select';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import {
	ELoaiSoLuong,
	EReceiverType,
	ESuKienType,
	ETuanLeCongDan,
	LoaiDoiTuongThamGia,
} from '@/services/SuKienV2/constant';
import type { SuKienV2 } from '@/services/SuKienV2/typings';
import type { ThongBao } from '@/services/ThongBao/typing';
import { EVaiTroBieuMau, TenVaiTroBieuMau } from '@/services/TienIch/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { inputFormat, resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Checkbox,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	Popconfirm,
	Radio,
	Row,
	Select,
	Tabs,
	Tag,
	Tooltip,
} from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import dayjs from 'dayjs';
import { first } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import QuanLySuKien from './QuanLySuKien';

interface Props {
	hideCard?: boolean;
}

export type FormValues = SuKienV2.IRecord & {
	danhSachDoiTuong?: any;
	variantDanhSachThamGia?: 'Tất cả' | 'Cụ thể';
};

const FormSuKien = ({ hideCard }: Props) => {
	const intl = useIntl();
	const {
		record,
		edit,
		isView,
		setVisibleForm,
		formSubmiting,
		visibleForm,
		putModel,
		postModel,
		getModel,
		setRecordKinhPhi,
		setEditKinhPhi,
		dataKinhPhi,
		setDataKinhPhi,
	} = useModel('sukienv2');
	const [form] = Form.useForm<FormValues>();
	const thoiGianBatDau = useWatch(['thoiGianBatDau'], form);
	const thoiGianKetThuc = useWatch(['thoiGianKetThuc'], form);
	const thoiGianBatDauDangKy = useWatch(['thoiGianBatDauDangKy'], form);
	const thoiGianKetThucDangKy = useWatch(['thoiGianKetThucDangKy'], form);
	const isQRDangKy = useWatch(['isQRDangKy'], form);
	const idKhaoSatDangKy = useWatch(['idKhaoSatDangKy'], form);
	const isQRThamGia = useWatch(['isQRThamGia'], form);
	const idKhaoSatCheckIn = useWatch(['idKhaoSatCheckIn'], form);
	const idKhaoSatCheckOut = useWatch(['idKhaoSatCheckOut'], form);
	const isThongBao = useWatch(['isThongBao'], form);
	const loaiSuKien = Form.useWatch('loaiSuKien', form);
	const [activeKey, setActiveKey] = useState<string>();
	const [danhSachNhanSu, setDanhSachNhanSu] = useState<ThongBao.IUser[]>([]);
	const [danhSachSinhVien, setDanhSachSinhVien] = useState<ThongBao.IUser[]>([]);
	const roles: EVaiTroBieuMau[] = Form.useWatch(['filter', 'roles'], form);
	const receiverType: EReceiverType = Form.useWatch('receiverType', form) ?? EReceiverType.All;
	const variantDanhSachThamGia = Form.useWatch('variantDanhSachThamGia', form) ?? 'Tất cả';
	const danhSachDoiTuong: string[] = Form.useWatch('danhSachDoiTuong', form);
	// const [dataDuTruKinhPhi, setDataDuTruKinhPhi] = useState<SuKienV2.IKinhPhiDuTru[]>([]);
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
			isQRDangKy: record?.isQRDangKy ?? false,
			isQRThamGia: record?.isQRThamGia ?? false,
			isThongBao: record?.isThongBao ?? false,
			danhSachDoiTuong: [
				...(record?.filter?.idKhoa ?? []),
				...(record?.filter?.idKhoaSinhVien ?? []),
				...(record?.filter?.idLopHanhChinh ?? []),
				...(record?.filter?.idLopHocPhan ?? []),
				...(record?.filter?.idNganh ?? []),
			],
		} as FormValues);
		setDanhSachNhanSu((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.NHAN_VIEN) as any);
		setDanhSachSinhVien((record?.users ?? [])?.filter((item) => item.vaiTro === EVaiTroBieuMau.SINH_VIEN) as any);
		setActiveKey(first(record?.roles ?? []));
		setDataKinhPhi(record?.kinhPhiDuTru ?? []);
	}, [record?._id, visibleForm]);

	const getData = () => {
		getModel({
			loaiSuKien: {
				$nin: [ESuKienType.CA_NHAN],
			} as any,
		});
	};

	const onFinish = async (values: FormValues) => {
		const key_ = `id${receiverType}` as keyof Required<SuKienV2.IRecord>['filter'];
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
			] as any;
			delete values.filter?.roles;
		} else {
			values.users = [];
		}
		delete values.variantDanhSachThamGia;
		values.kinhPhiDuTru = dataKinhPhi;
		const anhBia = await buildUpLoadFile(values, 'anhBia');
		if (edit) {
			putModel(
				record?._id ?? '',
				{
					...values,
					thoiGianBatDauDangKy: values?.isQRDangKy ? values?.thoiGianBatDauDangKy : null,
					thoiGianKetThucDangKy: values?.isQRDangKy ? values?.thoiGianKetThucDangKy : null,
					anhBia: anhBia,
				},
				getData,
			)
				.then()
				.catch((er) => console.log(er));
		} else {
			// postModel({ ...values, loaiSuKien: getSuKienType() }, getModel)
			postModel({ ...values, anhBia: anhBia }, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	const columns: IColumn<SuKienV2.IKinhPhiDuTru>[] = [
		{
			title: intl.formatMessage({ id: 'sukien.form.noidung' }),
			width: 200,
			dataIndex: 'noiDung',
			align: 'center',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'sukien.form.dvt' }),
			width: 90,
			dataIndex: 'dvTinh',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sukien.form.sl' }),
			// dataIndex: 'soLuong',
			width: 150,
			// align: 'center',
			children: [
				{
					title: intl.formatMessage({ id: 'sukien.form.sl.nguoi' }),
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.NGUOI && inputFormat(val)}</>;
					},
				},
				{
					title: intl.formatMessage({ id: 'sukien.form.sl.ngay' }),
					dataIndex: 'soLuong',
					align: 'center',
					width: 80,
					render: (val, recordVal) => {
						return <>{recordVal?.loaiSoLuong === ELoaiSoLuong.NGAY && inputFormat(val)}</>;
					},
				},
				{
					title: intl.formatMessage({ id: 'sukien.form.sl.khac' }),
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
			title: intl.formatMessage({ id: 'sukien.form.luot' }),
			dataIndex: 'luot',
			width: 90,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: intl.formatMessage({ id: 'sukien.form.phong' }),
			dataIndex: 'phong',
			width: 120,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sukien.form.dinhmuc' }),
			dataIndex: 'dinhMuc',
			width: 90,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: intl.formatMessage({ id: 'sukien.form.dutoan' }),
			dataIndex: 'duToan',
			width: 120,
			align: 'center',
			render: (val) => inputFormat(+val),
		},
		{
			title: intl.formatMessage({ id: 'sukien.form.phanbo' }),
			// dataIndex: 'phanBoNguon',
			width: 300,
			align: 'center',
			children: [
				{
					title: intl.formatMessage({ id: 'sukien.form.phanbo.nsnn' }),
					dataIndex: 'nguonNSNN',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
				{
					title: intl.formatMessage({ id: 'sukien.form.phanbo.tuchu' }),
					dataIndex: 'nguonTuChu',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
				{
					title: intl.formatMessage({ id: 'sukien.form.phanbo.vandong' }),
					dataIndex: 'nguonTaiTro',
					width: 100,
					align: 'center',
					render: (val) => inputFormat(+val),
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'sukien.form.tiendo' }),
			dataIndex: 'hoanThanh',
			width: 120,
			align: 'center',
			render: (val) =>
				val ? (
					<Tag color={'green'}>{intl.formatMessage({ id: 'sukien.form.tiendo.hoanthanh' })}</Tag>
				) : (
					<Tag color={'red'}>{intl.formatMessage({ id: 'sukien.form.tiendo.chuahoanthanh' })}</Tag>
				),
		},
		{
			title: intl.formatMessage({ id: 'sukien.form.chungtu' }),
			dataIndex: 'chungTuYeuCau',
			width: 150,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sukien.form.ykien' }),
			dataIndex: 'yKienTCKT',
			width: 200,
			align: 'center',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'sukien.form.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (_, recordVal) => {
				return (
					<>
						<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
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
						<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
							<Popconfirm
								onConfirm={() => {
									if (dataKinhPhi) {
										setDataKinhPhi(dataKinhPhi?.filter((item) => item?.id !== recordVal?.id));
									}
								}}
								title={intl.formatMessage({ id: 'sukien.form.confirm.xoa' })}
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
						<Divider>{intl.formatMessage({ id: 'sukien.form.thongtinchung' })}</Divider>
						<Col xs={24}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='tenSuKien'
								label={intl.formatMessage({ id: 'sukien.form.thongtinchung.tenhd' })}
							>
								<Input placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.tenhd.place' })} />
							</Form.Item>
						</Col>
						<Col xs={12}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='loaiSuKien'
								label={intl.formatMessage({ id: 'sukien.form.thongtinchung.loaisk' })}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.loaisk.place' })}
									options={Object.values(ESuKienType)
										.filter((item) => item !== ESuKienType.CA_NHAN)
										.map((item) => ({
											value: item,
											label: item,
										}))}
								/>
							</Form.Item>
						</Col>
						{loaiSuKien === ESuKienType.TUAN_LE_CONG_DAN && (
							<Col xs={12}>
								<Form.Item
									rules={[...rules.required, ...rules.text, ...rules.length(250)]}
									name='tuanLeCongDan'
									label={intl.formatMessage({ id: 'sukien.form.thongtinchung.loai' })}
								>
									<Select
										placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.loai.place' })}
										options={Object.values(ETuanLeCongDan).map((item) => ({
											value: item,
											label: item,
										}))}
									/>
								</Form.Item>
							</Col>
						)}

						<Col xs={12}>
							<Form.Item
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								name='kyHoc'
								label={intl.formatMessage({ id: 'sukien.form.thongtinchung.hk' })}
							>
								<SelectHocKy />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='isQRDangKy' valuePropName='checked'>
								<Checkbox>{intl.formatMessage({ id: 'sukien.form.thongtinchung.qrdk' })}</Checkbox>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name='isQRThamGia' valuePropName='checked'>
								<Checkbox>{intl.formatMessage({ id: 'sukien.form.thongtinchung.qrthamgia' })}</Checkbox>
							</Form.Item>
						</Col>
						{isQRDangKy && (
							<>
								<Col xs={24}>
									<Form.Item
										name='idKhaoSatDangKy'
										label={intl.formatMessage({ id: 'sukien.form.thongtinchung.bieumau' })}
									>
										<SelectMauKhaoSat allowClear />
									</Form.Item>
								</Col>
								{idKhaoSatDangKy && (
									<Col xs={24}>
										<Form.Item name='batBuocKhaoSatDangKy' valuePropName='checked'>
											<Checkbox>{intl.formatMessage({ id: 'sukien.form.thongtinchung.batbuoc' })}</Checkbox>
										</Form.Item>
									</Col>
								)}
							</>
						)}
						{isQRThamGia && (
							<>
								<Col xs={24} md={12}>
									<Form.Item
										name='idKhaoSatCheckIn'
										label={intl.formatMessage({ id: 'sukien.form.thongtinchung.bieumaucheckin' })}
									>
										<SelectMauKhaoSat allowClear />
									</Form.Item>
								</Col>
								<Col xs={24} md={12}>
									<Form.Item
										name='idKhaoSatCheckOut'
										label={intl.formatMessage({ id: 'sukien.form.thongtinchung.bieumaucheckout' })}
									>
										<SelectMauKhaoSat allowClear />
									</Form.Item>
								</Col>
								{(idKhaoSatCheckIn || idKhaoSatCheckOut) && (
									<Col xs={24}>
										<Form.Item name='batBuocKhaoSatThamGia' valuePropName='checked'>
											<Checkbox>{intl.formatMessage({ id: 'sukien.form.thongtinchung.batbuoccheckout' })}</Checkbox>
										</Form.Item>
									</Col>
								)}
							</>
						)}
						{isQRDangKy && (
							<>
								<Col xs={24} md={12}>
									<Form.Item
										rules={[...rules.required, ...(edit ? [] : rules.sauHomNay)]}
										name='thoiGianBatDauDangKy'
										label={intl.formatMessage({ id: 'sukien.form.thongtinchung.tgdk' })}
									>
										<MyDatePicker
											disabledDate={
												thoiGianKetThucDangKy ? (cur) => dayjs(cur).isAfter(thoiGianKetThucDangKy) : undefined
											}
											showTime={{ showHour: true, showMinute: true }}
											format='HH:mm DD/MM/YYYY'
											placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.tgdk.place' })}
										/>
									</Form.Item>
								</Col>
								<Col xs={24} md={12}>
									<Form.Item
										rules={[
											...rules.required,
											...rules.sauNgay(
												thoiGianBatDauDangKy,
												intl.formatMessage({ id: 'sukien.form.thongtinchung.tgdk' }),
											),
										]}
										name='thoiGianKetThucDangKy'
										label={intl.formatMessage({ id: 'sukien.form.thongtinchung.tgktdk' })}
									>
										<MyDatePicker
											showTime={{ showHour: true, showMinute: true }}
											format='HH:mm DD/MM/YYYY'
											disabledDate={
												thoiGianBatDauDangKy ? (cur) => dayjs(cur).isBefore(thoiGianBatDauDangKy) : undefined
											}
											placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.tgktdk.place' })}
										/>
									</Form.Item>
								</Col>
							</>
						)}

						<Col xs={24} md={12}>
							<Form.Item
								rules={[...rules.required, ...(edit ? [] : rules.sauHomNay)]}
								name='thoiGianBatDau'
								label={intl.formatMessage({ id: 'sukien.form.thongtinchung.tgsk' })}
							>
								<MyDatePicker
									disabledDate={thoiGianKetThuc ? (cur) => dayjs(cur).isAfter(thoiGianKetThuc) : undefined}
									// disabledTime={() =>
									// 	disabledRangeTime(
									// 		dayjs(thoiGianKetThuc),
									// 		'start',
									// 		dayjs(thoiGianKetThuc).hour()?.toString(),
									// 		dayjs(thoiGianKetThuc).minutes()?.toString(),
									// 	)
									showTime={{ showHour: true, showMinute: true }}
									format='HH:mm DD/MM/YYYY'
									placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.tgsk.place' })}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								rules={[
									...rules.required,
									...rules.sauNgay(thoiGianBatDau, intl.formatMessage({ id: 'sukien.form.thongtinchung.tgsk' })),
								]}
								name='thoiGianKetThuc'
								label={intl.formatMessage({ id: 'sukien.form.thongtinchung.tgskkt' })}
							>
								<MyDatePicker
									showTime={{ showHour: true, showMinute: true }}
									format='HH:mm DD/MM/YYYY'
									disabledDate={thoiGianBatDau ? (cur) => dayjs(cur).isBefore(thoiGianBatDau) : undefined}
									// disabledTime={() =>
									// 	disabledRangeTime(
									// 		dayjs(thoiGianBatDau),
									// 		'start',
									// 		dayjs(thoiGianBatDau).hour()?.toString(),
									// 		dayjs(thoiGianBatDau).minutes()?.toString(),
									// 	)
									placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.tgskkt.place' })}
								/>
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								name='cauHinhMinhChungId'
								label={intl.formatMessage({ id: 'sukien.form.thongtinchung.tinhdrl' })}
							>
								<SelectMinhChung allowClear isSuKien />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								rules={[...rules.text, ...rules.length(250)]}
								name='diaDiem'
								label={intl.formatMessage({ id: 'sukien.form.thongtinchung.diadiem' })}
							>
								<Input placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.diadiem.place' })} />
							</Form.Item>
						</Col>
						{/*<Col xs={24}>*/}
						{/*	<Form.Item rules={[...rules.text, ...rules.length(1000)]} name='ghiChu' label='Ghi chú'>*/}
						{/*		<Input placeholder='Ghi chú' />*/}
						{/*	</Form.Item>*/}
						{/*</Col>*/}
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
						<Col span={24}>
							<Form.Item name='anhBia' label={intl.formatMessage({ id: 'sukien.form.thongtinchung.anhbia' })}>
								<UploadFile
									maxCount={1}
									otherProps={{
										maxCount: 1,
										accept: '.png, .jpeg, .jpg',
										multiple: false,
										showUploadList: { showDownloadIcon: false },
									}}
									accept='.png, .jpeg, .jpg'
								/>
							</Form.Item>
						</Col>
						{/* <Col xs={24}>
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
						</Col> */}
						<Col xs={24} md={24}>
							<Form.Item name='isThongBao' valuePropName='checked'>
								<Checkbox>{intl.formatMessage({ id: 'sukien.form.thongtinchung.thongbao' })}</Checkbox>
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								rules={[...rules.text, ...rules.length(1000)]}
								name='ghiChu'
								label={intl.formatMessage({ id: 'sukien.form.thongtinchung.ghichu' })}
							>
								<Input.TextArea
									placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.ghichu.place' })}
									rows={3}
								/>
							</Form.Item>
						</Col>
						{isThongBao && (
							<>
								<Divider>{intl.formatMessage({ id: 'sukien.form.thongtinchung.thoigianthongbao' })}</Divider>
								<Col xs={12}>
									<Form.Item
										// rules={[...rules.text, ...rules.length(250)]}
										name={['cauHinhThongBao', 'giaTri']}
										label={intl.formatMessage({ id: 'sukien.form.thongtinchung.giatri' })}
										tooltip={{
											title: intl.formatMessage({ id: 'sukien.form.thongtinchung.giatri.tooltip' }),
											icon: <InfoCircleOutlined />,
										}}
									>
										<InputNumber
											style={{ width: '100%' }}
											placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.giatri.place' })}
										/>
									</Form.Item>
								</Col>
								<Col xs={12}>
									<Form.Item
										name={['cauHinhThongBao', 'loaiGiatri']}
										label={intl.formatMessage({ id: 'sukien.form.thongtinchung.loaigiatri' })}
										tooltip={{
											title: intl.formatMessage({ id: 'sukien.form.thongtinchung.loaigiatri.tooltip' }),
											icon: <InfoCircleOutlined />,
										}}
									>
										<Select
											allowClear
											placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.loaigiatri.place' })}
											options={Object.values(ELoaiGiaTri)?.map((val) => ({ value: val, label: val }))}
										/>
									</Form.Item>
								</Col>
							</>
						)}

						<Divider>{intl.formatMessage({ id: 'sukien.form.thongtinchung.doituong' })}</Divider>
						<Col span={24} md={24}>
							<Form.Item
								name='nguoiQuanLySK'
								label={intl.formatMessage({ id: 'sukien.form.thongtinchung.qlsk' })}
								rules={[...rules.required]}
							>
								<QuanLySuKien form={form} fieldName={'nguoiQuanLySK'} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='receiverType'
								label={intl.formatMessage({ id: 'sukien.form.thongtinchung.doituongthamgia' })}
								rules={[...rules.required]}
							>
								<Select
									options={Object.entries(LoaiDoiTuongThamGia)
										.filter(([value, label]) => value !== EReceiverType.User)
										.map(([value, label]) => ({
											key: value,
											value,
											label,
											disabled: value === EReceiverType.User,
										}))}
									placeholder={intl.formatMessage({ id: 'sukien.form.thongtinchung.doituongthamgia.place' })}
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

						{/* {receiverType !== EReceiverType.Khac && ( */}
						<Col span={24} md={8}>
							<Form.Item
								name={['filter', 'roles']}
								label={intl.formatMessage({ id: 'sukien.form.thongtinchung.thanhphan' })}
								rules={[...rules.required]}
							>
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
						{/* )} */}
						{roles?.length ? (
							<Col span={24} md={8}>
								<Form.Item
									name='variantDanhSachThamGia'
									label={intl.formatMessage({ id: 'sukien.form.thongtinchung.dsthamgia' })}
								>
									<Radio.Group
										buttonStyle='solid'
										optionType='button'
										onChange={() => {
											setActiveKey(first(roles));
										}}
									>
										<Radio value={'Tất cả'}>
											{intl.formatMessage({ id: 'sukien.form.thongtinchung.dsthamgia.tatca' })}
										</Radio>
										<Radio value={'Cụ thể'}>
											{intl.formatMessage({ id: 'sukien.form.thongtinchung.dsthamgia.cuthe' })}
										</Radio>
									</Radio.Group>
								</Form.Item>
							</Col>
						) : null}

						{receiverType !== EReceiverType.All ? (
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
									<TableSelectUser
										type={EVaiTroBieuMau.SINH_VIEN}
										selectedUsers={danhSachSinhVien}
										setSelectedUsers={setDanhSachSinhVien}
										danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
									/>
								) : activeKey === EVaiTroBieuMau.NHAN_VIEN ? (
									<TableSelectUser
										type={EVaiTroBieuMau.NHAN_VIEN}
										selectedUsers={danhSachNhanSu}
										setSelectedUsers={setDanhSachNhanSu}
										danhSachDoiTuong={{ [`id${receiverType}`]: danhSachDoiTuong }}
									/>
								) : null}
							</Col>
						) : null}
					</Row>
				</Form>
				<div className='form-footer'>
					{!isView && (
						<Button form='FormSuKien' loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit
								? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
								: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
						</Button>
					)}
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</>
		);
	};

	if (hideCard) {
		return <div>{renderContent()}</div>;
	}

	return (
		<Card
			title={
				isView
					? intl.formatMessage({ id: 'sukien.form.chitiet' })
					: edit
						? intl.formatMessage({ id: 'sukien.form.chinhsua' })
						: intl.formatMessage({ id: 'sukien.form.themmoi' })
			}
		>
			{renderContent()}
		</Card>
	);
};

export default FormSuKien;
