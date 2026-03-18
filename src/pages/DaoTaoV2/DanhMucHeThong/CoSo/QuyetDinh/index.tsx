import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import type { QuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/QuyetDinh/typing';
import { ELoaiQuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';
import CardFormQuyetDinh from './components/CardForm';
import ViewQuyetDinh from './components/View';

const QuyetDinhPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit, handleView, isView, getModel } =
		useModel('daotaov2.quyetdinh.quyetdinh');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	const onCell = (rec: QuyetDinh.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuyetDinh.IRecord>[] = [
		{
			title: 'Loại',
			dataIndex: 'loai',
			width: 100,
			filterType: 'select',
			filterData: Object.values(ELoaiQuyetDinh),
			onCell,
		},
		{
			title: 'Số quyết dịnh',
			dataIndex: 'soQuyetDinh',
			width: 180,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'ngayBanHanh',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 250,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Tập tin',
			dataIndex: 'url',
			align: 'center',
			width: 120,
			render: (val) => val && <a href={val}>Xem chi tiết</a>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title='Bạn có chắc chắn muốn xóa quyết định này?'
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
				getData={getData}
				columns={columns}
				params={{ maHocKy: recHocKy?.ma }}
				dependencies={[page, limit, recHocKy?.ma]}
				modelName='daotaov2.quyetdinh.quyetdinh'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.quyetdinh.title' })}
				Form={isView ? ViewQuyetDinh : CardFormQuyetDinh}
				widthDrawer={1000}
				rowSelection
				deleteMany
				buttons={{ import: true, export: true, create: false }}
			>
				<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
					<FilterHocKy isSetHocKy allowClear />
				</div>
			</TableBase>
		</>
	);
};

export default QuyetDinhPage;
