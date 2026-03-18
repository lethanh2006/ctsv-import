import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type DotXetHocVu } from '@/services/DaoTaoV2/KetQuaHocTap/DotXetHocVu/typing';
import { ELoaiThanhPhanHoiDong } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { formatPhoneNumber } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './Form';

const ThanhVienHoiDongTable = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { page, limit, deleteModel, handleEdit } = useModel('daotaov2.ketquahoctap.xethocvu.thanhvienhoidong');

	const columns: IColumn<DotXetHocVu.IThanhVienHoiDong>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Chức vụ',
			dataIndex: 'chucVu',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 120,
			filterType: 'string',
			render: (val) => val && formatPhoneNumber(val),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Thành phần hội đồng',
			dataIndex: 'thanhPhan',
			width: 150,
			filterType: 'select',
			filterData: Object.values(ELoaiThanhPhanHoiDong),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: DotXetHocVu.IThanhVienHoiDong) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							disabled={recHocKy?.daChotKqCanhBao && recHocKy?.daChotKqThoiHoc}
							type='link'
							icon={<EditOutlined />}
							onClick={() => handleEdit(record)}
						/>
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title='Bạn có chắc chắn muốn xóa thành viên hội đồng này?'
							placement='topRight'
						>
							<Button
								disabled={recHocKy?.daChotKqCanhBao && recHocKy?.daChotKqThoiHoc}
								danger
								type='link'
								icon={<DeleteOutlined />}
							/>
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
				params={{ maHocKy: recHocKy?.ma }}
				dependencies={[page, limit, recHocKy?.ma]}
				modelName='daotaov2.ketquahoctap.xethocvu.thanhvienhoidong'
				title={intl.formatMessage({ id: 'ketquahoctap.xulyketqua.thongtinhoidong.title' })}
				Form={Form}
				hideCard
				widthDrawer={800}
				rowSelection
				deleteMany
				buttons={{ create: recHocKy?.daChotKqCanhBao && recHocKy?.daChotKqThoiHoc ? false : true }}
			/>
		</>
	);
};

export default ThanhVienHoiDongTable;
