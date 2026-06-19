import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import type { KyTucXa } from '@/services/KyTucXa/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import Form from './components/Form';

const getTrangThaiDot = (record: KyTucXa.IDotDangKyKTX) => {
	const now = dayjs();
	const thoiGianBatDau = record?.thoiGianBatDau ? dayjs(record.thoiGianBatDau) : undefined;
	const thoiGianKetThuc = record?.thoiGianKetThuc ? dayjs(record.thoiGianKetThuc) : undefined;

	if (thoiGianKetThuc && now.isAfter(thoiGianKetThuc)) return { label: 'Đã kết thúc', color: 'default' };
	if (thoiGianBatDau && thoiGianKetThuc && !now.isBefore(thoiGianBatDau) && !now.isAfter(thoiGianKetThuc)) {
		return { label: 'Đang diễn ra', color: 'success' };
	}

	return { label: 'Chưa diễn ra', color: 'processing' };
};

const DotDangKy = () => {
	const { page, limit, handleEdit, deleteModel, getModel } = useModel('kytucxa.dotdangky');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const getData = () => {
		if (recHocKy?.ma) getModel({ maHocKy: recHocKy?.ma });
	};

	const columns: IColumn<KyTucXa.IDotDangKyKTX>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'tenDot',
			width: 220,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Loại đợt',
			dataIndex: 'loaiDot',
			width: 140,
			filterType: 'string',
			render: (value) => (value === 'Theo khoa' ? 'Theo khóa' : value || '--'),
		},
		{
			title: 'Bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 170,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '--'),
		},
		{
			title: 'Kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 170,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '--'),
		},
		{
			title: 'Trạng thái',
			width: 130,
			align: 'center',
			render: (_value, record) => {
				const trangThai = getTrangThaiDot(record);
				return <Tag color={trangThai.color}>{trangThai.label}</Tag>;
			},
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			filterType: 'string',
			render: (value) => value || '--',
		},
		{
			title: 'Thao tác',
			width: 150,
			align: 'center',
			fixed: 'right',
			render: (_value, record) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					{/* <Tooltip title='Xem ID'>
						<Button
							onClick={() => {
								setSelectedId(record._id);
								setIsModalOpen(true);
							}}
							type='link'
						>
							ID
						</Button>
					</Tooltip> */}

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa đợt đăng ký này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit, recHocKy?.ma]}
			modelName='kytucxa.dotdangky'
			title='Đợt đăng ký ký túc xá'
			Form={Form}
			formProps={{ getData }}
			buttons={{ create: !!recHocKy?.ma }}
			widthDrawer={900}
			showModalTitle
		>
			<div style={{ marginBottom: 12 }}>
				<FilterHocKy isSetHocKy width={300} />
			</div>
		</TableBase>
	);
};

export default DotDangKy;
