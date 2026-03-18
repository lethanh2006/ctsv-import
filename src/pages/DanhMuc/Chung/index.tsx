import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';
import FormDanhMucChung from './components/Form';

import { useCallback } from 'react';

import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import type { DanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/typings';

const DanhMucChungComponent = () => {
	const intl = useIntl();
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('quytrinh.danhmuc');

	const getData = () => {
		getModel({ maModule: ELoaiDanhMucChung.CHE_DO_CHINH_SACH });
	};

	const columns: IColumn<DanhMucChung.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'chinhsach.danhmucchung.column.ma' }),
			dataIndex: 'maDanhMuc',
			width: 80,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'chinhsach.danhmucchung.column.dsgiatri' }),
			dataIndex: 'danhSachGiaTri',
			width: 250,
			render: (val: any[]) => (
				<div>
					{val.map((item) => (
						<div style={{ marginLeft: 4 }} key={item.value}>
							- {item.value}
						</div>
					))}
				</div>
			),
		},
		{
			title: intl.formatMessage({ id: 'chinhsach.danhmucchung.column.ngaytao' }),
			dataIndex: 'createdAt',
			align: 'center',
			width: 120,
			filterType: 'datetime',
			sortable: true,
			render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'chinhsach.danhmucchung.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: DanhMucChung.IRecord) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'chinhsach.danhmucchung.tooltip.chinhsua' })}>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'chinhsach.danhmucchung.tooltip.xoa' })}>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getData)}
							title={intl.formatMessage({ id: 'chinhsach.danhmucchung.tooltip.confirm.delete' })}
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const Form = useCallback(
		() => <FormDanhMucChung maModule={ELoaiDanhMucChung.CHE_DO_CHINH_SACH} getData={getData} />,
		[],
	);

	return (
		<TableBase
			title={intl.formatMessage({ id: 'chinhsach.danhmucchung.title' })}
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='quytrinh.danhmuc'
			Form={Form}
		/>
	);
};

export default DanhMucChungComponent;
