import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExport from '@/components/Table/Export';
import ModalImport from '@/components/Table/Import';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ELoaiHocPhanCTDT, ETrangThaiCtdt } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import rules from '@/utils/rules';
import {
	CopyOutlined,
	DeleteOutlined,
	EditOutlined,
	ExportOutlined,
	EyeOutlined,
	ImportOutlined,
	PlusCircleOutlined,
	PlusOutlined,
} from '@ant-design/icons';
import { Checkbox, Col, Collapse, Dropdown, Form, InputNumber, Menu, Modal, Popconfirm, Row, Space, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalKhoiHocPhanCTDT from './ModalKhoiHocPhanCTDT';
import PreviewDanhSachHocPhan from '../XemTruoc/PreviewDanhSachHocPhan';
import PreviewKhungCTDT from '../XemTruoc/PreviewKhungCTDT';
import StatSoTinChi, { type TSoTinChiCTDT } from './StatSoTinChi';
import './style.less';

const KhoiHocPhanCTDTList = (props: { isKeHoach?: boolean }) => {
	const {
		getAllModel,
		deleteModel,
		setVisibleForm,
		setRecord,
		edit,
		visibleForm,
		setEdit,
		record,
		danhSach,
		loading,
		setIsClone,
		handleEdit: handleEditKhoi,
		putModel,
	} = useModel('daotaov2.chuongtrinhdaotao.khoihocphanctdt');
	const { record: recChuongTrinh } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const [form] = Form.useForm();
	const [groupKhoi, setGroupKhoi] = useState<Record<string, ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]>>({});
	const [initKhoi, setInitKhoi] = useState<string>();
	const [initChuyenNganh, setInitChuyenNganh] = useState<string>();
	const [visibleDSHP, setVisibleDSHP] = useState(false);
	const [visibleKhung, setVisibleKhung] = useState(false);
	const [visibleImport, setVisibleImport] = useState(false);
	const [visibleExport, setVisibleExport] = useState(false);
	const [thongKe, setThongKe] = useState<TSoTinChiCTDT>();
	const [recEditInline, setRecEditInline] = useState<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>();
	const { isKeHoach } = props;
	const isDisabled = !!recChuongTrinh?.trangThai && recChuongTrinh?.trangThai !== ETrangThaiCtdt.CONG_BO;

	/** Get dữ liệu khối học phần chương trình và tính các số liệu thống kê */
	const getData = async () => {
		if (recChuongTrinh?._id)
			getAllModel(undefined, { soThuTuKy: 1 }, { maChuongTrinhDaoTao: recChuongTrinh.ma }).then((data) => {
				const group = _.groupBy(data, (item) => item.maKhoiKienThuc);
				setGroupKhoi(group);
				// Các mã chuyên ngành (nếu có)
				const uniqchuyenNganh = _.uniq(data.filter((item) => !!item.maChuyenNganh).map((item) => item.maChuyenNganh));
				// Học phần ko có chuyên ngành hoặc thuộc chuyên ngành đầu tiên
				const da = data.filter((item) => !item.maChuyenNganh || item.maChuyenNganh === uniqchuyenNganh?.[0]);
				const tinChiChuyenNganh = _.sumBy(
					da.filter((item) => !!item.maChuyenNganh),
					(item) => item.hocPhan?.soTinChi ?? item.soTinChiTuChonPhaiHoc ?? 0,
				);
				const lechSoTinChiChuyenNganh = uniqchuyenNganh.some(
					(maChuyenNganh) =>
						_.sumBy(
							data.filter((item) => item.maChuyenNganh === maChuyenNganh),
							(item) => item.hocPhan?.soTinChi ?? item.soTinChiTuChonPhaiHoc ?? 0,
						) !== tinChiChuyenNganh,
				);
				// Cảnh báo học kỳ có số tín chỉ tích lũy ngoài khoảng MIN-MAX
				const groupHocKy = _.groupBy(
					da.filter(
						(item) =>
							(item.loaiHocPhanCtdt !== ELoaiHocPhanCTDT.BAT_BUOC && item.isTinhSoTinChiTichLuy) ||
							item.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy,
					),
					(item) => item.soThuTuKy,
				);
				const hocKyCanhBaoSoTinChi = Object.entries(groupHocKy)?.map(([hocKy, ds]) => ({
					hocKy: +hocKy,
					soTinChi: _.sumBy(ds, (item) => item.soTinChiTuChonPhaiHoc ?? item.hocPhan?.soTinChi ?? 0),
				}));
				setThongKe({
					soHocPhan: da.length,
					tinChiChuyenNganh,
					lechSoTinChiChuyenNganh,
					tongTinChi: _.sumBy(da, (item) =>
						item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC
							? (item.hocPhan?.loaiHocPhan?.isTinhSoTinChiTichLuy && item.hocPhan?.soTinChi) || 0
							: (item.isTinhSoTinChiTichLuy && item.soTinChiTuChonPhaiHoc) || 0,
					),
					hocKySoTinChi: hocKyCanhBaoSoTinChi,
					// tinChiTuChon: _.sumBy(
					// 	da.filter((item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON),
					// 	(item) => item.hocPhan?.soTinChi ?? item.soTinChiTuChonPhaiHoc ?? 0,
					// ),
				});
			});
	};

	useEffect(() => {
		getData();
	}, [recChuongTrinh?._id]);

	useEffect(() => {
		form.setFieldsValue({ soThuTuKy: recEditInline?.soThuTuKy });
	}, [recEditInline]);

	const handleEdit = (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
		setIsClone(false);
		handleEditKhoi(rec);
	};

	const handleClone = (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
		setIsClone(true);
		handleEditKhoi(rec);
	};

	const onAddNew = (khoi?: string, nganh?: string) => {
		setInitKhoi(khoi);
		setInitChuyenNganh(nganh);
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	const onFinish = async (value: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
		if (recEditInline?.soThuTuKy !== value.soThuTuKy) putModel(recEditInline?._id ?? '', value, getData, true, false);
		setRecEditInline(undefined);
	};

	const columns: IColumn<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>[] = [
		{ title: 'Tên học phần', width: 180, dataIndex: ['hocPhan', 'ten'], filterType: 'string' },
		{
			title: 'Mã HP',
			dataIndex: ['hocPhan', 'ma'],
			width: 80,
			filterType: 'string',
			align: 'center',
		},
		{
			title: 'Số tín chỉ',
			width: 80,
			render: (val, rec) => rec.hocPhan?.soTinChi,
			align: 'center',
		},
		{
			title: 'HK kế hoạch',
			width: 80,
			dataIndex: isKeHoach ? 'soThuTuKyKeHoach' : 'soThuTuKy',
			align: 'center',
			sortable: true,
		},
		{
			title: 'HK thực tế',
			width: 80,
			dataIndex: 'soThuTuKy',
			align: 'center',
			sortable: true,
			onCell: (rec) => ({
				onClick: () => recEditInline?._id !== rec?._id && setRecEditInline(rec),
				className: 'hovered-cell',
			}),
			render: (val, rec) =>
				recEditInline?._id === rec?._id ? (
					<Form onFinish={onFinish} form={form}>
						<Form.Item
							initialValue={val}
							name='soThuTuKy'
							rules={[...rules.required, ...rules.number(20, 1, false)]}
							noStyle
						>
							<InputNumber
								autoFocus
								min={1}
								max={20}
								style={{ width: '100%' }}
								onBlur={() => setRecEditInline(undefined)}
							/>
						</Form.Item>
					</Form>
				) : (
					<span>{val}</span>
				),
			hide: !isKeHoach,
		},
		{
			title: 'Tích lũy',
			width: 80,
			align: 'center',
			render: (val, rec) => <Checkbox checked={rec.hocPhan?.loaiHocPhan?.isTinhSoTinChiTichLuy} />,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			hide: isDisabled,
			render: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa học phần này khỏi chương trình?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa học phần' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	const columnsTuChon: IColumn<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>[] = [
		{ title: 'Tên khối học phần', width: 180, dataIndex: 'ten', filterType: 'string' },
		{ title: 'Số tín chỉ', width: 80, dataIndex: 'soTinChiTuChonPhaiHoc', align: 'center' },
		{
			title: 'HK kế hoạch',
			width: 80,
			dataIndex: isKeHoach ? 'soThuTuKyKeHoach' : 'soThuTuKy',
			align: 'center',
			sortable: true,
		},
		{
			title: 'HK thực tế',
			width: 80,
			dataIndex: 'soThuTuKy',
			align: 'center',
			sortable: true,
			onCell: (rec) => ({
				onClick: () => recEditInline?._id !== rec?._id && setRecEditInline(rec),
				className: 'hovered-cell',
			}),
			render: (val, rec) =>
				recEditInline?._id === rec?._id ? (
					<Form onFinish={onFinish} form={form}>
						<Form.Item
							initialValue={val}
							name='soThuTuKy'
							rules={[...rules.required, ...rules.number(20, 1, false)]}
							noStyle
						>
							<InputNumber
								autoFocus
								min={1}
								max={20}
								style={{ width: '100%' }}
								onBlur={() => form.validateFields().then(onFinish)}
							/>
						</Form.Item>
					</Form>
				) : (
					<span>{val}</span>
				),
			hide: !isKeHoach,
		},
		{
			title: 'Tích lũy',
			width: 80,
			dataIndex: 'isTinhSoTinChiTichLuy',
			align: 'center',
			render: (val) => <Checkbox checked={val} />,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			hide: isDisabled,
			render: (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => (
				<>
					<ButtonExtend tooltip='Nhân bản' onClick={() => handleClone(rec)} type='link' icon={<CopyOutlined />} />
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa khối học phần này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa khối học phần' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	const renderChuyenNganh = (dataChuyenNganh: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) => {
		const dataTuChon = dataChuyenNganh.filter((item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON);
		const dataBatBuoc = dataChuyenNganh.filter((item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC);
		const dataTotNghiep = dataChuyenNganh.filter((item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TOT_NGHIEP);
		return (
			<>
				{dataBatBuoc?.length ? (
					<>
						<div className='fw500'>Danh sách học phần bắt buộc</div>
						<TableStaticData
							data={dataBatBuoc}
							addStt
							columns={columns}
							size='small'
							otherProps={{ pagination: false, scroll: { y: 350 } }}
						/>
					</>
				) : null}
				{dataTuChon?.length ? (
					<>
						<div className='fw500' style={{ marginTop: 12 }}>
							Các khối học phần tự chọn
						</div>
						<TableStaticData
							data={dataTuChon}
							addStt
							columns={columnsTuChon}
							size='small'
							otherProps={{ pagination: false, scroll: { y: 350 } }}
						/>
					</>
				) : null}
				{dataTotNghiep?.length ? (
					<>
						<div className='fw500' style={{ marginTop: 12 }}>
							Khối tốt nghiệp (Khóa luận, học phần thay thế)
						</div>
						<TableStaticData
							data={dataTotNghiep}
							addStt
							columns={columnsTuChon}
							size='small'
							otherProps={{ pagination: false, scroll: { y: 350 } }}
						/>
					</>
				) : null}
			</>
		);
	};

	const renderKhoi = (dataKhoi: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) => {
		const khoi = dataKhoi[0].maKhoiKienThuc;
		const dataKoChuyenNganh = dataKhoi.filter((item) => !item.maChuyenNganh);
		const groupChuyenNganh = _.groupBy(
			dataKhoi.filter((item) => !!item.maChuyenNganh),
			(item) => item.maChuyenNganh,
		);

		return (
			<>
				<div style={{ marginBottom: 12 }}>
					<ButtonExtend
						size='small'
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => onAddNew(khoi, undefined)}
						disabled={isDisabled}
					>
						Thêm học phần
					</ButtonExtend>
				</div>

				{renderChuyenNganh(dataKoChuyenNganh)}

				{Object.keys(groupChuyenNganh).length ? (
					<Collapse style={{ marginTop: 18 }}>
						{Object.entries(groupChuyenNganh).map(([nganh, hocPhan]) => (
							<Collapse.Panel
								header={
									<Space>
										<span className='fw500'>
											Chuyên ngành: {hocPhan?.[0].chuyenNganh?.ten ?? '--'} (
											{_.sumBy(hocPhan, (i) => i.hocPhan?.soTinChi ?? i.soTinChiTuChonPhaiHoc ?? 0)} tín)
										</span>
										<ButtonExtend
											size='small'
											icon={<PlusOutlined />}
											type='link'
											onClick={() => onAddNew(khoi, nganh)}
											disabled={isDisabled}
										>
											Thêm học phần
										</ButtonExtend>
									</Space>
								}
								key={nganh ?? '1'}
							>
								{renderChuyenNganh(hocPhan)}
							</Collapse.Panel>
						))}
					</Collapse>
				) : null}
			</>
		);
	};

	return (
		<Row gutter={[12, 12]}>
			<StatSoTinChi thongKe={thongKe} />

			<Col span={24}>
				<Space wrap>
					<ButtonExtend icon={<ImportOutlined />} onClick={() => setVisibleImport(true)} disabled={isDisabled}>
						Nhập dữ liệu
					</ButtonExtend>
					<ButtonExtend icon={<ExportOutlined />} onClick={() => setVisibleExport(true)}>
						Xuất dữ liệu
					</ButtonExtend>
					{danhSach.length ? (
						<Dropdown
							overlay={
								<Menu>
									<Menu.Item onClick={() => setVisibleDSHP(true)}>Danh sách học phần</Menu.Item>
									<Menu.Item onClick={() => setVisibleKhung(true)}>Khung chương trình đào tạo</Menu.Item>
								</Menu>
							}
						>
							<ButtonExtend icon={<EyeOutlined />}>Xem trước</ButtonExtend>
						</Dropdown>
					) : null}
				</Space>
			</Col>

			<Col span={24}>
				<Spin spinning={loading}>
					<Collapse>
						{groupKhoi
							? Object.entries(groupKhoi).map(([khoi, data]) => (
									<Collapse.Panel
										header={
											<Space>
												<b>KHỐI: {data?.[0].khoiKienThuc?.ten?.toLocaleUpperCase() ?? '--'}</b>
												<ButtonExtend
													size='small'
													icon={<PlusOutlined />}
													type='link'
													onClick={() => onAddNew(khoi, undefined)}
													disabled={isDisabled}
												>
													Thêm chuyên ngành
												</ButtonExtend>
											</Space>
										}
										key={khoi}
									>
										{renderKhoi(data)}
									</Collapse.Panel>
							  ))
							: null}
					</Collapse>
				</Spin>
			</Col>

			<Col span={24}>
				<ButtonExtend
					block
					type='dashed'
					icon={<PlusCircleOutlined />}
					onClick={() => onAddNew()}
					disabled={isDisabled}
				>
					Thêm khối kiến thức
				</ButtonExtend>
			</Col>

			<Modal
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				title={(edit ? 'Chỉnh sửa' : 'Thêm mới') + ' khối học phần'}
				width={
					record?.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON ||
					record?.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TOT_NGHIEP
						? 1000
						: 800
				}
				maskClosable={false}
			>
				<ModalKhoiHocPhanCTDT
					initKhoi={initKhoi}
					initChuyenNganh={initChuyenNganh}
					getData={getData}
					isKeHoach={isKeHoach}
				/>
			</Modal>

			<PreviewDanhSachHocPhan visble={visibleDSHP} setVisible={setVisibleDSHP} />

			<PreviewKhungCTDT visble={visibleKhung} setVisible={setVisibleKhung} />

			<ModalImport
				modelName='daotaov2.chuongtrinhdaotao.khoihocphanctdt'
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					setVisibleImport(false);
					getData();
				}}
				visible={visibleImport}
				titleTemplate='Biểu mẫu nội dung chương trình đào tạo.xlsx'
				extendData={{ maChuongTrinhDaoTao: recChuongTrinh?.ma ?? '' }}
			/>

			<ModalExport
				modelName='daotaov2.chuongtrinhdaotao.khoihocphanctdt'
				onCancel={() => setVisibleExport(false)}
				condition={{ maChuongTrinhDaoTao: recChuongTrinh?.ma ?? '' }}
				visible={visibleExport}
				fileName='Danh sách học phần CTĐT.xlsx'
			/>
		</Row>
	);
};

export default KhoiHocPhanCTDTList;
