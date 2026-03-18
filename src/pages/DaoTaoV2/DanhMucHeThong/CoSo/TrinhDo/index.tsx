import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectTrinhDo from '../../Bo/TrinhDo/components/SelectTrinhDo';
import SelectVanBanQuyDinh from '../../VanBanQuyDinh/components/Select';
import ViewVanBanQuyDinh from '../../VanBanQuyDinh/components/ViewVanBan';
import Form from './components/Form';

const TrinhDoDTCoSo = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.danhmuc.trinhdo');
	const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
	const [vanBanId, setVanBanId] = useState<string>();

	const columns: IColumn<TrinhDoDaoTao.IRecordCoSo>[] = [
		{
			title: 'Mã trình độ',
			dataIndex: 'ma',
			width: 80,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên trình độ',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'DM tham chiếu',
			dataIndex: 'maDmTrinhDo',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDo multiple selectMa />,
			render: (val, rec) => [rec?.dmTrinhDo?.ma, rec?.dmTrinhDo?.ten].join(' - '),
		},
		{
			title: 'Căn cứ pháp lý',
			dataIndex: 'canCuId',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectVanBanQuyDinh multiple hasCreate={false} />,
			render: (val, rec) => (
				<>
					{val ? (
						<a
							onClick={() => {
								setVanBanId(rec?.canCu?._id);
								setVisibleCanCu(true);
							}}
						>
							{rec?.canCu?.ma ?? '(chi tiết)'}
						</a>
					) : (
						'Chưa cập nhật'
					)}
				</>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: TrinhDoDaoTao.IRecordCoSo) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa trình độ đào tạo này?'
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
				dependencies={[page, limit]}
				modelName='daotaov2.danhmuc.trinhdo'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.trinhdo.title' })}
				Form={Form}
				rowSelection
				deleteMany
				buttons={{ import: true, export: true }}
			/>

			{vanBanId ? (
				<ViewVanBanQuyDinh visible={visibleCanCu} setVisible={setVisibleCanCu} condition={{ _id: vanBanId }} />
			) : null}
		</>
	);
};

export default TrinhDoDTCoSo;
