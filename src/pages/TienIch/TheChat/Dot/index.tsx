import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useModel } from 'umi';
import ModalDotTheChat from './components/Modal';
import moment from 'moment';
import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';

const DotTheChatPage = () => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('tienich.thechat.dot');

	const getData = () => {
		if (recHocKy?.ma) getModel({ maHocKy: recHocKy?.ma });
	};

	const columns: IColumn<TheChat.IDotDanhGiaTheChat>[] = [
		{
			title: 'Học kỳ',
			dataIndex: 'maHocKy',
			width: 120,
			render: (val, rec) => rec?.hocKy?.ma ?? val,
			hide: !!recHocKy?.ma,
		},
		{
			title: 'Tên đợt đánh giá',
			dataIndex: 'tenDot',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'Tiêu chí đánh giá',
			width: 200,
			render: (val, rec) => (
				<ExpandText>
					{rec?.danhMucTheChat
						?.map((item) => item?.danhMuc?.ten)
						.filter(Boolean)
						.join(', ')}
				</ExpandText>
			),
		},
		{
			title: 'Thời gian',
			align: 'center',
			dataIndex: 'thoiGianBatDau',
			width: 200,
			render: (val, rec) =>
				`${moment(rec.thoiGianBatDau).format('DD/MM/YYYY')} - ${moment(rec.thoiGianKetThuc).format('DD/MM/YYYY')}`,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'moTa',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Người tạo',
			dataIndex: 'tenNguoiTao',
			width: 150,
			filterType: 'string',
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
						onConfirm={() => deleteModel(rec?._id ?? '', getModel)}
						title='Bạn có chắc chắn muốn xóa đợt đánh giá này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit, recHocKy?.ma]}
			modelName='tienich.thechat.dot'
			title='Đợt đánh giá thể chất sinh viên'
			Form={ModalDotTheChat}
			widthDrawer={1000}
		>
			<div style={{ marginBottom: 12 }}>
				<FilterHocKy isSetHocKy />
			</div>
		</TableBase>
	);
};

export default DotTheChatPage;
