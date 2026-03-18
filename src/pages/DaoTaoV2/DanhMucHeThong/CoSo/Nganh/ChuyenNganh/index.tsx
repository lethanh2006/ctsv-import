import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn, type TFilter } from '@/components/Table/typing';
import SelectVanBanQuyDinh from '@/pages/DaoTaoV2/DanhMucHeThong/VanBanQuyDinh/components/Select';
import ViewVanBanQuyDinh from '@/pages/DaoTaoV2/DanhMucHeThong/VanBanQuyDinh/components/ViewVanBan';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectNganhCoSo from '../components/SelectNganh';
import FormChuyenNganh from './FormChuyenNganh';

const ChuyenNganhLocal = (props: { hideCard?: boolean }) => {
	const intl = useIntl();
	const { setEdit, setVisibleForm, setRecord, deleteModel, getModel, page, limit } =
		useModel('daotaov2.danhmuc.chuyennganh');
	const { record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
	const [vanBanId, setVanBanId] = useState<string>();
	const { pathname } = window.location;
	const arrPathName = pathname?.split('/') ?? [];
	const isChuyenNganh = arrPathName.includes('chuyen-nganh');
	const filter: TFilter<NganhDaoTao.IRecordCoSo> = {
		field: 'maNganhGoc',
		operator: isChuyenNganh ? EOperatorType.NOT_NULL : EOperatorType.INCLUDE,
		values: recNganh?.ma && !isChuyenNganh ? [recNganh.ma] : [''],
		active: true,
	};

	const handleEdit = (recChuyenNganh: NganhDaoTao.IRecordCoSo) => {
		setRecord(recChuyenNganh);
		setVisibleForm(true);
		setEdit(true);
	};

	const columns: IColumn<NganhDaoTao.IRecordCoSo>[] = [
		{
			title: 'Mã chuyên ngành',
			dataIndex: 'ma',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên chuyên ngành',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Ngành đào tạo',
			dataIndex: 'maNganhGoc',
			width: 150,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			render: (val, rec) => rec.nganhGoc?.ten ?? val,
			hide: !isChuyenNganh,
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
			render: (rec) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(rec._id, () => getModel(undefined, [filter]))}
							title='Bạn có chắc chắn muốn xóa chuyên ngành này?'
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
				modelName='daotaov2.danhmuc.chuyennganh'
				modelImportName='danhmuc.chuyennganhimport'
				columns={columns}
				dependencies={[page, limit]}
				getData={() => getModel(undefined, [filter])}
				Form={FormChuyenNganh}
				hideCard={props?.hideCard}
				title={intl.formatMessage({ id: 'danhmuchethong.coso.nganh.chuyennganh.title' })}
				rowSelection
				deleteMany
				buttons={{ import: true, export: true, filter: !props?.hideCard }}
			/>

			{vanBanId ? (
				<ViewVanBanQuyDinh visible={visibleCanCu} setVisible={setVisibleCanCu} condition={{ _id: vanBanId }} />
			) : null}
		</>
	);
};

export default ChuyenNganhLocal;
