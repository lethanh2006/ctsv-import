import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormKhoaNganhDotDangKy from './Form';

const KhoaNganhDotDangKyNhuCauPage = () => {
	const { getModel, page, limit, deleteModel } = useModel('daotaov2.hocky.dotdangkynhucaukhoanganh');
	const { record: recDotDangKy } = useModel('daotaov2.hocky.dotdangkynhucau');

	const columns: IColumn<DangKyNhuCau.IDotDangKyKhoaNganh>[] = [
		{
			title: 'Khóa sinh viên',
			width: 150,
			render: (val, rec) => rec.khoaNganh?.khoaSinhVien?.ten,
		},
		{
			title: 'Ngành đào tạo',
			width: 150,
			render: (val, rec) => rec.khoaNganh?.nganh?.ten,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			fixed: 'right',
			render: (record: DangKyNhuCau.IDotDangKyKhoaNganh) => (
				<>
					<Tooltip title='Loại bỏ'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getModel({ dotDangKyNhuCauId: recDotDangKy?._id }))}
							title='Bạn có chắc chắn muốn bỏ khóa ngành này khỏi đợt đăng ký?'
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
				params={{ dotDangKyNhuCauId: recDotDangKy?._id }}
				dependencies={[page, limit]}
				modelName='daotaov2.hocky.dotdangkynhucaukhoanganh'
				title='Khóa ngành - Đợt đăng ký nhu cầu'
				Form={FormKhoaNganhDotDangKy}
				hideCard
				rowSelection
				deleteMany
			/>
		</>
	);
};

export default KhoaNganhDotDangKyNhuCauPage;
