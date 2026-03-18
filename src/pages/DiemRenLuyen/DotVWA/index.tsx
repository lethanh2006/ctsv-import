import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { BieuMau } from '@/services/DiemRenLuyen/BieuMau/typing';
import { MapKeyNameLoaiDoiTuongChamDiem } from '@/services/DiemRenLuyen/constants';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormBieuMau from './components/Form';

const DotDiemRenLuyenComponent = () => {
	const intl = useIntl();
	const { handleEdit, deleteModel, page, limit } = useModel('diemrenluyen.dotvwa');
	const { danhSach, getAllModel } = useModel('daotaov2.hocky.hocky');

	useEffect(() => {
		if (!danhSach.length) getAllModel(false, { ma: -1 });
	}, []);

	const column: IColumn<DotChamDiemRenLuyen.IRecordVWA>[] = [
		{
			title: intl.formatMessage({ id: 'dotdanhgia.column.hocky' }),
			dataIndex: 'maHocKy',
			width: 300,
			render: (val) => danhSach.find((item) => item.ma === val)?.ten,
		},
		{
			title: intl.formatMessage({ id: 'dotdanhgia.column.doituong' }),
			dataIndex: 'danhSachDoiTuongChamDiem',
			width: 300,
			render: (val: DotChamDiemRenLuyen.DoiTuongChamDiem[]) => (
				<div>
					{val?.map((item) => (
						<div key={item.loaiDoiTuongChamDiem}>
							{MapKeyNameLoaiDoiTuongChamDiem[item.loaiDoiTuongChamDiem]} (
							{dayjs(item.thoiGianBatDauCham).format('HH:mm DD/MM/YYYY')} -{' '}
							{dayjs(item.thoiGianKetThucCham).format('HH:mm DD/MM/YYYY')})
						</div>
					))}
				</div>
			),
		},
		{
			title: intl.formatMessage({ id: 'dotdanhgia.column.maudanhgia' }),
			dataIndex: 'mauDrl',
			width: 300,
			render: (val: BieuMau.IRecordVWA) => val?.ten,
		},
		{
			title: intl.formatMessage({ id: 'dotdanhgia.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: DotChamDiemRenLuyen.IRecordVWA) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							onConfirm={() => deleteModel(record._id)}
							title={intl.formatMessage({ id: 'dotdanhgia.confirm.xoa' })}
							placement='topLeft'
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
				widthDrawer={700}
				Form={FormBieuMau}
				title={intl.formatMessage({ id: 'dotdanhgia.title' })}
				columns={column}
				modelName={'diemrenluyen.dotvwa'}
				dependencies={[page, limit]}
			/>
		</>
	);
};

export default DotDiemRenLuyenComponent;
