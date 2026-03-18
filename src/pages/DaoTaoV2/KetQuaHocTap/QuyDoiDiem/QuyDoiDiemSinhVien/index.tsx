import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import SelectHocPhan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhan';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';
import { ETrangThaiSinhVienDot } from '@/services/DaoTaoV2/constant';
import { CheckCircleOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Empty, Popconfirm, Segmented, Tabs, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FilterDotQuyDoi from '../DotQuyDoiDiem/components/Filter';
import FormQuyDoiDiemSinhVien from './components/Form';
import ModalQuyetDinhQuyDoiDiem from './components/ModalRaQuyetDinh';
import StatSinhVienQuyDoiDiem from './components/Stat';

const QuyDoiDiemSinhVienPage = () => {
	const intl = useIntl();
	const { record: recDot } = useModel('daotaov2.ketquahoctap.quydoidiem.dotquydoidiem');
	const {
		page,
		limit,
		getModel,
		setSelectedIds,
		selectedIds,
		deleteModel,
		khongCongNhanQuyDoiModel,
		setRecord,
		record,
		handleEdit,
		handleView: handleViewQuyDoi,
	} = useModel('daotaov2.ketquahoctap.quydoidiem.quydoidiemsinhvien');
	const { handleView } = useModel('daotaov2.sinhvien.sinhvien');
	const [trangThaiQuyDoiDiem, setTrangThaiQuyDoiDiem] = useState<ETrangThaiSinhVienDot>(
		ETrangThaiSinhVienDot.CHO_XU_LY,
	);
	const [viewRaQuyetDinh, setViewRaQuyetDinh] = useState<boolean>(false);
	const [segmentSelected, setSegmentSelected] = useState<string>('1');

	const getData = () =>
		getModel(
			{
				dotDangKyQuyDoiDiemId: recDot?._id,
				trangThai: trangThaiQuyDoiDiem,
			},
			trangThaiQuyDoiDiem === ETrangThaiSinhVienDot.CHO_XU_LY
				? [
						{
							active: true,
							field: 'diemHe10',
							values: [''],
							operator: segmentSelected === '2' ? EOperatorType.NOT_NULL : EOperatorType.NULL,
						},
				  ]
				: undefined,
		);

	useEffect(() => {
		getData();
	}, [segmentSelected]);

	const hanldeKhongCongNhan = (rec: DotQuyDoiDiem.IQuyDoiDiemSinhVien) => {
		khongCongNhanQuyDoiModel(rec._id, { ...rec, trangThai: ETrangThaiSinhVienDot.KHONG_DUYET })
			.then(() => getData())
			.catch((err) => console.log(err));
	};

	const onCell = (rec: DotQuyDoiDiem.IQuyDoiDiemSinhVien) => ({
		onClick: () => handleViewQuyDoi(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DotQuyDoiDiem.IQuyDoiDiemSinhVien>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
			render: (val, rec) => (
				<a
					onClick={() => {
						setRecord(rec);
						handleView();
					}}
				>
					{val}
				</a>
			),
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Minh chứng',
			width: 200,
			render: (val, rec) =>
				rec.danhSachMinhChungQuyDoi?.map((item) => (
					<div key={item._id}>
						- {item?.loai}
						{item?.tenChungChi ? <>: {item?.tenChungChi} </> : null}
						{item?.tenHocPhan ? <>: {item?.tenHocPhan}</> : null}
					</div>
				)),
			hide: trangThaiQuyDoiDiem === ETrangThaiSinhVienDot.DA_RA_QUYET_DINH,
			onCell,
		},
		{
			title: 'Học phần quy đổi',
			width: 250,
			children: [
				{
					title: 'Tên học phần',
					dataIndex: 'maHocPhan',
					width: 170,
					filterType: 'customselect',
					filterCustomSelect: <SelectHocPhan multiple />,
					render: (val, rec) => `${rec.maHocPhan} - ${rec.hocPhan?.ten}`,
					onCell,
				},
				{
					title: 'Số tín chỉ',
					dataIndex: 'maHocPhan',
					align: 'center',
					width: 80,
					render: (val, rec) => rec.hocPhan?.soTinChi,
					onCell,
				},
			],
		},
		{
			title: 'Kết quả quy đổi',
			width: 240,
			children: [
				{
					title: 'Điểm thang 10',
					dataIndex: 'diemHe10',
					align: 'center',
					width: 80,
					filterType: 'number',
					sortable: true,
					onCell,
				},
				{
					title: 'Điểm thang 4',
					dataIndex: 'diemHe4',
					align: 'center',
					width: 80,
					filterType: 'number',
					sortable: true,
					onCell,
				},
				{
					title: 'Điểm chữ',
					dataIndex: 'diemChu',
					align: 'center',
					width: 80,
					onCell,
				},
			],
			hide:
				trangThaiQuyDoiDiem !== ETrangThaiSinhVienDot.DA_RA_QUYET_DINH &&
				trangThaiQuyDoiDiem !== ETrangThaiSinhVienDot.CHO_XU_LY,
		},
		{
			title: 'Phòng ban cho ý kiến',
			dataIndex: 'hoTenNguoiChoYKien',
			width: 200,
			render: (val, rec) =>
				val ? (
					<>
						{val}: {rec.ghiChu}
						{rec.thoiGianChoYKien ? ` (${dayjs(rec.thoiGianChoYKien).format('HH:mm DD/MM/YYYY')})` : ''}
					</>
				) : (
					<Tag color='blue'>Chưa cho ý kiến</Tag>
				),
			hide: trangThaiQuyDoiDiem === ETrangThaiSinhVienDot.DA_RA_QUYET_DINH,
			onCell,
		},
		{
			title: 'Số QĐ',
			dataIndex: 'soQuyetDinh',
			width: 100,
			align: 'center',
			filterType: 'string',
			sortable: true,
			hide: trangThaiQuyDoiDiem !== ETrangThaiSinhVienDot.DA_RA_QUYET_DINH,
			onCell,
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'thoiGianBanHanh',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			hide: trangThaiQuyDoiDiem !== ETrangThaiSinhVienDot.DA_RA_QUYET_DINH,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						onClick={() => handleEdit(rec)}
						tooltip='Chỉnh sửa kết quả'
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => hanldeKhongCongNhan(rec)}
						title='Bạn có chắc chắn không duyệt quy đổi điểm cho sinh viên?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Không công nhận' danger type='link' icon={<CloseOutlined />} />
					</Popconfirm>
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa sinh viên này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
			hide: trangThaiQuyDoiDiem !== ETrangThaiSinhVienDot.CHO_XU_LY,
		},
	];

	return (
		<>
			<Card title={intl.formatMessage({ id: 'ketquahoctap.sinhvienquydoidiem.title' })}>
				<FilterDotQuyDoi />

				{recDot?._id ? (
					<>
						<StatSinhVienQuyDoiDiem setTrangThaiQuyDoiDiem={setTrangThaiQuyDoiDiem} />
						<Tabs
							activeKey={trangThaiQuyDoiDiem}
							onChange={(tab) => {
								setTrangThaiQuyDoiDiem(tab as ETrangThaiSinhVienDot);
								setSelectedIds([]);
							}}
						>
							{Object.values(ETrangThaiSinhVienDot).map((item) => (
								<Tabs.TabPane tab={item} key={item} />
							))}
						</Tabs>

						{trangThaiQuyDoiDiem === ETrangThaiSinhVienDot.CHO_XU_LY ? (
							<Segmented
								value={segmentSelected}
								options={[
									{ value: '1', label: 'Chưa có điểm quy đổi' },
									{ value: '2', label: 'Đã có điểm quy đổi' },
								]}
								onChange={(val) => setSegmentSelected(val.toString())}
								style={{ marginBottom: 12 }}
							/>
						) : null}

						<TableBase
							getData={getData}
							columns={columns}
							params={{ dotDangKyQuyDoiDiemId: recDot?._id, trangThai: trangThaiQuyDoiDiem }}
							dependencies={[page, limit, recDot?._id, trangThaiQuyDoiDiem]}
							modelName='daotaov2.ketquahoctap.quydoidiem.quydoidiemsinhvien'
							Form={FormQuyDoiDiemSinhVien}
							formProps={{ getData }}
							widthDrawer={1000}
							hideCard
							title={intl.formatMessage({ id: 'ketquahoctap.sinhvienquydoidiem.title' })}
							buttons={{
								create: trangThaiQuyDoiDiem === ETrangThaiSinhVienDot.CHO_XU_LY,
								import: trangThaiQuyDoiDiem === ETrangThaiSinhVienDot.CHO_XU_LY,
								export: true,
							}}
							rowSelection={trangThaiQuyDoiDiem === ETrangThaiSinhVienDot.CHO_XU_LY}
							otherButtons={
								trangThaiQuyDoiDiem === ETrangThaiSinhVienDot.CHO_XU_LY
									? [
											<ButtonExtend
												hidden={!selectedIds?.length}
												icon={<CheckCircleOutlined />}
												key='quyet-dinh'
												onClick={() => setViewRaQuyetDinh(true)}
												type='primary'
											>
												{`Ra quyết định cho ${selectedIds?.length} sinh viên`}
											</ButtonExtend>,
									  ]
									: undefined
							}
						/>
					</>
				) : (
					<Empty style={{ marginTop: 32, marginBottom: 32 }} description='Chưa có đợt quy đổi điểm' />
				)}
			</Card>

			<ModalQuyetDinhQuyDoiDiem visibleForm={viewRaQuyetDinh} setVisibleForm={setViewRaQuyetDinh} getData={getData} />

			<ModalChiTietSinhVien sinhVienSsoId={record?.sinhVienSsoId ?? ''} hasDetail />
		</>
	);
};

export default QuyDoiDiemSinhVienPage;
