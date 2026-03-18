import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { GiaoDich } from '@/services/DaoTaoV2/TaiChinh/GiaoDich/typing';
import {
	ETransactionSourceType,
	colorTransactionStatus,
	transactionPaymentLabel,
	transactionStatus,
	type ETransactionPaymentType,
	type ETransactionStatus,
} from '@/services/DaoTaoV2/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const LichSuThanhToan = () => {
	const intl = useIntl();
	const { record } = useModel('daotaov2.taichinh.hoadon');
	const { getAllModel, danhSach, loading } = useModel('daotaov2.taichinh.giaodich');

	const getData = () => record?._id && getAllModel(undefined, undefined, { identityCode: record?.identityCode });

	useEffect(() => {
		getData();
	}, [record?._id]);

	const columns: IColumn<GiaoDich.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.lichsuthanhtoan.column.loaigiaodich' }),
			align: 'center',
			width: 100,
			render: (val, rec) => {
				switch ((rec.fromAccount, rec.toAccount)) {
					case (ETransactionSourceType.EXTERNAL, ETransactionSourceType.WALLET):
						return (
							<Tag color='green'>{intl.formatMessage({ id: 'sinhvienhocvu.congno.lichsuthanhtoan.tag.noptien' })}</Tag>
						);
					case (ETransactionSourceType.WALLET, ETransactionSourceType.SYSTEM):
						return (
							<Tag color='orange'>
								{intl.formatMessage({ id: 'sinhvienhocvu.congno.lichsuthanhtoan.tag.thanhtoan' })}
							</Tag>
						);
					case (ETransactionSourceType.SYSTEM, ETransactionSourceType.WALLET):
						return (
							<Tag color='purple'>{intl.formatMessage({ id: 'sinhvienhocvu.congno.lichsuthanhtoan.tag.hoantra' })}</Tag>
						);
					default:
						return null;
				}
			},
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.lichsuthanhtoan.column.sotien' }),
			dataIndex: 'amount',
			align: 'right',
			width: 120,
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.lichsuthanhtoan.column.nguoithuchien' }),
			dataIndex: 'payerFullname',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.lichsuthanhtoan.column.thoigian' }),
			align: 'center',
			dataIndex: 'transactionDate',
			width: 120,
			sortable: true,
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.lichsuthanhtoan.column.hinhthuc' }),
			dataIndex: 'paymentType',
			width: 120,
			render: (val: ETransactionPaymentType, rec) => transactionPaymentLabel?.[val as ETransactionPaymentType] ?? '',
		},
		{
			title: intl.formatMessage({ id: 'sinhvienhocvu.congno.lichsuthanhtoan.column.trangthai' }),
			dataIndex: 'status',
			width: 140,
			align: 'center',
			render: (val: ETransactionStatus) => (
				<Tag color={colorTransactionStatus[val]}>{transactionStatus[val] ?? ''}</Tag>
			),
		},
	];

	return <TableStaticData columns={columns} data={danhSach} addStt size='small' loading={loading} />;
};

export default LichSuThanhToan;
