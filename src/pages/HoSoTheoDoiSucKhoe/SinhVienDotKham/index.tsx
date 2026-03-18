import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import ModalChiTietSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalChiTietSinhVien';
import {
	EPhanLoaiSucKhoe,
	ETinhTrangSucKhoe,
	MapKeyNameTinhTrangSuckhoe,
	colorETinhTrangSucKhoe,
} from '@/services/DotKhamSuKhoe/constant';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormSinhVienDotKham from './Form';

const SinhVienDotKhamPage = (props: { isKetQua?: boolean; ssoId?: string }) => {
	const intl = useIntl();
	const { isKetQua } = props;
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('hosotheodoisuckhoe.suckhoesinhvien');
	const { record: recDotKhaiBao } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
	const { handleView: handleViewSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const [sinhVienSsoId, setSinhVienSsoId] = useState<string>();

	const getData = () => {
		getModel(props.ssoId ? { sinhVienSsoId: props?.ssoId } : { dotKhamSucKhoeId: recDotKhaiBao?._id });
	};

	const onCell = (rec: DotKhamSucKhoe.ISucKhoeSinhVien) => ({
		onClick: () => {
			if (rec.sinhVienSsoId && !props.ssoId) {
				setSinhVienSsoId(rec.sinhVienSsoId);
				handleViewSinhVien();
			}
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DotKhamSucKhoe.ISucKhoeSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.column.masv' }),
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.column.hoten' }),
			dataIndex: 'hoTen',
			width: 170,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.column.phanloaisuckhoe' }),
			dataIndex: 'phanLoaiSucKhoe',
			width: 120,
			filterType: 'select',
			onCell,
			align: 'center',
			filterData: Object.values(EPhanLoaiSucKhoe).map((item) => ({ value: item, label: item })),
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.column.benhvatat' }),
			dataIndex: 'benhTat',
			width: 170,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.column.tuvan' }),
			dataIndex: 'tuVan',
			width: 170,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.column.ghichu' }),
			dataIndex: 'ghiChu',
			width: 170,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.column.tinhtrangsuckhoe' }),
			dataIndex: 'tinhTrangSucKhoe',
			align: 'center',
			width: 170,
			filterType: 'select',
			filterData: Object.values(ETinhTrangSucKhoe),
			render: (val: ETinhTrangSucKhoe, rec) => (
				<Tag color={colorETinhTrangSucKhoe[val]}>{MapKeyNameTinhTrangSuckhoe[val]}</Tag>
			),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: any) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.button.loaibo' })}>
						<Popconfirm
							onConfirm={() =>
								deleteModel(record._id, getData, {
									messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
								})
							}
							title={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.confirm.loaibo' })}
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
			hide: props.ssoId ? true : false,
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				params={{ dotKhamSucKhoeId: recDotKhaiBao?._id }}
				dependencies={[page, limit, recDotKhaiBao?._id, props.ssoId]}
				modelName='hosotheodoisuckhoe.suckhoesinhvien'
				title={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.title' })}
				Form={FormSinhVienDotKham}
				formProps={{ getData }}
				hideCard
				rowSelection={isKetQua || props.ssoId ? false : true}
				deleteMany={isKetQua ? false : true}
				buttons={{
					import: props.ssoId ? false : true,
					create: true,
					export: props.ssoId ? false : true,
				}}
			/>

			{!props.ssoId && <ModalChiTietSinhVien sinhVienSsoId={sinhVienSsoId ?? ''} hasDetail />}
		</>
	);
};

export default SinhVienDotKhamPage;
