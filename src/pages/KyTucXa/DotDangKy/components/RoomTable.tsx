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

	const getRoomCapacity = (room: any) => Number(room?.soLuongToiDa ?? 0);
	const getCurrentOccupancy = (room: any) => Number(room?.soLuongHienTai ?? 0);
	const isRoomFull = (room: any) => {
		const capacity = getRoomCapacity(room);
		return capacity <= 0 || getCurrentOccupancy(room) >= capacity;
	};
	const selectableSelectedRowKeys = selectedRowKeys.filter((key) => {
		const room = rooms.find((item: any) => String(item._id) === String(key));
		return !room || !isRoomFull(room);
	});

	useEffect(() => {
		if (selectableSelectedRowKeys.length !== selectedRowKeys.length) {
			const selectableRooms = rooms.filter((room: any) =>
				selectableSelectedRowKeys.some((key) => String(key) === String(room._id)),
			);
			onChangeSelectedKeys?.(selectableSelectedRowKeys.map(String), selectableRooms);
		}
	}, [rooms, JSON.stringify(selectedRowKeys)]);

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
		{
			title: t('kytucxa.phong.dangO'),
			dataIndex: 'soLuongHienTai',
			key: 'soLuongHienTai',
			width: 100,
			align: 'center',
			sortable: true,
			render: (val: any) => val ?? 0,
			fixed: 'right',
		},
		{
			title: t('kytucxa.dotdangky.conTrong'),
			key: 'soLuongConTrong',
			width: 110,
			align: 'center',
			sortable: true,
			render: (_: any, room: any) => Math.max(getRoomCapacity(room) - getCurrentOccupancy(room), 0),
			fixed: 'right',
		},
	];

	const rowSelection = {
		selectedRowKeys: selectableSelectedRowKeys,
		getCheckboxProps: (room: any) => ({
			disabled: disabled || isRoomFull(room),
			title: isRoomFull(room) ? t('kytucxa.dotdangky.phongDaHetCho') : undefined,
		}),
		onChange: (keys: React.Key[], rows: any[]) => {
			const selectableRows = rows.filter((room: any) => !isRoomFull(room));
			const selectableKeys = keys.filter((key) => selectableRows.some((room: any) => String(room._id) === String(key)));
			onChangeSelectedKeys?.(selectableKeys.map(String), selectableRows);
		},
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
