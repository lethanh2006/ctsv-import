import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import SelectPhongHoc from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/PhongHoc/components/Select';
import SelectNhanSuDebounce from '@/pages/DaoTaoV2/ToChucNhanSu/NhanSu/Select';
import type { ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import { ELoaiHinhHocTap } from '@/services/DaoTaoV2/HocKy/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import Form from '../components/Form';
import { Tooltip, Button, Popconfirm } from 'antd';

const ThoiKhoaBieuTable = (props: {
	fromPhanCong?: boolean;
	phongHoc?: string;
	tenLopHocPhan?: string;
	isView?: boolean;
	hideCard?: boolean;
	getData?: () => Promise<ThoiKhoaBieu.IRecord[]>;
	hasSelectLHP?: boolean;
	dependencies?: any[];
}) => {
	const { page, limit, getModel, deleteModel, handleEdit } = useModel('daotaov2.hocky.thoikhoabieu');
	const { fromPhanCong, phongHoc, tenLopHocPhan, isView, hideCard, dependencies } = props;

	const getData = () => (props.getData ? props.getData() : getModel({ tenLopHocPhan, phongHoc }));

	const columns: IColumn<ThoiKhoaBieu.IRecord>[] = [
		{
			title: 'Ngày học',
			dataIndex: 'ngay',
			width: 100,
			align: 'center',
			filterType: 'date',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Tiết bắt đầu',
			dataIndex: 'tietBatDau',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
			render: (val) => `Tiết ${val}`,
		},
		{
			title: 'Tiết kết thúc',
			dataIndex: 'tietKetThuc',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
			render: (val) => `Tiết ${val}`,
		},
		{
			title: 'Lớp tín chỉ',
			dataIndex: 'tenLopHocPhan',
			width: 150,
			hide: !!tenLopHocPhan,
		},
		{
			title: 'Giảng viên',
			dataIndex: 'nhanSuSsoId',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectNhanSuDebounce multiple />,
			render: (val, rec) => `${rec.nhanSu?.hoDem ?? ''} ${rec.nhanSu?.ten ?? ''}`,
		},
		{
			title: 'Loại hình',
			dataIndex: 'loaiHinhHocTap',
			width: 120,
			filterType: 'select',
			filterData: Object.values(ELoaiHinhHocTap),
			sortable: true,
		},
		{
			title: 'Phòng học',
			dataIndex: 'phongHoc',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectPhongHoc selectMa multiple />,
			sortable: true,
			hide: !!phongHoc,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			hide: isView,
			render: (record: ThoiKhoaBieu.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					{!fromPhanCong ? (
						<Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, getData)}
								title='Bạn có chắc chắn muốn xóa thời khóa biểu này?'
								placement='topRight'
							>
								<Button danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					) : null}
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit, tenLopHocPhan, phongHoc, ...(dependencies ?? [])]}
				modelName='daotaov2.hocky.thoikhoabieu'
				title='Thời khóa biểu'
				Form={isView ? undefined : Form}
				formProps={{ getData, fromPhanCong: props.fromPhanCong, hasSelectLHP: props.hasSelectLHP }}
				hideCard={hideCard}
				widthDrawer={1000}
				buttons={{ create: !props.fromPhanCong && !isView }}
				rowSelection
				deleteMany
			/>
		</>
	);
};

export default ThoiKhoaBieuTable;
