import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { ChungChi } from '@/services/DaoTaoV2/DanhMucHeThong/ChungChi/typing';
import { EPhuongThucTinhDiem } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectLoaiChungChi from '../LoaiChungChi/components/Select';
import Form from './components/Form';

const ChungChiPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit } = useModel('daotaov2.danhmuc.chungchi');

	const columns: IColumn<ChungChi.IRecord>[] = [
		{
			title: 'Mã chứng chỉ',
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên chứng chỉ',
			dataIndex: 'ten',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Loại chứng chỉ',
			dataIndex: 'maLoaiChungChi',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectLoaiChungChi multiple selectMa />,
			render: (val, rec) =>
				`${rec.loaiChungChi?.ten ?? val}${
					rec.loaiChungChi?.isNgoaiNgu && rec.ngonNgu?.ten ? ` - ${rec.ngonNgu?.ten}` : ''
				}`,
		},
		{
			title: 'Phương thức tính điểm',
			dataIndex: 'phuongThucTinhDiem',
			width: 150,
			filterType: 'select',
			filterData: Object.values(EPhuongThucTinhDiem).map((item) => ({ label: item, value: item })),
			render: (val, rec) =>
				val === EPhuongThucTinhDiem.DIEM
					? `${val}: ${rec?.min} - ${rec?.max}`
					: val === EPhuongThucTinhDiem.BAC
					? `${val}: ${rec?.bac?.map((item) => item.ten).join(', ')}`
					: val,
		},
		{
			title: 'Thời hạn chứng chỉ',
			dataIndex: 'thoiHanChungChi',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				rec.chungChiCoThoiHan ? <Tag color='orange'>{val} năm</Tag> : <Tag color='green'>Không thời hạn</Tag>,
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
						title='Bạn có chắc chắn muốn xóa chứng chỉ này?'
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
				modelName='daotaov2.danhmuc.chungchi'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.chungchi.title' })}
				Form={Form}
				rowSelection
				deleteMany
				widthDrawer={800}
				buttons={{ import: true, export: true }}
			/>
		</>
	);
};

export default ChungChiPage;
