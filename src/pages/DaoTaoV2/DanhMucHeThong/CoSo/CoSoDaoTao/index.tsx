import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { formatPhoneNumber } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const CoSoDaoTao = () => {
	const intl = useIntl();
	const { page, limit, handleEdit, deleteModel } = useModel('daotaov2.danhmuc.cosodaotao');

	const columns: IColumn<CoSoDaoTao.IRecord>[] = [
		{
			title: 'Tên cơ sở',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Ký hiệu',
			dataIndex: 'ma',
			width: 80,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'diaChi',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'soDienThoai',
			align: 'center',
			width: 100,
			filterType: 'string',
			render: (val) => <>{formatPhoneNumber(val)}</>,
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
						title='Bạn có chắc chắn muốn xóa cơ sở đào tạo này?'
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
			columns={columns}
			dependencies={[page, limit]}
			modelName='daotaov2.danhmuc.cosodaotao'
			title={intl.formatMessage({ id: 'danhmuchethong.coso.cosodaotao.title' })}
			Form={Form}
			// buttons={{ create: false }}
		/>
	);
};

export default CoSoDaoTao;
