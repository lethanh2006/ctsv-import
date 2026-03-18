import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { NganhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/Nganh/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectNganh from '../../Bo/Nganh/components/SelectNganh';
import SelectVanBanQuyDinh from '../../VanBanQuyDinh/components/Select';
import ViewVanBanQuyDinh from '../../VanBanQuyDinh/components/ViewVanBan';
import SelectTrinhDo from '../TrinhDo/components/Select';
import ModalFormNganh from './components/ModalForm';
import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';

const NganhCoSo = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('daotaov2.danhmuc.nganhdaotao');
	const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
	const [vanBanId, setVanBanId] = useState<string>();

	const onCell = (record: NganhDaoTao.IRecordCoSo) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<NganhDaoTao.IRecordCoSo>[] = [
		{
			title: 'Trình độ',
			dataIndex: 'maTrinhDo',
			width: 100,
			filterType: 'customselect',
			filterCustomSelect: <SelectTrinhDo selectMa multiple />,
			render: (val, rec) => rec?.trinhDo?.ten ?? val,
			onCell,
		},
		{
			title: 'Mã ngành',
			dataIndex: 'maDmNganh',
			width: 100,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganh multiple selectMa />,
			onCell,
		},
		{
			title: 'Mã nội bộ',
			dataIndex: 'ma',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tên ngành',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Đơn vị',
			dataIndex: 'maDonVi',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectDonVi multiple />,
			render: (val, rec) => rec.donVi?.ten ?? val,
			onCell,
		},
		{
			title: 'Căn cứ pháp lý',
			dataIndex: 'maCanCuPhapLy',
			width: 120,
			filterType: 'customselect',
			filterCustomSelect: <SelectVanBanQuyDinh multiple hasCreate={false} selectMa />,
			render: (val, rec) => (
				<>
					{val ? (
						<a
							onClick={() => {
								setVanBanId(val);
								setVisibleCanCu(true);
							}}
						>
							{val ?? '(chi tiết)'}
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
			render: (record: NganhDaoTao.IRecordCoSo) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, () => getModel({ maNganhGoc: null }))}
							title='Bạn có chắc chắn muốn xóa ngành đào tạo này?'
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
				params={{ maNganhGoc: null }}
				dependencies={[page, limit]}
				modelName='daotaov2.danhmuc.nganhdaotao'
				title={intl.formatMessage({ id: 'danhmuchethong.coso.nganh.title' })}
				Form={ModalFormNganh}
				widthDrawer={1000}
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

export default NganhCoSo;
