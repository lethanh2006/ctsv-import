import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	ETransactionSourceType,
	ETransactionStatus,
	colorTransactionStatus,
	transactionPaymentLabel,
	transactionStatus,
	type ETransactionPaymentType,
} from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { CloseOutlined, DollarOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const LichSuThanhToan = (props: {
	onPay: (rec: GiaoDich.IRecord) => void;
	onCancel: (rec: GiaoDich.IRecord) => void;
}) => {
	const intl = useIntl();
	const { record } = useModel('taichinh.hoadon');
	const { getAllModel, danhSach, loading } = useModel('taichinh.giaodich');
	const { onPay, onCancel } = props;

	const getData = () =>
		record?.identityCode && getAllModel(undefined, undefined, { billIdentityCode: record?.identityCode });

	useEffect(() => {
		getData();
	}, [record?.identityCode]);

	const columns: IColumn<GiaoDich.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.lichsu' }),
			dataIndex: 'identityCode',
			width: 120,
			align: 'center',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.loai' }),
			align: 'center',
			width: 100,
			render: (val, rec) => {
				switch ((rec.fromAccount, rec.toAccount)) {
					case (ETransactionSourceType.EXTERNAL, ETransactionSourceType.WALLET):
						return <Tag color='green'>{intl.formatMessage({ id: 'taichinh.hoadon.noptien' })}</Tag>;
					case (ETransactionSourceType.WALLET, ETransactionSourceType.SYSTEM):
						return <Tag color='orange'>{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoan' })}</Tag>;
					case (ETransactionSourceType.SYSTEM, ETransactionSourceType.WALLET):
						return <Tag color='purple'>{intl.formatMessage({ id: 'taichinh.hoadon.hoantra' })}</Tag>;
					default:
						return null;
				}
			},
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.sotien' }),
			dataIndex: 'amount',
			align: 'right',
			width: 120,
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.hinhthuc' }),
			dataIndex: 'paymentType',
			width: 140,
			render: (val: ETransactionPaymentType, rec) => transactionPaymentLabel?.[val as ETransactionPaymentType] ?? '',
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.trangthai' }),
			dataIndex: 'status',
			width: 140,
			align: 'center',
			render: (val: ETransactionStatus) => (
				<Tag color={colorTransactionStatus[val]}>{transactionStatus[val] ?? ''}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.chuyenvien' }),
			dataIndex: 'manualUserFullname',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.thoigian' }),
			align: 'center',
			dataIndex: 'createdAt',
			width: 120,
			sortable: true,
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.thaotac' }),
			width: 90,
			align: 'center',
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						disabled={rec.status !== ETransactionStatus.PENDING || rec.fromAccount !== ETransactionSourceType.EXTERNAL}
						icon={<DollarOutlined />}
						tooltip={intl.formatMessage({ id: 'taichinh.hoadon.button.thanhtoan' })}
						onClick={() => onPay && onPay(rec)}
						type='link'
					/>
					<Popconfirm
						title={intl.formatMessage({ id: 'taichinh.hoadon.confirm.huy' })}
						onConfirm={() => onCancel && onCancel(rec)}
						disabled={rec.status !== ETransactionStatus.PENDING || rec.fromAccount !== ETransactionSourceType.EXTERNAL}
						placement='topRight'
					>
						<ButtonExtend
							disabled={
								rec.status !== ETransactionStatus.PENDING || rec.fromAccount !== ETransactionSourceType.EXTERNAL
							}
							icon={<CloseOutlined />}
							tooltip={intl.formatMessage({ id: 'taichinh.hoadon.button.huy' })}
							type='link'
							danger
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return <TableStaticData columns={columns} data={danhSach} addStt size='small' loading={loading} />;
};

export default LichSuThanhToan;
