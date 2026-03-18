import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import { type DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import { ColorTrangThaiDonMotCua, TrangThaiDonDVMC } from '@/services/DVMC/constants';
import { includes } from '@/utils/utils';
import {
	CheckOutlined,
	CloseOutlined,
	CopyOutlined,
	DeleteOutlined,
	EyeOutlined,
	FileDoneOutlined,
	FileTextOutlined,
	MenuOutlined,
	QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, Modal, Popconfirm, Popover, Select, Tabs, Tag, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ThanhToan from '../../ThanhToan';
import FormQuyTrinh from '../../components/FormQuyTrinh';
import TableLichSuTraKetQua from '../../components/TableLichSuTraKetQua';

const TableQuanLyDon = (props: { hideFilter?: boolean; type?: string; isDashboard?: boolean }) => {
	const {
		chuyenVienDieuPhoiGetDonModel,
		adminGetTrangThaiDonModel,
		getDonThaoTacAdminModel,
		page,
		limit,
		condition,
		trangThaiQuanLyDon,
		trangThaiQuanLyDonThaoTac,
		danhSach,
		record,
		setRecord,
		visibleFormDon,
		setVisibleFormDon,
		recordDon,
		setRecordDonThaoTac,
		setRecordDon,
		exportDonModel,
		setTotal,
		setDanhSachDon,
		isDonCanXuLy,
		setIsDonCanXuLy,
		adminDeleteDonModel,
		typeTraKetQua,
		updateTrangThaiNhanKetQuaModel,
		chuyenVienDieuPhoiGetDonThongKeModel,
		setCondition,
		setIsDashBoard,
	} = useModel('dvmc.dichvumotcuav2');

	const { getThongTinSinhVienBySsoIdModel, record: infoNguoiTaoDon } = useModel('sinhvien.sinhvien');
	const [type, setType] = useState<'handle' | 'view' | 'create' | 'edit'>('handle');
	const { pathname } = window.location;

	useEffect(() => {
		return () => {
			setTotal(0);
			setDanhSachDon([]);
		};
	}, []);
	// useEffect(() => {
	// 	if (props?.initCondition) {
	// 		setCondition({ ...condition, ...props?.initCondition });
	// 	}
	// }, [props?.initCondition]);
	const onClickMenuExport = (
		idDon: string,
		item: { key: 'word' | 'pdf' },
		mauExport: 'MAU_DON' | 'TRA_LOI',
		tenDon: string,
	) => {
		exportDonModel({
			idDon,
			mauExport,
			exportType: item.key,
			tenDon,
		});
	};

	const handleDon = (recordDonColumn: DichVuMotCuaV2.Don) => {
		getThongTinSinhVienBySsoIdModel(recordDonColumn?.thongTinNguoiTao?.ssoId);
		setRecordDon(recordDonColumn);
		adminGetTrangThaiDonModel(recordDonColumn?._id);
		getDonThaoTacAdminModel(undefined, { idDon: recordDonColumn?._id }, 1, 100);

		setVisibleFormDon(true);
		setType('view');
	};

	const getData = () => {
		if (props?.isDashboard) {
			chuyenVienDieuPhoiGetDonThongKeModel('DVMC');
		} else {
			chuyenVienDieuPhoiGetDonModel('DVMC');
		}
	};

	const onCell = (recordDonColumn: DichVuMotCuaV2.Don) => ({
		onClick: () => {
			// getCsvcByIdModel(recordDonColumn?.idCoSoVatChat ?? '');
			handleDon(recordDonColumn);
			setIsDashBoard(props?.isDashboard ?? false);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DichVuMotCuaV2.Don>[] = [
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			align: 'center',
			width: 120,
			render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Loại đơn',
			dataIndex: ['thongTinDichVu', 'ten'],
			align: 'center',
			width: 200,
			onCell,
		},
		{
			title: 'Người tạo',
			dataIndex: ['thongTinNguoiTao', 'hoTen'],
			width: 120,
			align: 'center',
			onCell,
			filterType: 'string',
		},
		{
			title: 'Mã sinh viên',
			dataIndex: ['thongTinNguoiTao', 'maSinhVien'],
			width: 150,
			align: 'center',
			onCell,
			filterType: 'string',
		},
		{
			title: 'Địa chỉ nhận đơn',
			width: 200,
			align: 'center',
			// onCell,
			render: (recordTemp: DichVuMotCuaV2.Don) => {
				let isNhanTaiTruong = true;
				const blockNhanDon = recordTemp?.thongTinDichVu?.cauHinhBieuMau?.find(
					(item) => item.label === 'Phương thức nhận đơn',
				);
				let diaChiNhanDon = 'Nhận tại trường';
				if (blockNhanDon?.value === 'Nhận tại trường') diaChiNhanDon = 'Nhận tại trường';
				else {
					const valueChuyenPhatNhanh = blockNhanDon?.dataSource
						?.find((item) => item.label === 'Chuyển phát nhanh')
						?.relatedElement?.find((item) => item.type === 'DON_VI_HANH_CHINH')?.value;
					diaChiNhanDon = [
						valueChuyenPhatNhanh?.soNhaTenDuong,
						valueChuyenPhatNhanh?.tenPhuongXa,
						valueChuyenPhatNhanh?.tenQuanHuyen,
						valueChuyenPhatNhanh?.tenTinh,
					]
						?.filter((item) => item !== null && item !== undefined && item !== '')
						?.join(', ');
					if (diaChiNhanDon) isNhanTaiTruong = false;
				}
				return (
					<div>
						{isNhanTaiTruong === false && (
							<Tooltip title='Sao chép địa chỉ'>
								<CopyOutlined
									onClick={() => {
										navigator.clipboard.writeText(diaChiNhanDon);
										message.success('Đã copy địa chỉ');
									}}
									style={{ marginRight: 8, fontSize: 18 }}
								/>
							</Tooltip>
						)}
						{diaChiNhanDon}
					</div>
				);
			},
		},
		{
			title: 'Bước',
			width: 150,
			onCell,
			align: 'center',
			dataIndex: 'idBuocHienTai',
			render: (val, recordRender) => {
				return (
					<div>{recordRender?.thongTinDichVu?.quyTrinh?.danhSachBuoc?.find((item) => item._id === val)?.ten ?? ''}</div>
				);
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			// search: 'filterString',
			render: (val: 'OK' | 'NOT_OK' | 'PROCESSING') => (
				<Tag
					color={
						TrangThaiDonDVMC?.[val] === TrangThaiDonDVMC.PROCESSING
							? ColorTrangThaiDonMotCua.PROCESSING
							: TrangThaiDonDVMC?.[val] === TrangThaiDonDVMC.OK
								? ColorTrangThaiDonMotCua.OK
								: ColorTrangThaiDonMotCua.NOT_OK
					}
				>
					{TrangThaiDonDVMC?.[val] ?? 'Chưa cập nhật'}
				</Tag>
			),
			onCell,
		},
		{
			title: 'Trạng thái thanh toán',
			dataIndex: 'trangThaiThanhToan',
			width: 120,
			align: 'center',
			render: (val) => <div>{val || 'Dịch vụ không tính phí'}</div>,
			onCell,
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 70,
			fixed: 'right',
			render: (recordDonColumn: DichVuMotCuaV2.Don) => {
				return (
					<Popover
						content={
							<>
								<Tooltip title='Xuất mẫu đơn'>
									<Dropdown
										overlay={
											<Menu
												onClick={(item: any) =>
													onClickMenuExport(
														recordDonColumn?._id ?? '',
														item,
														'MAU_DON',
														`BieuMau_${recordDonColumn?.thongTinDichVu?.ten}_${recordDonColumn?.thongTinNguoiTao?.maSinhVien}_${recordDonColumn?.thongTinNguoiTao?.hoTen}`,
													)
												}
											>
												<Menu.Item key='word'>Tải về</Menu.Item>
												<Menu.Item key='pdf'>In mẫu</Menu.Item>
											</Menu>
										}
									>
										<Button type='link' icon={<FileTextOutlined />} shape='circle' />
									</Dropdown>
								</Tooltip>
								<Divider type='vertical' />

								<Tooltip title='Xuất mẫu trả kết quả'>
									<Dropdown
										overlay={
											<Menu
												onClick={(item: any) =>
													onClickMenuExport(
														recordDonColumn?._id ?? '',
														item,
														'TRA_LOI',
														`KetQua_${recordDonColumn?.thongTinDichVu?.ten}_${recordDonColumn?.thongTinNguoiTao?.maSinhVien}_${recordDonColumn?.thongTinNguoiTao?.hoTen}`,
													)
												}
											>
												<Menu.Item key='word'>Tải về</Menu.Item>
												<Menu.Item key='pdf'>In mẫu</Menu.Item>
											</Menu>
										}
									>
										<Button type='link' icon={<FileDoneOutlined />} shape='circle' />
									</Dropdown>
								</Tooltip>
								<Divider type='vertical' />

								<Tooltip title='Chi tiết'>
									<Button
										onClick={() => {
											handleDon(recordDonColumn);
										}}
										shape='circle'
										type='link'
										icon={<EyeOutlined />}
									/>
								</Tooltip>
								<Divider type='vertical' />

								<Tooltip title='Trả lời phản hồi'>
									<Button
										type='link'
										disabled={!recordDonColumn?.noiDungPhanHoi || recordDonColumn.daTraLoiPhanHoi}
										onClick={() => {
											setRecordDon(recordDonColumn);
											// setVisibleForm(true);
										}}
										icon={<QuestionCircleOutlined />}
										shape='circle'
									/>
								</Tooltip>
								{typeTraKetQua === 'CHUA_TRA_KQ' && (
									<>
										<Divider type='vertical' />
										<Tooltip title='Xác nhận đã trả đơn'>
											<Popconfirm
												title='Bạn có chắc muốn thay đổi trạng thái trả kết quả không?'
												onConfirm={() => updateTrangThaiNhanKetQuaModel(recordDonColumn?._id ?? '', true, getData)}
											>
												<Button type='link' icon={<CheckOutlined />} shape='circle' />
											</Popconfirm>
										</Tooltip>
									</>
								)}
								{typeTraKetQua === 'DA_TRA_KQ' && (
									<>
										<Divider type='vertical' />
										<Tooltip title='Xác nhận lại chưa trả đơn'>
											<Popconfirm
												title='Bạn có chắc muốn thay đổi trạng thái trả kết quả không?'
												onConfirm={() => updateTrangThaiNhanKetQuaModel(recordDonColumn?._id ?? '', false, getData)}
											>
												<Button type='link' icon={<CloseOutlined />} shape='circle' />
											</Popconfirm>
										</Tooltip>
									</>
								)}

								{trangThaiQuanLyDon === 'PROCESSING' && (
									<>
										<Divider type='vertical' />
										<Tooltip title='Xóa đơn'>
											<Popconfirm
												onConfirm={async () => {
													await adminDeleteDonModel(
														recordDonColumn?._id ?? '',
														pathname?.includes('quanlydondieuphoi') ? 'dieuphoi' : 'tiepnhan',
													);
													// if (pathname?.includes('quanlydondieuphoi')) {
													//   chuyenVienDieuPhoiGetTongSoDonDVMCModel(isDonCanXuLy);
													// } else {
													//   chuyenVienXuLyGetTongSoDonDVMCModel(isDonCanXuLy);
													// }
												}}
												title='Bạn có chắc chắn xóa đơn này?'
											>
												<Button type='link' danger icon={<DeleteOutlined />} shape='circle' />
											</Popconfirm>
										</Tooltip>
									</>
								)}
							</>
						}
						placement='left'
					>
						<Button icon={<MenuOutlined />} type='link' />
					</Popover>
				);
			},
		},
	];
	const columnsThaoTac: IColumn<DichVuMotCuaV2.Don>[] = [
		{
			title: 'STT',
			dataIndex: 'index',
			align: 'center',
			width: 80,
			onCell,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			align: 'center',
			width: 120,
			render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Loại đơn',
			dataIndex: ['idDon', 'thongTinDichVu', 'ten'],
			align: 'center',
			width: 200,
			onCell,
		},
		{
			title: 'Người tạo',
			dataIndex: ['idDon', 'thongTinNguoiTao', 'hoTen'],
			width: 120,
			align: 'center',
			onCell,
			filterType: 'string',
			// notRegex: true,
		},
		{
			title: 'Mã sinh viên',
			dataIndex: ['idDon', 'thongTinNguoiTao', 'maSinhVien'],
			width: 150,
			align: 'center',
			onCell,
			filterType: 'string',
			// notRegex: true,
		},
		{
			title: 'Địa chỉ nhận đơn',
			width: 200,
			align: 'center',
			// onCell,
			render: (recordTemp: DichVuMotCuaV2.Don) => {
				let isNhanTaiTruong = true;
				const blockNhanDon = recordTemp?.idDon?.thongTinDichVu?.cauHinhBieuMau?.find(
					(item: any) => item.label === 'Phương thức nhận đơn',
				);
				let diaChiNhanDon = '';
				if (blockNhanDon?.value === 'Nhận tại trường') diaChiNhanDon = 'Nhận tại trường';
				else {
					const valueChuyenPhatNhanh = blockNhanDon?.dataSource
						?.find((item: { label: string }) => item.label === 'Chuyển phát nhanh')
						?.relatedElement?.find((item: { type: string }) => item.type === 'DON_VI_HANH_CHINH')?.value;
					diaChiNhanDon = [
						valueChuyenPhatNhanh?.soNhaTenDuong,
						valueChuyenPhatNhanh?.tenPhuongXa,
						valueChuyenPhatNhanh?.tenQuanHuyen,
						valueChuyenPhatNhanh?.tenTinh,
					]
						?.filter((item) => item !== null && item !== undefined && item !== '')
						?.join(', ');
					if (diaChiNhanDon) isNhanTaiTruong = false;
				}
				return (
					<div>
						{isNhanTaiTruong === false && (
							<Tooltip title='Sao chép địa chỉ'>
								<CopyOutlined
									onClick={() => {
										navigator.clipboard.writeText(diaChiNhanDon);
										message.success('Đã copy địa chỉ');
									}}
									style={{ marginRight: 8, fontSize: 18 }}
								/>
							</Tooltip>
						)}
						{diaChiNhanDon}
					</div>
				);
			},
		},
		{
			title: 'Bước',
			width: 150,
			onCell,
			align: 'center',
			dataIndex: ['idDon', 'idBuocHienTai'],
			render: (val, recordRender) => {
				return (
					<div>
						{recordRender?.idDon?.thongTinDichVu?.quyTrinh?.danhSachBuoc?.find((item: { _id: any }) => item._id === val)
							?.ten ?? ''}
					</div>
				);
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: ['idDon', 'trangThai'],
			align: 'center',
			width: 120,
			// search: 'filterString',
			render: (val: 'OK' | 'NOT_OK' | 'PROCESSING') => (
				<Tag
					color={
						TrangThaiDonDVMC?.[val] === TrangThaiDonDVMC.PROCESSING
							? ColorTrangThaiDonMotCua.PROCESSING
							: TrangThaiDonDVMC?.[val] === TrangThaiDonDVMC.OK
								? ColorTrangThaiDonMotCua.OK
								: ColorTrangThaiDonMotCua.NOT_OK
					}
				>
					{TrangThaiDonDVMC?.[val] ?? 'Chưa cập nhật'}
				</Tag>
			),
			onCell,
		},
		{
			title: 'Trạng thái thanh toán',
			dataIndex: 'trangThaiThanhToan',
			width: 120,
			align: 'center',
			render: (val) => <div>{val || 'Dịch vụ không tính phí'}</div>,
			onCell,
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 70,
			fixed: 'right',
			render: (recordDonColumn: DichVuMotCuaV2.Don) => {
				return (
					<Popover
						content={
							<>
								<Tooltip title='Xuất mẫu đơn'>
									<Dropdown
										overlay={
											<Menu
												onClick={(item: any) =>
													onClickMenuExport(
														recordDonColumn?._id ?? '',
														item,
														'MAU_DON',
														`BieuMau_${recordDonColumn?.thongTinDichVu?.ten}_${recordDonColumn?.thongTinNguoiTao?.maSinhVien}_${recordDonColumn?.thongTinNguoiTao?.hoTen}`,
													)
												}
											>
												<Menu.Item key='word'>Tải về</Menu.Item>
												<Menu.Item key='pdf'>In mẫu</Menu.Item>
											</Menu>
										}
									>
										<Button icon={<FileTextOutlined />} shape='circle' />
									</Dropdown>
								</Tooltip>
								<Divider type='vertical' />

								<Tooltip title='Xuất mẫu trả kết quả'>
									<Dropdown
										overlay={
											<Menu
												onClick={(item: any) =>
													onClickMenuExport(
														recordDonColumn?._id ?? '',
														item,
														'TRA_LOI',
														`KetQua_${recordDonColumn?.thongTinDichVu?.ten}_${recordDonColumn?.thongTinNguoiTao?.maSinhVien}_${recordDonColumn?.thongTinNguoiTao?.hoTen}`,
													)
												}
											>
												<Menu.Item key='word'>Tải về</Menu.Item>
												<Menu.Item key='pdf'>In mẫu</Menu.Item>
											</Menu>
										}
									>
										<Button icon={<FileDoneOutlined />} shape='circle' />
									</Dropdown>
								</Tooltip>
								<Divider type='vertical' />

								<Tooltip title='Chi tiết'>
									<Button
										onClick={() => {
											handleDon(recordDonColumn);
										}}
										shape='circle'
										type='primary'
										icon={<EyeOutlined />}
									/>
								</Tooltip>
								<Divider type='vertical' />

								<Tooltip title='Trả lời phản hồi'>
									<Button
										disabled={!recordDonColumn?.noiDungPhanHoi || recordDonColumn.daTraLoiPhanHoi}
										onClick={() => {
											setRecordDon(recordDonColumn);
											// setVisibleForm(true);
										}}
										icon={<QuestionCircleOutlined />}
										shape='circle'
									/>
								</Tooltip>
								{typeTraKetQua === 'CHUA_TRA_KQ' && (
									<>
										<Divider type='vertical' />
										<Tooltip title='Xác nhận đã trả đơn'>
											<Popconfirm
												title='Bạn có chắc muốn thay đổi trạng thái trả kết quả không?'
												onConfirm={() => updateTrangThaiNhanKetQuaModel(recordDonColumn?._id ?? '', true, getData)}
											>
												<Button icon={<CheckOutlined />} shape='circle' />
											</Popconfirm>
										</Tooltip>
									</>
								)}
								{typeTraKetQua === 'DA_TRA_KQ' && (
									<>
										<Divider type='vertical' />
										<Tooltip title='Xác nhận lại chưa trả đơn'>
											<Popconfirm
												title='Bạn có chắc muốn thay đổi trạng thái trả kết quả không?'
												onConfirm={() => updateTrangThaiNhanKetQuaModel(recordDonColumn?._id ?? '', false, getData)}
											>
												<Button icon={<CloseOutlined />} shape='circle' />
											</Popconfirm>
										</Tooltip>
									</>
								)}

								{trangThaiQuanLyDon === 'PROCESSING' && (
									<>
										<Divider type='vertical' />
										<Tooltip title='Xóa đơn'>
											<Popconfirm
												onConfirm={async () => {
													await adminDeleteDonModel(
														recordDonColumn?._id ?? '',
														pathname?.includes('quanlydondieuphoi') ? 'dieuphoi' : 'tiepnhan',
													);
													// if (pathname?.includes('quanlydondieuphoi')) {
													//   chuyenVienDieuPhoiGetTongSoDonDVMCModel(isDonCanXuLy);
													// } else {
													//   chuyenVienXuLyGetTongSoDonDVMCModel(isDonCanXuLy);
													// }
												}}
												title='Bạn có chắc chắn xóa đơn này?'
											>
												<Button danger type='primary' icon={<DeleteOutlined />} shape='circle' />
											</Popconfirm>
										</Tooltip>
									</>
								)}
							</>
						}
						placement='left'
					>
						<Button icon={<MenuOutlined />} type='link' />
					</Popover>
				);
			},
		},
	];
	return (
		<TableBase
			columns={props.type === 'Thao tác' ? columnsThaoTac : columns}
			dependencies={[
				page,
				limit,
				condition,
				trangThaiQuanLyDon,
				trangThaiQuanLyDonThaoTac,
				record?._id,
				danhSach,
				isDonCanXuLy,
			]}
			modelName='dvmc.dichvumotcuav2'
			dataState='danhSachDon'
			scroll={{ x: 1350 }}
			getData={getData}
			buttons={{ create: false }}
			hideCard
			otherButtons={[
				<>
					{props.hideFilter !== true && (
						<Select
							allowClear
							placeholder='Lọc theo loại dịch vụ'
							onChange={(val: string | undefined) => {
								// setIdDichVu(val);
								setRecord(
									val
										? danhSach?.find((item) => item._id === val)
										: ({
												_id: {
													$in: danhSach?.map((item) => item._id),
												},
											} as any),
								);
							}}
							showSearch
							filterOption={(value, option) => includes(option?.props.children, value)}
							value={typeof record?._id === 'string' ? record?._id : undefined}
							style={{ width: '400px' }}
						>
							{danhSach?.map((item) => (
								<Select.Option key={item._id} value={item._id}>
									{item.ten}
								</Select.Option>
							))}
						</Select>
					)}
				</>,
			]}
		>
			{/*{trangThaiQuanLyDon === 'PROCESSING' && props?.type !== 'Thao tác' && (*/}
			{/*  <Select*/}
			{/*    onChange={(val) => {*/}
			{/*      setIsDonCanXuLy(val);*/}
			{/*      // if (pathname?.includes('quanlydondieuphoi')) {*/}
			{/*      //   chuyenVienDieuPhoiGetTongSoDonDVMCModel(val);*/}
			{/*      // } else {*/}
			{/*      //   chuyenVienXuLyGetTongSoDonDVMCModel(val);*/}
			{/*      // }*/}
			{/*    }}*/}
			{/*    style={{ marginRight: 8, width: 150 }}*/}
			{/*    value={isDonCanXuLy}*/}
			{/*  >*/}
			{/*    <Select.Option key={0} value={0}>*/}
			{/*      Tất cả đơn*/}
			{/*    </Select.Option>*/}
			{/*    <Select.Option key={1} value={1}>*/}
			{/*      Đơn cần xử lý*/}
			{/*    </Select.Option>*/}
			{/*  </Select>*/}
			{/*)}*/}

			<Modal
				destroyOnClose
				width='900px'
				footer={null}
				open={visibleFormDon}
				onCancel={() => {
					setVisibleFormDon(false);
				}}
			>
				<Tabs
					onChange={() => {
						setRecordDonThaoTac(undefined);
					}}
				>
					<Tabs.TabPane tab='Quy trình' key={0}>
						<FormQuyTrinh
							type='view'
							idDon={recordDon?._id}
							record={recordDon?.thongTinDichVu?.quyTrinh}
							thoiGianTaoDon={recordDon?.createdAt}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane tab='Biểu mẫu' key={1}>
						<Form
							hideCamKet
							infoNguoiTaoDon={infoNguoiTaoDon}
							type={type}
							onCancel={() => {
								setVisibleFormDon(false);
							}}
							record={recordDon}
						/>
					</Tabs.TabPane>
					{recordDon?.identityCode && (
						<Tabs.TabPane tab='Thông tin thanh toán' key={2}>
							<ThanhToan identityCode={recordDon?.identityCode} />
						</Tabs.TabPane>
					)}
					<Tabs.TabPane tab='Lịch sử trả kết quả' key={3}>
						<TableLichSuTraKetQua data={recordDon?.lichSuChinhSua ?? []} />
					</Tabs.TabPane>
				</Tabs>
			</Modal>
			{/*<Modal*/}
			{/*  footer={null}*/}
			{/*  open={visibleForm}*/}
			{/*  onCancel={() => setVisibleForm(false)}*/}
			{/*  styles={{ padding: 0 }}*/}
			{/*  width={600}*/}
			{/*>*/}
			{/*  <FormTraLoiPhanHoi getData={getData} />*/}
			{/*</Modal>*/}
		</TableBase>
	);
};

export default TableQuanLyDon;
