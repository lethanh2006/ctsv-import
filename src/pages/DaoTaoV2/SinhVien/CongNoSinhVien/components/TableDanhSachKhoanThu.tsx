import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/DaoTaoV2/TaiChinh/HoaDon/typing';
import {
	type EMaTrangThaiThanhToan,
	EMauTrangThaiThanhToanTable,
	ETrangThaiThanhToan,
} from '@/services/DaoTaoV2/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Table, Tag } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const TableDanhSachKhoanThu = () => {
	const intl = useIntl();
	const { record: recHoaDon } = useModel('daotaov2.taichinh.hoadon');
	const { getAllModel, danhSach } = useModel('daotaov2.taichinh.hoadonchitiet');

	const getData = () =>
		recHoaDon?._id && getAllModel(undefined, undefined, { billIdentityCode: recHoaDon?.identityCode });

	useEffect(() => {
		getData();
	}, [recHoaDon?._id]);

	const columns: IColumn<HoaDon.IBillItem>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.chitietkhoanthu.column.noidung' }),
			dataIndex: 'tenKhoanThu',
			width: 180,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.chitietkhoanthu.column.thanhtien' }),
			dataIndex: 'amountDue',
			width: 120,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.chitietkhoanthu.column.uudai' }),
			dataIndex: 'amountDiscount',
			width: 120,
			align: 'right',
			render: (val) => `${inputFormat(val ?? 0)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.chitietkhoanthu.column.danop' }),
			dataIndex: 'amountPaid',
			width: 120,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.chitietkhoanthu.column.conlai' }),
			dataIndex: 'amountRemaining',
			width: 120,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.chitietkhoanthu.column.trangthai' }),
			dataIndex: 'status',
			align: 'center',
			width: 120,
			render: (val: EMaTrangThaiThanhToan) =>
				val && <Tag color={EMauTrangThaiThanhToanTable?.[val]}>{ETrangThaiThanhToan?.[val] ?? ''}</Tag>,
		},
	];

	return (
		<TableStaticData
			columns={columns}
			data={danhSach}
			addStt
			size='small'
			otherProps={{
				summary: (pageData: HoaDon.IBillItem[]) => {
					const totalDue = _.sumBy(pageData, (item) => item.amountDue);
					const totalUuDai = _.sumBy(pageData, (item) => item.amountDiscount);
					const totalPaid = _.sumBy(pageData, (item) => item.amountPaid);
					const totalRemain = _.sumBy(pageData, (item) => item.amountRemaining);

					return (
						<Table.Summary.Row>
							<Table.Summary.Cell index={0} align='center' colSpan={2}>
								<b>{intl.formatMessage({ id: 'sinhvienhocvu.congno.chitietkhoanthu.summary.tongcong' })}</b>
							</Table.Summary.Cell>
							<Table.Summary.Cell align={'right'} index={1}>
								<b> {inputFormat(totalDue ?? 0)} VND</b>
							</Table.Summary.Cell>
							<Table.Summary.Cell align={'right'} index={2}>
								<b>{inputFormat(totalUuDai ?? 0)} VND</b>
							</Table.Summary.Cell>
							<Table.Summary.Cell align={'right'} index={3}>
								<b>{inputFormat(totalPaid ?? 0)} VND</b>
							</Table.Summary.Cell>
							<Table.Summary.Cell align={'right'} index={4}>
								<b>{inputFormat(totalRemain ?? 0)} VND</b>
							</Table.Summary.Cell>
							<Table.Summary.Cell align={'right'} index={5} />
						</Table.Summary.Row>
					);
				},
			}}
		/>
	);
};

export default TableDanhSachKhoanThu;
