import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import FormLopThucHanh from './Form';

const LopThucHanhPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel } = useModel('daotaov2.hocky.lopthuchanh');
	const { record: recLopHocPhan, setRecord: setLopHocPhan } = useModel('daotaov2.hocky.lophocphan');

	const handleEdit = (record: LopHocPhan.IRecord) => {
		setLopHocPhan(record);
		// setVisibleForm(true);
		// setEdit(true);
	};

	const columns: IColumn<LopHocPhan.IRecord>[] = [
		{
			title: 'Tên lớp thực hành',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Sĩ số tối đa',
			dataIndex: 'siSoToiDa',
			width: 80,
			align: 'center',
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Sĩ số thực tế',
			dataIndex: 'siSo',
			width: 80,
			align: 'center',
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: LopHocPhan.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getModel({ tenCha: recLopHocPhan?.ten }))}
							title='Bạn có chắc chắn muốn xóa lớp thực hành này?'
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
				getData={() => getModel({ tenCha: recLopHocPhan?.ten })}
				dependencies={[page, limit]}
				modelName='daotaov2.hocky.lopthuchanh'
				title={intl.formatMessage({ id: 'kyhoc.lophocphan.lopthuchanh' })}
				Form={FormLopThucHanh}
				hideCard
				buttons={{ filter: false }}
				rowSelection
				deleteMany
			/>
		</>
	);
};

export default LopThucHanhPage;
