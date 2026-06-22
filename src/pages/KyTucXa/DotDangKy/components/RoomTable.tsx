import TableStaticData from '@/components/Table/TableStaticData';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const RoomTable: React.FC<{
	toaNhaIds?: string[];
	selectedRowKeys?: React.Key[];
	disabled?: boolean;
	onChangeSelectedKeys?: (keys: string[], rows: any[]) => void;
}> = ({ toaNhaIds, selectedRowKeys = [], disabled, onChangeSelectedKeys }) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const { danhSach: rooms, getAllModel, loading } = useModel('theodoitaisanvattu.phong');

	useEffect(() => {
		const filters = toaNhaIds?.length
			? [
					{
						field: 'maToaNha',
						values: toaNhaIds,
						operator: EOperatorType.INCLUDE,
					},
				]
			: [];

		getAllModel(false, undefined, undefined, filters as any).catch(() => {});
	}, [JSON.stringify(toaNhaIds)]);

	const columns: IColumn<any>[] = [
		{
			title: t('kytucxa.dotdangky.tenPhong'),
			dataIndex: 'ten',
			key: 'ten',
			width: 180,
			filterType: 'string',
		},
		{
			title: t('kytucxa.dotdangky.toaNha'),
			dataIndex: ['toaNha', 'ten'],
			key: 'toaNha',
			width: 180,
			filterType: 'string',
			render: (_: any, rec: any) => rec?.toaNha?.ten || rec?.maToaNha || '-',
		},
		{
			title: t('kytucxa.dotdangky.tangThu'),
			dataIndex: 'tangThu',
			key: 'tangThu',
			width: 100,
			sortable: true,
			render: (val: any) => val ?? '-',
		},
		{
			title: t('kytucxa.dotdangky.dienTich'),
			dataIndex: 'dienTich',
			key: 'dienTich',
			width: 110,
			sortable: true,
			render: (val: any) => val ?? '-',
		},
		{
			title: t('kytucxa.dotdangky.soLuongToiDa'),
			dataIndex: 'soLuongToiDa',
			key: 'soLuongToiDa',
			width: 120,
			sortable: true,
			render: (val: any) => val ?? '-',
		},
	];

	const rowSelection = {
		selectedRowKeys,
		getCheckboxProps: () => ({ disabled }),
		onChange: (keys: React.Key[], rows: any[]) => onChangeSelectedKeys?.(keys.map(String), rows),
	};

	return (
		<TableStaticData
			data={rooms}
			columns={columns}
			loading={loading}
			size='small'
			hasTotal
			otherProps={{
				rowKey: (rec: any) => rec._id,
				rowSelection,
				pagination: { pageSize: 10, showSizeChanger: false },
				scroll: { x: 'max-content' },
			}}
		/>
	);
};

export default RoomTable;
