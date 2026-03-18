import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './Form';
import { ELoaiHocLieu } from '@/services/DaoTaoV2/DanhMucHeThong/constant';

const HocLieuDeCuongPage = () => {
	const { getModel, page, limit, deleteModel, putModel, handleEdit } = useModel('daotaov2.hocphan.hoclieudecuong');
	const { record: recDeCuong } = useModel('daotaov2.hocphan.decuonghocphan');

	const columns: IColumn<HocPhan.IHocLieuDeCuong>[] = [
		{
			title: 'Tiêu đề',
			dataIndex: 'tieuDe',
			width: 200,
			filterType: 'string',
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Loại học liệu',
			dataIndex: 'loaiHocLieu',
			width: 120,
			filterType: 'select',
			filterData: Object.values(ELoaiHocLieu),
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 250,
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Tác giả',
			dataIndex: 'tacGia',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Nhà xuất bản',
			dataIndex: 'tenNhaXuatBan',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Năm xuất bản',
			dataIndex: 'namXuatBan',
			align: 'center',
			width: 100,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Đường dẫn',
			dataIndex: 'url',
			width: 120,
			render: (val) =>
				val && (
					<a href={val} target='_blank' rel='noreferrer'>
						Xem chi tiết
					</a>
				),
		},
		{
			title: 'Bắt buộc',
			width: 80,
			dataIndex: 'batBuoc',
			align: 'center',
			render: (val, rec) => (
				<Switch
					size='small'
					checked={val}
					onChange={(checked) =>
						putModel(rec._id, { ...rec, batBuoc: checked }, () => getModel({ deCuongId: recDeCuong?._id }))
					}
				/>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: HocPhan.IHocLieuDeCuong) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getModel({ deCuongId: recDeCuong?._id }))}
							title='Bạn có chắc chắn muốn xóa học liệu này khỏi đề cương?'
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
				dependencies={[page, limit]}
				params={{ deCuongId: recDeCuong?._id }}
				modelName='daotaov2.hocphan.hoclieudecuong'
				title='Đề cương học liệu'
				Form={Form}
				hideCard
				rowSelection
				deleteMany
				widthDrawer={800}
				buttons={{ reload: false }}
			/>
		</>
	);
};

export default HocLieuDeCuongPage;
