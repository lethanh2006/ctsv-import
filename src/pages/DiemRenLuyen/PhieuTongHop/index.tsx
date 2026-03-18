import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import {
	EXepLoaiDiemRenLuyenLabel,
	MapKeyColorXepLoaiDiemRenLuyenLabel,
} from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import type { PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/typing';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Descriptions, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotDiemRenLuyen from '../Dot/Select';

const PhieuTongHop = (props: { tenLop?: string; idLop: string }) => {
	const intl = useIntl();
	const { getPhieuTongHopModel, recPhieuTongHop, loading, exportPhieuTongHopModel } = useModel(
		'diemrenluyen.phieudiemrenluyen',
	);

	const { record: recDot, setRecord: setRecDot } = useModel('diemrenluyen.dot');

	useEffect(() => {
		if (props?.tenLop && recDot?._id) getPhieuTongHopModel(recDot._id, props.tenLop);
	}, [props.tenLop, recDot?._id]);

	const columns: IColumn<PhieuDiemRenLuyen.PhieuTongHopSV>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieutonghop.column.hodem' }),
			dataIndex: 'hoDem',
			align: 'center',
			filterType: 'string',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieutonghop.column.ten' }),
			dataIndex: 'ten',
			align: 'center',
			filterType: 'string',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieutonghop.column.msv' }),
			dataIndex: 'msv',
			align: 'center',
			filterType: 'string',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieutonghop.column.danhgia' }),
			align: 'center',
			width: 400,
			children: [
				{
					title: intl.formatMessage({ id: 'lophanhchinh.phieutonghop.column.nd1' }),
					dataIndex: 'nd1',
					align: 'center',
					width: 80,
					sortable: true,
					render: (val) => val ?? '--',
				},
				{
					title: intl.formatMessage({ id: 'lophanhchinh.phieutonghop.column.nd2' }),
					dataIndex: 'nd2',
					align: 'center',
					width: 80,
					sortable: true,
					render: (val) => val ?? '--',
				},
				{
					title: intl.formatMessage({ id: 'lophanhchinh.phieutonghop.column.nd3' }),
					dataIndex: 'nd3',
					align: 'center',
					width: 80,
					sortable: true,
					render: (val) => val ?? '--',
				},
				{
					title: intl.formatMessage({ id: 'lophanhchinh.phieutonghop.column.nd4' }),
					dataIndex: 'nd4',
					align: 'center',
					width: 80,
					sortable: true,
					render: (val) => val ?? '--',
				},
				{
					title: intl.formatMessage({ id: 'lophanhchinh.phieutonghop.column.nd5' }),
					dataIndex: 'nd5',
					align: 'center',
					width: 80,
					sortable: true,
					render: (val) => val ?? '--',
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieutonghop.column.tongdiem' }),
			dataIndex: 'tongDiem',
			align: 'center',
			width: 100,
			sortable: true,
			render: (val) => (val ? val : '--'),
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.phieutonghop.column.xephang' }),
			dataIndex: 'xepHang',
			align: 'center',
			width: 100,
			filterType: 'select',
			filterData: Object.values(EXepLoaiDiemRenLuyenLabel),
			render: (val: EXepLoaiDiemRenLuyenLabel) =>
				val ? <Tag color={MapKeyColorXepLoaiDiemRenLuyenLabel[val]}>{val}</Tag> : '--',
		},
	];

	return (
		<>
			<h2 style={{ textAlign: 'center', marginBottom: 18 }}>
				{intl.formatMessage({ id: 'lophanhchinh.phieutonghop.title' })}
			</h2>
			<Descriptions column={{ xs: 1, md: 3 }}>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.phieutonghop.label.lop' })}>
					<b>{recPhieuTongHop?.lopHC ?? ''}</b>
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.phieutonghop.label.khoa' })}>
					<b>{recPhieuTongHop?.khoa ?? ''}</b>
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.phieutonghop.label.dot' })}>
					<b>{recDot?.tenDot}</b>
				</Descriptions.Item>
			</Descriptions>
			<>
				<TableStaticData hasTotal data={recPhieuTongHop?.ds ?? []} columns={columns} loading={loading} addStt>
					<div>
						<SelectDotDiemRenLuyen
							style={{ width: 300 }}
							value={recDot?._id}
							onChange={(val, option) => {
								const rawData = option?.rawData;
								setRecDot(rawData);
							}}
							isSetRecord={true}
						/>
						<Button
							style={{ marginLeft: 8 }}
							loading={loading}
							onClick={() =>
								exportPhieuTongHopModel(recDot?._id ?? '', recPhieuTongHop?.lopHC ?? '', recDot?.tenDot ?? '')
							}
							key={'download'}
							icon={<DownloadOutlined />}
							type='primary'
						>
							{intl.formatMessage({ id: 'lophanhchinh.phieutonghop.button.download' })}
						</Button>
					</div>
				</TableStaticData>
			</>
			<p style={{ marginTop: 18 }}>
				<b>{intl.formatMessage({ id: 'lophanhchinh.phieutonghop.note.title' })}</b>
				{intl.formatMessage({ id: 'lophanhchinh.phieutonghop.note.content' })}
			</p>
			<Descriptions column={1} bordered>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.phieutonghop.rank.xuatsac' })}>
					{recPhieuTongHop?.sv1 ?? '--'} {intl.formatMessage({ id: 'lophanhchinh.phieutonghop.unit.sv' })} (
					{recPhieuTongHop?.xuatSac}%)
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.phieutonghop.rank.tot' })}>
					{recPhieuTongHop?.sv2 ?? '--'} {intl.formatMessage({ id: 'lophanhchinh.phieutonghop.unit.sv' })} (
					{recPhieuTongHop?.tot}%)
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.phieutonghop.rank.kha' })}>
					{recPhieuTongHop?.sv3 ?? '--'} {intl.formatMessage({ id: 'lophanhchinh.phieutonghop.unit.sv' })} (
					{recPhieuTongHop?.kha}%)
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.phieutonghop.rank.tb' })}>
					{recPhieuTongHop?.sv4 ?? '--'} {intl.formatMessage({ id: 'lophanhchinh.phieutonghop.unit.sv' })} (
					{recPhieuTongHop?.tb}%)
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.phieutonghop.rank.yeu' })}>
					{recPhieuTongHop?.sv5 ?? '--'} {intl.formatMessage({ id: 'lophanhchinh.phieutonghop.unit.sv' })} (
					{recPhieuTongHop?.y}%)
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.phieutonghop.rank.kem' })}>
					{recPhieuTongHop?.sv6 ?? '--'} {intl.formatMessage({ id: 'lophanhchinh.phieutonghop.unit.sv' })} (
					{recPhieuTongHop?.k}%)
				</Descriptions.Item>
			</Descriptions>
		</>
	);
};

export default PhieuTongHop;
