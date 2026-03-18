import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ThanhToan from '@/pages/DichVuMotCuaV2/ThanhToan';
import Form from '@/pages/DichVuMotCuaV2/components/FormBieuMau';
import type { DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import { FileDoneOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, Modal, Select, Tabs, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useModel } from 'umi';

const TableQuanLyDon = () => {
	const {
		getDonThaoTacChuyenVienDieuPhoiModel,
		getDonThaoTacChuyenVienXuLyModel,
		page,
		limit,
		condition,
		loading,
		trangThaiQuanLyDonThaoTac,
		danhSach,
		record,
		setRecord,
		visibleFormBieuMau,
		setVisibleFormBieuMau,
		setRecordDonThaoTac,
		recordDonThaoTac,
		exportDonModel,
	} = useModel('dvmc.dichvumotcuav2');
	const { pathname } = window.location;
	const [type, setType] = useState<'handle' | 'view' | 'edit' | 'create'>('handle');
	const isDVMC = pathname?.includes('dichvumotcua') ?? false;

	const onClickMenuExport = (idDon: string, item: { key: 'word' | 'pdf' }, mauExport: 'MAU_DON' | 'TRA_LOI') => {
		exportDonModel({
			idDon,
			mauExport,
			exportType: item.key,
		});
	};
	const columns: IColumn<DichVuMotCuaV2.DonThaoTac>[] = [
		{
			title: 'Dịch vụ',
			width: 120,
			dataIndex: ['idDon', 'thongTinDichVu', 'ten'],
		},

		{
			title: 'Ngày tạo',
			dataIndex: ['idDon', 'createdAt'],
			width: 120,
			align: 'center',
			render: (val) => <span title={dayjs(val).format('DD/MM/YYYY HH:mm:ss')}>{dayjs(val).fromNow()}</span>,
		},
		{
			title: 'Hạn xử lý',
			dataIndex: 'hanXuLy',
			width: 120,
			align: 'center',
			render: (val) => <span>{dayjs(val).format('HH:mm DD/MM/YYYY')}</span>,
		},
		{
			title: 'Người gửi',
			dataIndex: ['nguoiTao', 'hoTen'],
			width: 150,
			align: 'center',
		},
		{
			title: 'Trạng thái thanh toán',
			dataIndex: ['idDon', 'trangThaiThanhToan'],
			width: 150,
			align: 'center',
			render: (val) => <div>{val || 'Dịch vụ không tính phí'}</div>,
		},
		{
			title: 'Đơn vị',
			dataIndex: 'tenDonVi',
			width: 180,
			align: 'center',
		},
		{
			title: 'Bước',
			dataIndex: 'idBuoc',
			width: 200,
			align: 'center',
			render: (val, recordDon) => (
				<div>
					{
						recordDon?.idDon?.thongTinDichVu?.quyTrinh?.danhSachBuoc?.find((item: { _id: any }) => item._id === val)
							?.ten
					}
				</div>
			),
		},
		{
			title: 'Tên thao tác',
			dataIndex: 'tenThaoTac',
			width: 200,
			align: 'center',
		},
		{
			title: 'Người được giao',
			dataIndex: ['nguoiDuocGiao', 'hoTen'],
			width: 150,
			align: 'center',
		},

		{
			title: 'Thao tác',
			align: 'center',
			fixed: 'right',
			width: 170,
			render: (recordDon: DichVuMotCuaV2.DonThaoTac) => (
				<>
					<Tooltip title='Xuất mẫu đơn'>
						<Dropdown
							overlay={
								<Menu onClick={(item: any) => onClickMenuExport(recordDon?._id ?? '', item, 'MAU_DON')}>
									<Menu.Item key='word'>Tải về</Menu.Item>
									<Menu.Item key='pdf'>In mẫu</Menu.Item>
								</Menu>
							}
						>
							<Button shape='circle' loading={loading} icon={<FileTextOutlined />} type='primary' />
						</Dropdown>
					</Tooltip>
					<Divider type='vertical' />
					<Tooltip title='Xuất mẫu trả kết quả'>
						<Dropdown
							overlay={
								<Menu onClick={(item: any) => onClickMenuExport(recordDon?._id ?? '', item, 'TRA_LOI')}>
									<Menu.Item key='word'>Tải về</Menu.Item>
									<Menu.Item key='pdf'>In mẫu</Menu.Item>
								</Menu>
							}
						>
							<Button shape='circle' loading={loading} icon={<FileDoneOutlined />} type='primary' />
						</Dropdown>
					</Tooltip>

					<Divider type='vertical' />
					{['PENDING'].includes(trangThaiQuanLyDonThaoTac) && (
						<Button
							style={{ padding: 0 }}
							onClick={() => {
								setRecordDonThaoTac(recordDon);
								setVisibleFormBieuMau(true);
								setType('handle');
							}}
							type='link'
						>
							Xử lý
						</Button>
					)}
					{['OK', 'NOT_OK'].includes(trangThaiQuanLyDonThaoTac) && (
						<Button
							style={{ padding: 0 }}
							type='link'
							shape='circle'
							onClick={() => {
								setRecordDonThaoTac(recordDon);
								setVisibleFormBieuMau(true);
								setType('view');
							}}
						>
							Chi tiết
						</Button>
					)}
				</>
			),
		},
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit, condition, trangThaiQuanLyDonThaoTac, record?._id, danhSach]}
			modelName='dichvumotcuav2'
			dataState='danhSachDonThaoTac'
			scroll={{ x: 1650 }}
			buttons={{ create: false }}
			getData={() => {
				if (pathname?.includes('quanlydondieuphoi'))
					getDonThaoTacChuyenVienDieuPhoiModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
				else getDonThaoTacChuyenVienXuLyModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
			}}
		>
			<Select
				allowClear
				placeholder='Lọc theo loại dịch vụ'
				onChange={(val: string | undefined) => {
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
				value={typeof record?._id === 'string' ? record?._id : undefined}
				style={{ width: '400px' }}
			>
				{danhSach?.map((item) => (
					<Select.Option key={item._id} value={item._id}>
						{item.ten}
					</Select.Option>
				))}
			</Select>

			<Modal
				destroyOnClose
				width='850px'
				footer={null}
				open={visibleFormBieuMau}
				onCancel={() => {
					setVisibleFormBieuMau(false);
				}}
			>
				<Tabs>
					<Tabs.TabPane tab='Biểu mẫu' key={0}>
						<Form
							hideCamKet
							infoNguoiTaoDon={recordDonThaoTac?.nguoiTao}
							type={type}
							record={recordDonThaoTac?.idDon}
						/>
					</Tabs.TabPane>
					{recordDonThaoTac?.idDon?.identityCode && (
						<Tabs.TabPane tab='Thông tin thanh toán' key={2}>
							<ThanhToan identityCode={recordDonThaoTac?.idDon?.identityCode} />
						</Tabs.TabPane>
					)}
				</Tabs>
			</Modal>
		</TableBase>
	);
};

export default TableQuanLyDon;
