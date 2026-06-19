import TableStaticData from '@/components/Table/TableStaticData';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

const RoomTable: React.FC<{
	toaNhaIds?: string[];
	selectedRowKeys?: React.Key[];
	disabled?: boolean;
	onChangeSelectedKeys?: (keys: string[], rows: any[]) => void;
}> = ({ toaNhaIds, selectedRowKeys = [], disabled, onChangeSelectedKeys }) => {
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
			title: 'Tên phòng',
			dataIndex: 'ten',
			key: 'ten',
			width: 180,
		},
		{
			title: 'Tòa nhà',
			dataIndex: ['toaNha', 'ten'],
			key: 'toaNha',
			width: 180,
			render: (_: any, rec: any) => rec?.toaNha?.ten || rec?.maToaNha || '-',
		},
		{
			title: 'Tầng thứ',
			dataIndex: 'tangThu',
			key: 'tangThu',
			width: 100,
			render: (val: any) => val ?? '-',
		},
		{
			title: 'Diện tích',
			dataIndex: 'dienTich',
			key: 'dienTich',
			width: 110,
			render: (val: any) => val ?? '-',
		},
		{
			title: 'Số lượng tối đa',
			dataIndex: 'soLuongToiDa',
			key: 'soLuongToiDa',
			width: 120,
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
