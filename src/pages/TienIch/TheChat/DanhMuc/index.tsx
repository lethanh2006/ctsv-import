import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { EChiSoSoSanh, EDoiTuongTheChat, EMucDanhGiaTheChat } from '@/services/TienIch/TheChat/constant';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Checkbox, Popconfirm } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const DanhMucTheChatPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('tienich.thechat.danhmuc');

	const expandedColumns: IColumn<TheChat.ITieuChiTheChat>[] = [
		{
			title: 'Độ tuổi',
			align: 'center',
			dataIndex: 'doTuoi',
			width: 100,
			sortable: true,
		},
		{
			title: 'Đối tượng',
			align: 'center',
			dataIndex: 'doiTuong',
			width: 120,
			filterType: 'select',
			filterData: Object.values(EDoiTuongTheChat),
		},
		{
			title: 'Mức đánh giá',
			align: 'center',
			dataIndex: 'mucDanhGia',
			width: 150,
			filterType: 'select',
			filterData: Object.values(EMucDanhGiaTheChat),
		},
		{
			title: 'Giá trị',
			align: 'center',
			dataIndex: 'giaTri',
			width: 100,
			sortable: true,
		},
	];

	const columns: IColumn<TheChat.IDanhMucTheChat>[] = [
		{
			title: 'Mã tiêu chí',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên tiêu chí',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Đơn vị đo',
			dataIndex: 'donViDoLuong',
			align: 'center',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'So sánh',
			dataIndex: 'soSanh',
			align: 'center',
			width: 90,
			filterType: 'select',
			filterData: Object.values(EChiSoSoSanh),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'moTa',
			width: 200,
			filterType: 'string',
			ellipsis: true,
		},
		{
			title: 'Bắt buộc thực hiện tiêu chí',
			dataIndex: 'batBuoc',
			width: 80,
			align: 'center',
			render: (val, rec) => <Checkbox checked={!!val} />,
		},
		{
			title: 'Sử dụng thiết thị ngoại vi',
			dataIndex: 'suDungThietBiNgoaiVi',
			width: 80,
			align: 'center',
			render: (val, rec) => <Checkbox checked={!!val} />,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getModel)}
						title='Bạn có chắc chắn muốn xóa thẻ chất này?'
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
				dependencies={[page, limit]}
				modelName='tienich.thechat.danhmuc'
				title='Tiêu chuẩn đánh giá thể lực'
				Form={Form}
				widthDrawer={800}
				buttons={{ import: true, export: true }}
				otherProps={{
					expandable: {
						expandedRowRender: (record: TheChat.IDanhMucTheChat) => (
							<TableStaticData columns={expandedColumns} data={record.tieuChiTheChat ?? []} size='small' />
						),
						rowExpandable: (record: TheChat.IDanhMucTheChat) =>
							record.tieuChiTheChat && record.tieuChiTheChat.length > 0,
					},
				}}
			/>
		</>
	);
};

export default DanhMucTheChatPage;
