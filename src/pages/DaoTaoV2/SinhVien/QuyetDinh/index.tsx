import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectNganh from '@/pages/DaoTaoV2/DanhMucHeThong/Bo/Nganh/components/SelectNganh';
import SelectQuyetDinh from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/QuyetDinh/components/Select';
import ViewQuyetDinh from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/QuyetDinh/components/View';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/NamHoc/KhoaSinhVien/components/Select';
import type { QuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/QuyetDinh/typing';
import { ELoaiQuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { ETrangThaiSinhVienDot } from '@/services/DaoTaoV2/constant';
import { CheckCircleOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Card, Modal, Popconfirm, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormQuyetDinhSinhVien from './components/FormDuyet';
import FormKhongDuyet from './components/FormKhongDuyet';

const QuyetDinhSinhVienPage = (props: { isThoiHoc?: boolean }) => {
	const { isThoiHoc } = props;
	const intl = useIntl();
	const { page, limit, deleteModel, getModel, setRecord, setSelectedIds, selectedIds, setVisibleForm } = useModel(
		isThoiHoc ? 'quyetdinh.thoihoc' : 'quyetdinh.baoluu',
	);
	const {
		handleView: handleViewQuyetDinh,
		getOneModel: getQuyetDinh,
		visibleForm: visibleQuyetDinh,
		setVisibleForm: setVisibleQuyetDinh,
	} = useModel('daotaov2.quyetdinh.quyetdinh');
	const [viewKhongDuyet, setViewKhongDuyet] = useState<boolean>(false);
	const [trangThaiDuyet, setTrangThaiDuyet] = useState<ETrangThaiSinhVienDot>(ETrangThaiSinhVienDot.CHO_XU_LY);

	const getData = () => getModel({ trangThai: trangThaiDuyet });

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
			title: 'Thời gian thôi học',
			dataIndex: 'thoiGianHieuLuc',
			width: 120,
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
			hide: !isThoiHoc,
		},
		{
			title: 'Thời gian bảo lưu',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
			hide: isThoiHoc,
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			sortable: true,
			hide: isThoiHoc,
		},
		{
			title: 'Thời gian gửi yêu cầu',
			// dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			// render: (val, rec) => val && <a href='#!'>{val && dayjs(val).format('DD/MM/YYYY')}</a>,
			sortable: true,
			hide: trangThaiDuyet !== ETrangThaiSinhVienDot.CHO_XU_LY,
		},
		{
			title: 'Lý do ',
			dataIndex: 'lyDo',
			width: 150,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			hide: trangThaiDuyet !== ETrangThaiSinhVienDot.KHONG_DUYET,
		},
		{
			title: 'Quyết định',
			dataIndex: 'quyetDinhId',
			align: 'center',
			filterType: 'customselect',
			filterCustomSelect: (
				<SelectQuyetDinh multiple loai={isThoiHoc ? ELoaiQuyetDinh.THOI_HOC : ELoaiQuyetDinh.BAO_LUU} />
			),
			width: 120,
			hide: trangThaiDuyet !== ETrangThaiSinhVienDot.DA_RA_QUYET_DINH,
			render: (val, rec) =>
				val && (
					<a href='#!' onClick={() => getQuyetDinh({ _id: val }).then((recs) => handleViewQuyetDinh(recs))}>
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
			width: 100,
			render: (val, rec) => rec.khoaSinhVien?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien multiple selectMa />,
		},
		{
			title: 'Ngành',
			dataIndex: 'maNganh',
			width: 150,
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
					<ButtonExtend
						tooltip='Không duyệt'
						type='link'
						danger
						icon={<CloseOutlined />}
						onClick={() => {
							setRecord(rec);
							setViewKhongDuyet(true);
						}}
					/>

					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa sinh viên này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
			hide: trangThaiDuyet !== ETrangThaiSinhVienDot.CHO_XU_LY,
		},
	];

	return (
		<>
			<Card
				title={
					isThoiHoc
						? intl.formatMessage({ id: 'danhmuchethong.coso.quyetdinh.thoihoc' })
						: intl.formatMessage({ id: 'danhmuchethong.coso.quyetdinh.baoluu' })
				}
			>
				<Tabs
					activeKey={trangThaiDuyet}
					onChange={(tab) => {
						setTrangThaiDuyet(tab as ETrangThaiSinhVienDot);
						setSelectedIds([]);
					}}
				>
					{Object.values(ETrangThaiSinhVienDot)
						.slice(0, 3)
						.map((item) => (
							<Tabs.TabPane tab={item} key={item} />
						))}
				</Tabs>

				<TableBase
					getData={getData}
					columns={columns}
					dependencies={[page, limit, trangThaiDuyet]}
					modelName={isThoiHoc ? 'quyetdinh.thoihoc' : 'quyetdinh.baoluu'}
					Form={FormQuyetDinhSinhVien}
					formProps={{ isThoiHoc, getData }}
					widthDrawer={1000}
					hideCard
					title={
						isThoiHoc
							? intl.formatMessage({ id: 'danhmuchethong.coso.quyetdinh.thoihoc' })
							: intl.formatMessage({ id: 'danhmuchethong.coso.quyetdinh.baoluu' })
					}
					buttons={{
						create: false,
						import: trangThaiDuyet === ETrangThaiSinhVienDot.CHO_XU_LY,
						export: true,
					}}
					params={{ trangThai: trangThaiDuyet }}
					otherProps={{ trangThai: trangThaiDuyet }}
					rowSelection={trangThaiDuyet === ETrangThaiSinhVienDot.CHO_XU_LY}
					deleteMany
					otherButtons={
						trangThaiDuyet === ETrangThaiSinhVienDot.CHO_XU_LY
							? [
									<ButtonExtend
										icon={<CheckCircleOutlined />}
										key='quyet-dinh'
										onClick={() => setVisibleForm(true)}
										type='primary'
									>
										{!!selectedIds?.length ? `Ra quyết định cho ${selectedIds?.length} sinh viên` : 'Thêm quyết định'}
									</ButtonExtend>,
							  ]
							: undefined
					}
				/>
			</Card>

			<Modal
				open={viewKhongDuyet}
				title={`Không duyệt ${
					isThoiHoc
						? intl.formatMessage({ id: 'danhmuchethong.coso.quyetdinh.thoihoc' })
						: intl.formatMessage({ id: 'danhmuchethong.coso.quyetdinh.baoluu' })
				}`}
				width={800}
				onCancel={() => setViewKhongDuyet(false)}
				footer={null}
			>
				<FormKhongDuyet
					isThoiHoc={isThoiHoc ?? false}
					visible={viewKhongDuyet}
					setVisible={setViewKhongDuyet}
					getData={getData}
				/>
			</Modal>

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
