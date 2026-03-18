import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { formatPhoneNumber } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './Form';

const GiangVienDeCuongPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.hocphan.giangviendecuong');
	const { record: recDeCuong } = useModel('daotaov2.hocphan.decuonghocphan');

	const columns: IColumn<HocPhan.IGiangVienDeCuong>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 150,
		},
		{
			title: 'Chức danh, học hàm, học vị',
			width: 150,
			render: (val, rec) => [rec.chucDanh, rec.hocHam, rec.hocVi].join(' - '),
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 120,
			render: (val, rec) => val && formatPhoneNumber(val),
		},
		{
			title: 'Địa chỉ liên hệ',
			dataIndex: 'diaChi',
			width: 200,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: HocPhan.IGiangVienDeCuong) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getModel({ deCuongId: recDeCuong?._id }))}
							title='Bạn có chắc chắn muốn xóa giảng viên này khỏi đề cương?'
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
				modelName='daotaov2.hocphan.giangviendecuong'
				title='Giảng viên đề cương'
				Form={Form}
				hideCard
				rowSelection
				deleteMany
				buttons={{ reload: false }}
			/>
		</>
	);
};

export default GiangVienDeCuongPage;
