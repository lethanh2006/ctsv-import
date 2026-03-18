import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { Checkbox } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const LoaiHocPhanPage = () => {
	const intl = useIntl();
	const { page, limit } = useModel('daotaov2.danhmuc.loaihocphan');

	const columns: IColumn<HocPhan.ILoaiHocPhan>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 80,
			filterType: 'string',
			sortable: true,
			align: 'center',
		},
		{
			title: 'Tính chất học phần',
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'HP tính điểm',
			dataIndex: 'isTinhDiem',
			width: 130,
			align: 'center',
			render: (val) => <Checkbox checked={val} />,
		},
		{
			title: 'Tính số tín chỉ khi ĐKHP',
			dataIndex: 'isTinhSoTinChiDangKy',
			width: 130,
			align: 'center',
			render: (val) => <Checkbox checked={val} />,
		},
		{
			title: 'Tính số tín chỉ tích lũy',
			dataIndex: 'isTinhSoTinChiTichLuy',
			width: 130,
			align: 'center',
			render: (val) => <Checkbox checked={val} />,
		},
		// {
		// 	title: 'Khối tự chọn',
		// 	dataIndex: 'khoiTuChon',
		// 	width: 130,
		// 	align: 'center',
		// 	render: (val) => <Checkbox checked={val} />,
		// },
		// {
		// 	title: 'Khối tốt nghiệp',
		// 	dataIndex: 'khoiTotNghiep',
		// 	width: 130,
		// 	align: 'center',
		// 	render: (val) => <Checkbox checked={val} />,
		// },
		// {
		// 	title: 'Thao tác',
		// 	align: 'center',
		// 	width: 60,
		// 	fixed: 'right',
		// 	render: (record: HocPhan.ILoaiHocPhan) => (
		// 		<>
		// 			<Tooltip title='Chỉnh sửa'>
		// 				<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
		// 			</Tooltip>
		// 			<Tooltip title='Xóa'>
		// 				<Popconfirm
		// 					onConfirm={() => deleteModel(record._id)}
		// 					title='Bạn có chắc chắn muốn xóa loại học phần này?'
		// 					placement='topRight'
		// 				>
		// 					<Button danger type='link' icon={<DeleteOutlined />} />
		// 				</Popconfirm>
		// 			</Tooltip>
		// 		</>
		// 	),
		// },
	];

	return (
		<TableBase
			columns={columns}
			dependencies={[page, limit]}
			modelName='daotaov2.danhmuc.loaihocphan'
			title={intl.formatMessage({ id: 'danhmuchethong.coso.loaihocphan.title' })}
			Form={Form}
			buttons={{ create: false }}
		/>
	);
};

export default LoaiHocPhanPage;
