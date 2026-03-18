import ColumnChart from '@/components/Chart/ColumnChart';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectLopHanhChinh from '@/pages/DaoTaoV2/NamHoc/LopHanhChinh/components/SelectLopHanhChinh';
import SelectDotDiemRenLuyen from '@/pages/DiemRenLuyen/Dot/Select';
import { ETrangThaiTiepNhanMinhChung } from '@/services/DiemRenLuyen/MinhChung/KhaiBao/constants';
import type { MinhChungDrl } from '@/services/DiemRenLuyen/MinhChung/typing';
import { inputFormat } from '@/utils/utils';
import { Card, Space, Table } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ThongKeMinhChung = () => {
	const intl = useIntl();
	const { getAllModel, danhSach, record } = useModel('diemrenluyen.minhchung.cauhinh');
	const { record: recordDot, setRecord: setRecortdDot } = useModel('diemrenluyen.dot');
	const { record: recordLopHanhChinh, setRecord: setRecordLopHanhChinh } = useModel(
		'daotaov2.lophanhchinh.lophanhchinh',
	);
	const getData = async (isSetRecord: boolean) => {
		try {
			getAllModel(isSetRecord, undefined, {
				dungChoSuKien: false,
				dotChamDiemId: recordDot?._id,
				lopHanhChinh: recordLopHanhChinh?.ten,
			});
		} catch (e) {
			console.log(e);
		}
	};

	const columns: IColumn<MinhChungDrl.IBieuMau>[] = [
		{
			title: intl.formatMessage({ id: 'minhchung.khaibao.minhchung' }),
			dataIndex: 'tenMinhChung',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'minhchung.khaibao.choxuly' }),
			dataIndex: 'tenMinhChung',
			width: 100,
			align: 'right',
			sortable: true,
			render: (val, rec) => rec?.trangThaiMinhChung?.[ETrangThaiTiepNhanMinhChung.CHO_XU_LY],
		},
		{
			title: intl.formatMessage({ id: 'minhchung.khaibao.duyet' }),
			dataIndex: 'tenMinhChung',
			width: 100,
			align: 'right',
			sortable: true,
			render: (val, rec) => rec?.trangThaiMinhChung?.[ETrangThaiTiepNhanMinhChung.DUYET],
		},
		{
			title: intl.formatMessage({ id: 'minhchung.khaibao.khongduyet' }),
			dataIndex: 'tenMinhChung',
			width: 100,
			align: 'right',
			sortable: true,
			render: (val, rec) => rec?.trangThaiMinhChung?.[ETrangThaiTiepNhanMinhChung.KHONG_DUYET],
		},
	];

	useEffect(() => {
		getData(!record);

		return () => {};
	}, [recordDot, recordLopHanhChinh]);

	return (
		<>
			<Card title={intl.formatMessage({ id: 'minhchung.khaibao.thongke' })}>
				<Space style={{ marginBottom: 12 }}>
					<SelectDotDiemRenLuyen
						style={{ width: 300 }}
						value={recordDot?._id}
						onChange={(val, option) => {
							const rawData = option?.rawData;
							setRecortdDot(rawData);
						}}
						isSetRecord={true}
					/>
					<SelectLopHanhChinh
						allowClear
						value={recordLopHanhChinh?._id}
						style={{ width: 150 }}
						onChange={(val: any, option: any) => {
							const rawData = option?.rawData;
							setRecordLopHanhChinh(rawData);
						}}
					/>
				</Space>
				<ColumnChart
					height={320}
					yLabel={[intl.formatMessage({ id: 'minhchung.khaibao.minhchung' })]}
					// yAxis={[combinedArr?.map((val) => val?.tongLuongMotVaHai)]}
					xAxis={danhSach?.map((val) => val?.tenMinhChung)}
					colors={['#27AE60', '#BA4A00', '#3498DB']}
					series={[
						{
							name: intl.formatMessage({ id: 'minhchung.khaibao.choxuly' }),
							data: danhSach.map((item) => item.trangThaiMinhChung?.[ETrangThaiTiepNhanMinhChung.CHO_XU_LY]),
							color: '#3498DB',
						},
						{
							name: intl.formatMessage({ id: 'minhchung.khaibao.duyet' }),
							data: danhSach.map((item) => item.trangThaiMinhChung?.[ETrangThaiTiepNhanMinhChung.DUYET]),
							color: 'var(--ant-success-color)',
						},
						{
							name: intl.formatMessage({ id: 'minhchung.khaibao.khongduyet' }),
							data: danhSach.map((item) => item.trangThaiMinhChung?.[ETrangThaiTiepNhanMinhChung.KHONG_DUYET]),
							color: 'var(--ant-error-color)',
						},
					]}
					otherOptions={{
						chart: {
							stacked: true,
						},
						yaxis: {
							labels: { formatter: (val) => `${val}` },
						},
						plotOptions: { bar: { columnWidth: '20%' } },
						responsive: [
							{
								breakpoint: 1600,
								options: {
									plotOptions: {
										bar: {
											columnWidth: '40%',
										},
									},
								},
							},
						],
						legend: {
							show: false,
						},
						tooltip: {
							shared: true,
							intersect: false,
							inverseOrder: true,
							y: { formatter: (val) => `${val}` },
						},
					}}
				/>
				<TableStaticData
					addStt
					hasTotal
					data={danhSach}
					columns={columns}
					otherProps={
						{
							summary: (data: any[]) => {
								const dataFiltered: MinhChungDrl.IBieuMau[] = danhSach as MinhChungDrl.IBieuMau[];
								const sumChoXuLy = _.sumBy(
									dataFiltered,
									(item) => item?.trangThaiMinhChung?.[ETrangThaiTiepNhanMinhChung.CHO_XU_LY] ?? 0,
								);
								const sumDuyet = _.sumBy(
									dataFiltered,
									(item) => item?.trangThaiMinhChung?.[ETrangThaiTiepNhanMinhChung.DUYET] ?? 0,
								);
								const sumKhongDuyet = _.sumBy(
									dataFiltered,
									(item) => item?.trangThaiMinhChung?.[ETrangThaiTiepNhanMinhChung.KHONG_DUYET] ?? 0,
								);

								return (
									<Table.Summary fixed>
										<Table.Summary.Row>
											<Table.Summary.Cell index={0} colSpan={2} align='center'>
												<b>{intl.formatMessage({ id: 'minhchung.khaibao.tongcong' })}</b>
											</Table.Summary.Cell>

											<Table.Summary.Cell index={1} align='right'>
												<b>{inputFormat(sumChoXuLy ?? 0)} </b>
											</Table.Summary.Cell>
											<Table.Summary.Cell index={2} align='right'>
												<b>{inputFormat(sumDuyet ?? 0)} </b>
											</Table.Summary.Cell>
											<Table.Summary.Cell index={3} align='right'>
												<b>{inputFormat(sumKhongDuyet ?? 0)} </b>
											</Table.Summary.Cell>
										</Table.Summary.Row>
									</Table.Summary>
								);
							},
						} as any
					}
				/>
			</Card>
		</>
	);
};
export default ThongKeMinhChung;
