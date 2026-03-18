import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectHocKy from '@/pages/HocKy/components/SelectHocKy';
import { ETrangThaiKhamSucKhoe, colorETrangThaiKhaiBaoSucKhoe } from '@/services/DotKhamSuKhoe/constant';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import { ArrowDownOutlined, CheckOutlined, DeleteOutlined, EditOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Popover, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalDotKhamSucKhoe from './components/ModalDotKhamSucKhoe';
import ModalYeuCauChinhSua from './components/ModalYeuCauChinhSua';

const DotKhamSucKhoePage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit, putModel, getModel, setRecord } = useModel(
		'hosotheodoisuckhoe.dotkhamsuckhoe',
	);
	const { record: recHocKy, setRecord: retRecHocKy, danhSach: danhSachHocKy } = useModel('daotaov2.hocky.hocky');
	const [viewYeuCau, setViewYeuCau] = useState<boolean>(false);

	const onCell = (record: DotKhamSucKhoe.IRecord) => ({
		onClick: () => handleEdit(record),
		style: { cursor: 'pointer' },
	});

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	const handleDuyet = (record: DotKhamSucKhoe.IRecord) => {
		putModel(
			record._id ?? '',
			{ ...record, trangThai: ETrangThaiKhamSucKhoe.DA_DUYET, ghiChu: '' },
			getData,
			undefined,
			undefined,
			intl.formatMessage({ id: 'global.message.luuthanhcong' }),
		)
			.then()
			.catch((err) => console.log(err));
	};

	const columns: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.column.hocky' }),
			dataIndex: 'tenHocKy',
			width: 150,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.column.tendot' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.column.tgbd' }),
			dataIndex: 'thoiGianBatDau',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && dayjs(val).format(' DD/MM/YYYY'),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.column.tgkt' }),
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && dayjs(val).format(' DD/MM/YYYY'),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.column.trangthai' }),
			dataIndex: 'trangThai',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiKhamSucKhoe),
			render: (val, rec) => <Tag color={colorETrangThaiKhaiBaoSucKhoe[val as ETrangThaiKhamSucKhoe]}>{val}</Tag>,
			width: 120,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.column.ghichu' }),
			dataIndex: 'ghiChu',
			width: 150,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dotkhamsuckhoe.column.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (rec) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							onConfirm={() =>
								deleteModel(rec._id, getData, {
									messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
								})
							}
							title={intl.formatMessage({ id: 'dotkhamsuckhoe.confirm.xoa' })}
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
					<Popover
						placement='bottomLeft'
						content={
							<>
								<Popconfirm
									onConfirm={() => handleDuyet(rec)}
									title={intl.formatMessage({ id: 'dotkhamsuckhoe.confirm.duyet' })}
									placement='topRight'
								>
									<ButtonExtend
										tooltip={intl.formatMessage({ id: 'dotkhamsuckhoe.button.duyet' })}
										type='link'
										icon={<CheckOutlined />}
									/>
								</Popconfirm>
								<ButtonExtend
									onClick={() => (setViewYeuCau(true), setRecord(rec))}
									tooltip={intl.formatMessage({ id: 'dotkhamsuckhoe.button.yccs' })}
									type='link'
									icon={<EditOutlined />}
								/>
								<ButtonExtend
									tooltip={intl.formatMessage({ id: 'dotkhamsuckhoe.button.taibieumau' })}
									type='link'
									icon={<ArrowDownOutlined />}
								/>
							</>
						}
					>
						<Button type='link' icon={<MenuOutlined />} />
					</Popover>
				</>
			),
		},
	];

	return (
		<Card title={intl.formatMessage({ id: 'dotkhamsuckhoe.title' })}>
			<TableBase
				columns={columns}
				params={{ maHocKy: recHocKy?.ma }}
				dependencies={[page, limit, recHocKy?.ma]}
				modelName='hosotheodoisuckhoe.dotkhamsuckhoe'
				title={intl.formatMessage({ id: 'dotkhamsuckhoe.title' })}
				Form={ModalDotKhamSucKhoe}
				widthDrawer={1000}
				hideCard
				rowSelection
				deleteMany
				otherButtons={[
					<>
						<SelectHocKy
							style={{ width: 250 }}
							value={recHocKy?.ma}
							onChange={(val) => {
								retRecHocKy(danhSachHocKy.find((item) => item.ma === val));
							}}
							isSetRecord
							selectMa
						/>
					</>,
				]}
			/>
			<ModalYeuCauChinhSua visibleForm={viewYeuCau} setVisibleForm={setViewYeuCau} />
		</Card>
	);
};

export default DotKhamSucKhoePage;
