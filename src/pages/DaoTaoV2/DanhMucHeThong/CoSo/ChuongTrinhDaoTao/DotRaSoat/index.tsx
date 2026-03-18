import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { DeleteOutlined, EditOutlined, MenuOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { history, useModel } from 'umi';
import Form from './Form';

const CardDotRaSoatCTDT = () => {
	const { page, limit, setRecord, getModel, handleEdit, deleteModel } = useModel(
		'daotaov2.chuongtrinhdaotao.dotrasoat',
	);

	const getData = () => getModel().then((res) => setRecord(res?.[0]));

	const handleView = (rec: ChuongTrinhDaoTao.IDotRaSoat) => {
		setRecord(rec);
		history.push('/chuong-trinh-dao-tao/ra-soat/ra-soat');
	};

	const columns: IColumn<ChuongTrinhDaoTao.IDotRaSoat>[] = [
		{
			title: 'Năm học',
			dataIndex: 'maNamHoc',
			width: 100,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Tên đợt',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'thoiGianBatDau',
			align: 'center',
			width: 120,
			sortable: true,
			filterType: 'date',
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			align: 'center',
			width: 120,
			sortable: true,
			filterType: 'date',
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chi tiết' onClick={() => handleView(rec)} type='link' icon={<MenuOutlined />} />
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title='Bạn có chắc chắn muốn xóa đợt rà soát này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit]}
				modelName='daotaov2.chuongtrinhdaotao.dotrasoat'
				title='Đợt rà soát chương trình đào tạo'
				Form={Form}
				rowSelection
				deleteMany
			/>
		</>
	);
};

export default CardDotRaSoatCTDT;
