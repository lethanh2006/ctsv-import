import LineChart from '@/components/Chart/LineChart';
import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { Col, Empty, Row, Tag } from 'antd';
import { sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

type TData = ChuongTrinhDaoTao.ICdrMucTieuHocPhan & {
	soThuTuKy?: number;
	diemDatDuoc?: number;
};

const ChuanDauRaSinhVien = (props: { sinhVienSsoId: string; maKhoaNganh: string }) => {
	const intl = useIntl();
	const { sinhVienSsoId, maKhoaNganh } = props;
	const { thongKeDiemPLOSinhVienModel, thongKePLO } = useModel('daotaov2.ketquahoctap.diemhpsvhk');
	const [record, setRecord] = useState<ChuongTrinhDaoTao.TDiemPi>();

	useEffect(() => {
		if (sinhVienSsoId && maKhoaNganh) {
			thongKeDiemPLOSinhVienModel(maKhoaNganh, sinhVienSsoId).then((res) => {
				setRecord(res?.danhSachChuanDauRaMucTieu?.[0]);
			});
		}
	}, [sinhVienSsoId, maKhoaNganh]);

	const onCell = (rec: ChuongTrinhDaoTao.TDiemPi) => ({
		onClick: () => setRecord(rec),
		style: {
			cursor: 'pointer',
			fontWeight: rec?.maPlo === record?.maPlo ? 600 : undefined,
			backgroundColor: rec?.maPlo === record?.maPlo ? 'var(--color-primary-bg)' : undefined,
		},
	});

	const columns: IColumn<ChuongTrinhDaoTao.TDiemPi>[] = [
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.tt' }),
			dataIndex: 'index',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.maplo' }),
			dataIndex: 'maPlo',
			width: 80,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.chuandaura' }),
			dataIndex: 'ten',
			width: 180,
			filterType: 'string',
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.toithieu' }),
			dataIndex: 'diemPloToiThieu',
			width: 60,
			align: 'center',
			sortable: true,
			render: (val: number) => val?.toFixed(2),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.trungbinh' }),
			dataIndex: 'trungBinhPi',
			width: 60,
			align: 'center',
			sortable: true,
			render: (val: number) => val?.toFixed(2),
			onCell,
		},
	];

	const getCLOData = (): TData[] => {
		if (!record?.danhSachHocPhan) return [];
		const cloData: TData[] = [];

		record?.danhSachHocPhan?.forEach((hocPhan) => {
			hocPhan?.danhSachDiemClo?.forEach((diemClo: any) => {
				if (diemClo?.maClo && diemClo?.tyLeAnhHuong) {
					cloData.push({
						maClo: diemClo?.maClo,
						diemToiThieu: diemClo?.diemToiThieu ?? 0,
						diemDatDuoc: diemClo?.diem ?? 0,
						tyLeAnhHuong: diemClo?.tyLeAnhHuong,
						maHocPhan: hocPhan?.maHocPhan ?? '',
						soThuTuKy: hocPhan.soThuTuKy,
					});
				}
			});
		});

		return sortBy(cloData, ['soThuTuKy', 'maClo']);
	};

	const cloData = getCLOData();

	const chartXAxis = cloData.map((item) => `${item?.maClo}-${item?.maHocPhan}`);
	const chartYAxisDiemToiThieu = cloData.map((item) => item?.diemToiThieu ?? 0);
	const chartYAxisDiemDatDuoc = cloData.map((item) => item?.diemDatDuoc ?? 0);

	const cloColumns: IColumn<TData>[] = [
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.hocphan' }),
			dataIndex: 'maHocPhan',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.maclo' }),
			dataIndex: 'maClo',
			width: 80,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.donggop' }),
			dataIndex: 'tyLeAnhHuong',
			align: 'center',
			width: 60,
			filterType: 'number',
			render: (val: number) => `${val}%`,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.dtoithieu' }),
			dataIndex: 'diemToiThieu',
			align: 'center',
			width: 60,
			filterType: 'number',
			render: (val: number) => val?.toFixed(2),
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.ddatduoc' }),
			dataIndex: 'diemDatDuoc',
			align: 'center',
			width: 60,
			filterType: 'number',
			render: (val: number) => val?.toFixed(2),
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.trangthai' }),
			align: 'center',
			width: 80,
			render: (_, rec) => (
				<Tag color={(rec?.diemDatDuoc ?? 0 >= (rec?.diemToiThieu ?? 0)) ? 'green' : 'red'}>
					{(rec?.diemDatDuoc ?? 0 >= (rec?.diemToiThieu ?? 0))
						? intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.dat' })
						: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.khongdat' })}
				</Tag>
			),
		},
	];

	if (!thongKePLO?.danhSachChuanDauRaMucTieu?.length) {
		return (
			<Empty
				description={intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.khongcodulieuchuandaura' })}
				image={Empty.PRESENTED_IMAGE_SIMPLE}
			/>
		);
	}

	return (
		<>
			<Row gutter={[12, 12]}>
				<Col span={24} md={24} lg={10}>
					<TableStaticData
						columns={columns}
						data={thongKePLO?.danhSachChuanDauRaMucTieu ?? []}
						size='small'
						hasTotal
						otherProps={{ pagination: false, scroll: { y: 500 } }}
					/>
				</Col>
				<Col span={24} md={24} lg={14}>
					{record?.maPlo ? (
						<LineChart
							title={intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.duongphattriennl' }, { 0: record?.maPlo })}
							xAxis={chartXAxis}
							yLabel={[
								intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.diemclotoithieu' }),
								intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.diemclodatduoc' }),
							]}
							yAxis={[chartYAxisDiemToiThieu, chartYAxisDiemDatDuoc]}
							height={300}
							colors={['#18b903', '#0982c9']}
							formatY={(val) => val.toString()}
							otherOptions={{
								stroke: { curve: 'smooth', width: 2 },
								markers: { size: 4, hover: { size: 6 } },
								yaxis: { min: 0, tickAmount: 5 },
								xaxis: {
									categories: chartXAxis,
									labels: { rotate: -30, rotateAlways: true },
								},
								tooltip: {
									custom: function ({ dataPointIndex }) {
										const data = cloData[dataPointIndex];
										return `
												<div style="padding: 8px; background: #fff; border: 1px solid #ccc;">
													<strong>${intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.hocphan' })}: ${data?.maHocPhan}</strong><br/>
													${intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.maclo' })}: ${data?.maClo}<br/>
													${intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.mucdodonggop' })} ${data?.tyLeAnhHuong}%<br/>
													${intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.dtoithieu' })}: ${(data?.diemToiThieu ?? 0).toFixed(2)}<br/>
													${intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.ddatduoc' })}: ${(data?.diemDatDuoc ?? 0).toFixed(2)}
												</div>`;
									},
								},
							}}
						/>
					) : null}

					{record?.maPlo && cloData.length > 0 && (
						<div style={{ marginTop: 12 }}>
							<h4 style={{ marginBottom: 8 }}>
								{intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.chitietclodonggop' }, { 0: record.maPlo })}
							</h4>
							<TableStaticData
								columns={cloColumns}
								data={cloData}
								size='small'
								otherProps={{ pagination: false, scroll: { y: 250 } }}
							/>
						</div>
					)}
				</Col>
			</Row>
		</>
	);
};

export default ChuanDauRaSinhVien;
