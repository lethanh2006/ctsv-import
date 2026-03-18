import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';

import { inputFormat } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Modal, Popconfirm, Table } from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormDuToanKinhPhi from './FormDuToanKinhPhi';

const TableDuToanKinhPhi = () => {
	const intl = useIntl();
	const { record: recHoatDong, setRecord: setRecHoatDong } = useModel('hoatdongchung');
	const [visibleForm, setVisibleForm] = useState(false);
	const [recDuToan, setRecDuToan] = useState<HoatDongChung.IDuToanKinhPhi>();
	const [edit, setEdit] = useState<boolean>(false);
	const onCell = (rec: HoatDongChung.IDuToanKinhPhi) => ({
		onClick: () => {},
		style: { cursor: 'pointer' },
	});

	const onCancel = () => {
		setVisibleForm(false);
	};

	const columns: IColumn<HoatDongChung.IDuToanKinhPhi & { index: number }>[] = [
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.chitiet' }),
			dataIndex: 'hoatDong',
			width: 180,
			filterType: 'string',
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.dvt' }),
			dataIndex: 'donViTinh',
			align: 'center',
			width: 120,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.soluong' }),
			width: 260,
			children: [
				{
					title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.nguoi' }),
					dataIndex: 'soLuongNguoi',
					align: 'center',
					width: 80,
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.ngay' }),
					dataIndex: 'soLuongNgay',
					align: 'center',
					width: 80,
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.khac' }),
					dataIndex: 'soLuongKhac',
					align: 'center',
					width: 80,
					onCell,
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.dinhmuc' }),
			dataIndex: 'dinhMuc',
			align: 'center',
			width: 100,
			render: (val, rec) => inputFormat(val),
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.thanhtien' }),
			align: 'center',
			width: 120,
			render: (val, rec) =>
				rec?.dinhMuc
					? inputFormat((rec?.soLuongNguoi ?? 1) * (rec?.soLuongNgay ?? 1) * (rec?.soLuongKhac ?? 1) * rec?.dinhMuc)
					: 0,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.tiendo' }),
			dataIndex: 'tienDoHoanThanh',
			width: 120,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.chungtu' }),
			dataIndex: 'chungTuYeuCau',
			width: 150,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.ghichu' }),
			dataIndex: 'ghiChu',
			width: 150,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.column.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec, index) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						type='link'
						onClick={() => {
							setRecDuToan(rec);
							setVisibleForm(true);
							setEdit(true);
						}}
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => {
							setRecHoatDong({
								...recHoatDong,
								danhSachDuToanKinhPhi:
									recHoatDong?.danhSachDuToanKinhPhi
										?.map((item, ind: number) => ({ ...item, index: ind }))
										?.filter((item) => item.index !== index)
										.map((item, ind) => ({ ...item, index: ind })) ?? [],
							} as HoatDongChung.IRecord);
						}}
						title={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.comfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData
				data={recHoatDong?.danhSachDuToanKinhPhi ?? []}
				columns={columns}
				size='small'
				addStt
				otherProps={
					{
						pagination: false,
						scroll: { y: 250 },
						summary: (pageData: HoatDongChung.IDuToanKinhPhi[]) => {
							const tongTien = _.sumBy(
								pageData,
								(item) =>
									(item?.soLuongNguoi ?? 1) * (item?.soLuongNgay ?? 1) * (item?.soLuongKhac ?? 1) * item?.dinhMuc,
							);
							return (
								<Table.Summary fixed>
									<Table.Summary.Row>
										<Table.Summary.Cell align='center' index={0} colSpan={7}>
											<b>{intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.tongtien' })}</b>
										</Table.Summary.Cell>
										<Table.Summary.Cell align='right' index={1}>
											<b> {inputFormat(tongTien ?? 0)} VNĐ</b>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={2} />
										<Table.Summary.Cell index={3} />
										<Table.Summary.Cell index={4} />
										<Table.Summary.Cell index={5} />
									</Table.Summary.Row>
								</Table.Summary>
							);
						},
					} as any
				}
				hasTotal
			>
				<ButtonExtend
					icon={<PlusCircleOutlined />}
					onClick={() => {
						setVisibleForm(true);
						setRecDuToan(undefined);
						setEdit(false);
					}}
					size='small'
					type='primary'
				>
					{intl.formatMessage({ id: 'global.button.themmoi' })}
				</ButtonExtend>
			</TableStaticData>

			<Modal
				destroyOnClose
				title={
					edit
						? intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.chinhsua' })
						: intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.themmoi' })
				}
				open={visibleForm}
				width={800}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<FormDuToanKinhPhi record={recDuToan} edit={edit} onCancel={onCancel} />
			</Modal>
		</>
	);
};

export default TableDuToanKinhPhi;
