import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import SelectNganh from '@/pages/DaoTaoV2/DanhMucHeThong/Bo/Nganh/components/SelectNganh';
import SelectQuyetDinh from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/QuyetDinh/components/Select';
import ViewQuyetDinh from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/QuyetDinh/components/View';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import type { QuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/QuyetDinh/typing';
import { ELoaiQuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { ETrangThaiSinhVienBaoLuu } from '@/services/DaoTaoV2/SinhVien/constant';
import { CheckCircleOutlined, NotificationOutlined, RetweetOutlined } from '@ant-design/icons';
import { Card, Modal, Popconfirm, Segmented, Space, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import StatSinhVienBaoLuu from './Stat';

const QuyetDinhSinhVienPage = () => {
	const intl = useIntl();
	const {
		page,
		limit,
		getModel,
		xuLySinhVienBaoLuuModel,
		setFilters,
		filters,
		thongKeSinhVienBaoLuuModel,
		selectedIds,
		setSelectedIds,
		loading,
	} = useModel('daotaov2.quyetdinh.baoluu');
	const {
		handleView: handleViewQuyetDinh,
		getByIdModel: getQuyetDinh,
		visibleForm: visibleQuyetDinh,
		setVisibleForm: setVisibleQuyetDinh,
	} = useModel('daotaov2.quyetdinh.quyetdinh');
	const [activeTab, setActiveTab] = useState<ETrangThaiSinhVienBaoLuu>(ETrangThaiSinhVienBaoLuu.DANG_BAO_LUU);
	const [segmentDangBaoLuu, setSegmentDangBaoLuu] = useState<string>('1');

	const getData = () => getModel({ trangThaiBaoLuu: activeTab });

	const onChangeThoiGian = (value: string) => {
		setSegmentDangBaoLuu(value);
		const temp = [...(filters ?? [])].filter((item) => item.field !== 'thoiGianKetThuc');

		if (value === '1') setFilters(temp);
		else if (value === '2') {
			const oneMonthFromNow = dayjs().add(1, 'months').toISOString();
			setFilters([
				...temp,
				{
					field: 'thoiGianKetThuc',
					operator: EOperatorType.BETWEEN,
					values: [dayjs().toISOString(), oneMonthFromNow],
					active: true,
				},
			]);
		} else if (value === '3') {
			setFilters([
				...temp,
				{
					field: 'thoiGianKetThuc',
					operator: EOperatorType.LESS_THAN,
					values: [dayjs().toISOString()],
					active: true,
				},
			]);
		}
	};

	const onChangeTab = (tab: ETrangThaiSinhVienBaoLuu) => {
		setActiveTab(tab);
		onChangeThoiGian('1');
	};

	const handleQuyLaiHoc = (idBaoLuu: string) => {
		xuLySinhVienBaoLuuModel(idBaoLuu, ETrangThaiSinhVienBaoLuu.QUAY_LAI_HOC)
			.then(() => (thongKeSinhVienBaoLuuModel(), getData()))
			.catch((err) => console.log(err));
	};

	const handleQuyLaiHocMuntiple = (idBaoLuu: string[]) => {
		for (const id of idBaoLuu) {
			xuLySinhVienBaoLuuModel(id, ETrangThaiSinhVienBaoLuu.QUAY_LAI_HOC)
				.then(() => {
					thongKeSinhVienBaoLuuModel();
					getData();
					setSelectedIds([]);
				})
				.catch((err) => console.log(err));
		}
	};

	const columns: IColumn<QuyetDinh.ISinhVienBaoLuuThoiHoc>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Thời gian bảo lưu',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			render: (val) => {
				if (!val) return null;
				const oneMonthAhead = dayjs().add(1, 'months');
				return (
					<span
						style={{
							color: dayjs().isAfter(val, 'd') ? 'red' : oneMonthAhead.isAfter(val, 'd') ? 'orange' : undefined,
						}}
					>
						{dayjs(val).format('DD/MM/YYYY')}
					</span>
				);
			},
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Quyết định',
			dataIndex: 'quyetDinhId',
			align: 'center',
			filterType: 'customselect',
			filterCustomSelect: <SelectQuyetDinh multiple loai={ELoaiQuyetDinh.BAO_LUU} />,
			width: 120,
			render: (val, rec) =>
				val && (
					<a href='#!' onClick={() => getQuyetDinh(val).then((recs) => handleViewQuyetDinh(recs))}>
						{rec.quyetDinh?.soQuyetDinh}
					</a>
				),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Khóa',
			dataIndex: 'maKhoaSinhVien',
			width: 120,
			render: (val, rec) => rec.khoaSinhVien?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien multiple selectMa />,
		},
		{
			title: 'Ngành',
			dataIndex: 'maNganh',
			width: 180,
			render: (val, rec) => rec.nganh?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganh multiple selectMa />,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Popconfirm
						onConfirm={() => handleQuyLaiHoc(rec._id)}
						title='Xác nhận cho sinh viên quay lại học?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Quy lại học' type='link' icon={<RetweetOutlined />} />
					</Popconfirm>

					<Popconfirm
						// onConfirm={() => deleteModel(rec._id)}
						title='Bạn gửi thông báo cho sinh viên?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Thông báo' type='link' className='text-success' icon={<NotificationOutlined />} />
					</Popconfirm>
				</>
			),
			hide: activeTab !== ETrangThaiSinhVienBaoLuu.DANG_BAO_LUU,
		},
	];

	return (
		<>
			<Card title={intl.formatMessage({ id: 'danhmuchethong.coso.quyetdinh.baoluu.danhsach' })}>
				<StatSinhVienBaoLuu onChange={onChangeTab} />

				<Tabs activeKey={activeTab} onChange={(tab) => onChangeTab(tab as ETrangThaiSinhVienBaoLuu)}>
					{Object.values(ETrangThaiSinhVienBaoLuu).map((item) => (
						<Tabs.TabPane tab={item} key={item} />
					))}
				</Tabs>

				<TableBase
					getData={getData}
					columns={columns}
					dependencies={[page, limit, activeTab]}
					modelName={'quyetdinh.baoluu'}
					hideCard
					rowSelection
					params={{ trangThaiBaoLuu: activeTab }}
					buttons={{ create: false, export: true }}
					otherButtons={
						activeTab === ETrangThaiSinhVienBaoLuu.DANG_BAO_LUU
							? [
									<>
										<Space>
											<Segmented
												key='1'
												value={segmentDangBaoLuu}
												onChange={(value) => onChangeThoiGian(value.toString())}
												options={[
													{ value: '1', label: 'Tất cả' },
													{ value: '2', label: 'Gần đến hạn' },
													{ value: '3', label: 'Quá hạn bảo lưu' },
												]}
											/>
											{selectedIds?.length ? (
												<Popconfirm
													onConfirm={() => handleQuyLaiHocMuntiple(selectedIds)}
													title={`Xác nhận cho ${selectedIds?.length} sinh viên quay lại học?`}
													placement='topRight'
												>
													<ButtonExtend
														loading={loading}
														icon={<CheckCircleOutlined />}
														key='quay-lai-hoc'
														type='primary'
													>
														{`Quay lại học cho ${selectedIds?.length} sinh viên`}
													</ButtonExtend>
												</Popconfirm>
											) : null}
										</Space>
									</>,
							  ]
							: undefined
					}
				/>
			</Card>

			<Modal
				open={visibleQuyetDinh}
				onCancel={() => setVisibleQuyetDinh(false)}
				footer={null}
				styles={{ padding: 0 }}
				width={1000}
			>
				<ViewQuyetDinh />
			</Modal>
		</>
	);
};

export default QuyetDinhSinhVienPage;
