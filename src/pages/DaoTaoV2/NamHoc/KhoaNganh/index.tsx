import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const KhoaNganhPage = (props: { hideCard?: boolean }) => {
	const intl = useIntl();
	const { record: recordKhoaSinhVien } = useModel('daotaov2.namhoc.khoasinhvien');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.namhoc.khoanganh');

	const getData = () => getModel({ maKhoaSinhVien: recordKhoaSinhVien?.ma });

	const columns: IColumn<KhoaNganh.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 80,
		},
		{
			title: 'Tên khóa ngành',
			dataIndex: 'ten',
			width: 170,
		},
		{
			title: 'Ngành',
			dataIndex: 'maNganh',
			width: 170,
			render: (val, rec) => [rec?.nganh?.ten, rec?.nganh?.ma].join(' - '),
		},
		{
			title: 'Chương trình đào tạo',
			dataIndex: 'maChuongTrinhDaoTao',
			width: 170,
			render: (val, rec) => rec?.chuongTrinh?.ten ?? val,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: KhoaNganh.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title='Bạn có chắc chắn muốn xóa khóa ngành này?'
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
				getData={getData}
				dependencies={[page, limit, recordKhoaSinhVien?.ma]}
				modelName='daotaov2.namhoc.khoanganh'
				title={intl.formatMessage({ id: 'namhoc.khoanganh.title' })}
				Form={Form}
				rowSelection
				deleteMany
				hideCard={props?.hideCard}
				buttons={{ import: true, export: true }}
			/>
		</>
	);
};

export default KhoaNganhPage;
