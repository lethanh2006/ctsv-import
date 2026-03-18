import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormLichTrinhChung from './Form';

const DeCuongHocPhanPage = () => {
	const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } =
		useModel('daotaov2.hocphan.noidunghp');
	const { record: recDeCuong } = useModel('daotaov2.hocphan.decuonghocphan');

	const handleEdit = (rec: HocPhan.ILichTrinhChung) => {
		setRecord(rec);
		setVisibleForm(true);
		setEdit(true);
	};

	const columns: IColumn<HocPhan.ILichTrinhChung>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Hình thức tổ chức dạy học',
			width: 320,
			children: [
				{
					title: 'Lên lớp',
					children: [
						{
							title: 'Lý thuyết',
							dataIndex: 'gioLyThuyet',
							width: 80,
							align: 'center',
						},
						{
							title: 'BT-TL',
							dataIndex: 'gioBaiTapTL',
							width: 80,
							align: 'center',
						},
						{
							title: 'Thực hành',
							dataIndex: 'gioThucHanh',
							width: 80,
							align: 'center',
						},
					],
				},
				{
					title: 'Tự học',
					dataIndex: 'gioTuHoc',
					width: 80,
					align: 'center',
				},
			],
		},
		{
			title: 'Tổng',
			width: 80,
			align: 'center',
			render: (val, rec) => rec.gioLyThuyet + rec.gioBaiTapTL + rec.gioThucHanh + rec.gioTuHoc,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: HocPhan.ILichTrinhChung) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getModel({ deCuongHpId: recDeCuong?._id }))}
							title='Bạn có chắc chắn muốn xóa lịch trình này?'
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
				params={{ deCuongHpId: recDeCuong?._id }}
				dependencies={[page, limit]}
				modelName='daotaov2.hocphan.noidunghp'
				title='Lịch trình chung'
				Form={FormLichTrinhChung}
				hideCard
				rowSelection
				deleteMany
			/>
		</>
	);
};

export default DeCuongHocPhanPage;
