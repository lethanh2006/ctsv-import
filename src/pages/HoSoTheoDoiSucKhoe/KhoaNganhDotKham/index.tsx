import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import FormKhoaNganhDotKham from './Form';

const KhoaNganhDotKhamPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, getModel } = useModel('hosotheodoisuckhoe.dotkhamkhoanganh');
	const { record: recDotKhaiBao } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');

	const getData = () => {
		if (recDotKhaiBao?._id) getModel({ dotKhamSucKhoeId: recDotKhaiBao?._id });
	};
	const columns: IColumn<DotKhamSucKhoe.IDotKhamKhoaNganh>[] = [
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.column.khoasv' }),
			dataIndex: 'maKhoaSinhVien',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.column.nganh' }),
			dataIndex: 'tenKhoaNganh',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.column.manganh' }),
			dataIndex: 'maNganh',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec) => (
				<>
					{/* <Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip> */}
					<Tooltip title={intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.button.loaibo' })}>
						<Popconfirm
							onConfirm={() =>
								deleteModel(rec._id, getData, {
									messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
								})
							}
							title={intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.confirm.loaibo' })}
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
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recDotKhaiBao?._id]}
				modelName='hosotheodoisuckhoe.dotkhamkhoanganh'
				title={intl.formatMessage({ id: 'dotkhamsuckhoe.step.khoanganh.title' })}
				Form={FormKhoaNganhDotKham}
				formProps={{ getData }}
				hideCard
				rowSelection
				deleteMany
			/>
		</>
	);
};

export default KhoaNganhDotKhamPage;
