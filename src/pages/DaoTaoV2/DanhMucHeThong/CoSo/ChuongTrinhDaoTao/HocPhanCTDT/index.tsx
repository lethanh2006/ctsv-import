import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormHocPhanCTDT from './Form';

const HocPhanCTDT = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.chuongtrinhdaotao.hocphanctdt');
	const { record: recKhoi } = useModel('daotaov2.chuongtrinhdaotao.khoihocphanctdt');

	const columns: IColumn<ChuongTrinhDaoTao.IHocPhanTuChonCTDT>[] = [
		{
			title: 'Mã học phần',
			width: 100,
			dataIndex: ['hocPhan', 'ma'],
		},
		{
			title: 'Học phần',
			width: 200,
			dataIndex: ['hocPhan', 'ten'],
		},
		{
			title: 'Số tín chỉ',
			align: 'center',
			width: 80,
			dataIndex: ['hocPhan', 'soTinChi'],
		},
		{
			title: 'Học phần tiên quyết',
			width: 200,
			render: (val, rec) =>
				rec.dsHocPhanTienQuyet?.map((item) => (
					<div key={item.ma}>
						{item.ma ?? ''} - {item.ten ?? ''}
					</div>
				)),
		},
		{
			title: 'Học phần trước',
			width: 200,
			render: (val, rec) =>
				rec.dsHocPhanTruoc?.map((item) => (
					<div key={item.ma}>
						{item.ma ?? ''} - {item.ten ?? ''}
					</div>
				)),
		},
		{
			title: 'Học phần song hành',
			width: 200,
			render: (val, rec) =>
				rec.dsHocPhanSongHanh?.map((item) => (
					<div key={item.ma}>
						{item.ma ?? ''} - {item.ten ?? ''}
					</div>
				)),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: ChuongTrinhDaoTao.IHocPhanTuChonCTDT) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getModel({ khoiHpCtId: recKhoi?._id }))}
							title='Bạn có chắc chắn muốn xóa học phần này khỏi khối tự chọn?'
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
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			params={{ khoiHpCtId: recKhoi?._id }}
			modelName='daotaov2.chuongtrinhdaotao.hocphanctdt'
			title='Học phần tự chọn'
			Form={FormHocPhanCTDT}
			buttons={{ reload: false }}
			hideCard
			rowSelection
			deleteMany
		/>
	);
};

export default HocPhanCTDT;
