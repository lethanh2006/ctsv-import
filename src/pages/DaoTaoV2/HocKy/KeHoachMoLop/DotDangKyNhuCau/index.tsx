import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import ModalDotDangKyNhuCau from './ModalDotDangKyNhuCau';

const DotDangKyNhuCauPage = () => {
	const { record: recordHocKy } = useModel('daotaov2.hocky.hocky');
	const { handleEdit, getModel, page, limit, deleteModel, putModel } = useModel('daotaov2.hocky.dotdangkynhucau');

	const getData = () => recordHocKy?.ma && getModel({ maHocKy: recordHocKy?.ma });

	const onCell = (record: DangKyNhuCau.IDotDangKy) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const onChecked = (rec: DangKyNhuCau.IDotDangKy, active: boolean) => {
		if (rec._id) putModel(rec._id, { active }, getData).catch((er) => console.log(er));
	};

	const columns: IColumn<DangKyNhuCau.IDotDangKy>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY HH:mm:ss'),
			align: 'center',
			onCell,
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY HH:mm:ss'),
			align: 'center',
			onCell,
		},
		{
			title: 'Trạng thái',
			width: 140,
			render: (val, rec) =>
				dayjs().diff(dayjs(rec.thoiGianKetThuc), 'day') > 0 ? (
					<Tag color='orange'>Đã kết thúc</Tag>
				) : dayjs(rec.thoiGianBatDau).diff(dayjs(), 'day') > 0 ? (
					<Tag color='yellow'>Chưa bắt đầu</Tag>
				) : rec.active ? (
					<Tag color='green'>Đang diễn ra</Tag>
				) : (
					<Tag color='blue'>Đang trong thời gian</Tag>
				),
			align: 'center',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: DangKyNhuCau.IDotDangKy) => (
				<>
					<Switch checked={!!record.active} size='small' onChange={(active) => onChecked(record, active)} />
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa đợt đăng ký này?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				params={{ maHocKy: recordHocKy?.ma }}
				dependencies={[page, limit, recordHocKy?.ma]}
				modelName='daotaov2.hocky.dotdangkynhucau'
				title='Đợt đăng ký nhu cầu'
				Form={ModalDotDangKyNhuCau}
				widthDrawer={800}
				rowSelection
				deleteMany
			/>
		</>
	);
};

export default DotDangKyNhuCauPage;
