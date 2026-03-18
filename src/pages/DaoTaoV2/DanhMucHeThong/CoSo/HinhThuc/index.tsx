import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectHinhThuc from '../../Bo/HinhThuc/components/SelectHinhThuc';
import SelectVanBanQuyDinh from '../../VanBanQuyDinh/components/Select';
import ViewVanBanQuyDinh from '../../VanBanQuyDinh/components/ViewVanBan';
import Form from './components/Form';

const TrinhDoDaoTaoPage = () => {
	const intl = useIntl();
	const { handleEdit, getModel, page, limit, deleteModel } = useModel('daotaov2.danhmuc.hinhthucdaotao');
	const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
	const [vanBanId, setVanBanId] = useState<string>();

	const columns: IColumn<HinhThucDaoTao.IRecordCoSo>[] = [
		{
			title: 'Mã hình thức',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Tên hình thức',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'DM tham chiếu',
			dataIndex: 'maDmHinhThuc',
			width: 120,
			render: (val, rec) => [rec?.dmHinhThuc?.ten, rec?.dmHinhThuc?.ma].join(' - '),
			filterType: 'customselect',
			filterCustomSelect: <SelectHinhThuc multiple selectMa />,
		},
		{
			title: 'Căn cứ pháp lý',
			dataIndex: 'canCuId',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectVanBanQuyDinh multiple hasCreate={false} />,
			render: (val, rec) => (
				<>
					{val ? (
						<a
							onClick={() => {
								setVanBanId(val);
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
			render: (record: HinhThucDaoTao.IRecordCoSo) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa hình thức đào tạo này?'
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
				modelName='daotaov2.danhmuc.hinhthucdaotao'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.hinhthuc.title' })}
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

export default TrinhDoDaoTaoPage;
