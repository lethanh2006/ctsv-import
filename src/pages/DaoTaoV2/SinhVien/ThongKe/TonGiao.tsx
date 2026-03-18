import DonutChart from '@/components/Chart/DonutChart';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getThongKeTonGiaoSinhVien } from '@/services/DaoTaoV2/SinhVien';
import { jsonToXlsx, transformDataColumnsTableToJson } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Col, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const ThongKeTonGiao = (props: { mode: 'table' | 'donut' }) => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const [data, setData] = useState<
		{ tonGiao: string; tongSoSv: number; nu: number; nam: number; noInfoGioiTinh: number }[]
	>([]);

	const getData = async () => {
		if (!recHocKy) return;
		const res = await getThongKeTonGiaoSinhVien(recHocKy.ma);
		setData(
			res?.data?.data?.map((item: any) => ({
				...item,
				noInfoGioiTinh: item?.tongSoSv - item?.nu - item?.nam,
			})) ?? [],
		);
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const columns: IColumn<{ tonGiao: string; tongSoSv: number; nu: number; nam: number; noInfoGioiTinh: number }>[] = [
		{
			title: intl.formatMessage({ id: 'thongke.tongiao.column.tongiao' }),
			dataIndex: 'tonGiao',
			filterType: 'string',
			width: 200,
			align: 'center',
			render: (val) => val || intl.formatMessage({ id: 'thongke.tongiao.common.noInfo' }),
		},
		{
			title: intl.formatMessage({ id: 'thongke.tongiao.column.tongSo' }),
			dataIndex: 'tongSoSv',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.tongiao.column.nu' }),
			dataIndex: 'nu',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.tongiao.column.nam' }),
			dataIndex: 'nam',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.tongiao.column.noGenderInfo' }),
			dataIndex: 'noInfoGioiTinh',
			width: 200,
			sortable: true,
			render: (val) => val || 0,
			align: 'center',
		},
	];

	const handleExportDuLieu = async () => {
		try {
			const payload = transformDataColumnsTableToJson(columns, data);
			jsonToXlsx(payload, 'Thống kê sinh viên theo tôn giáo');
		} catch (e) {
			console.log(e);
		}
	};

	return props.mode === 'table' ? (
		<>
			<Button
				type='primary'
				icon={<ExportOutlined />}
				onClick={() => {
					handleExportDuLieu();
				}}
			>
				{intl.formatMessage({ id: 'thongke.tongiao.common.export' })}
			</Button>
			<TableStaticData
				otherProps={
					{
						summary: (pageData: any[]) => {
							let allSoLuong = 0;
							let allNu = 0;
							let allNam = 0;
							let allKhongThongTin = 0;
							pageData.map((item) => {
								allSoLuong += item?.tongSoSv ?? 0;
								allNu += item?.nu ?? 0;
								allNam += item?.nam ?? 0;
								allKhongThongTin += item?.noInfoGioiTinh ?? 0;
							});
							return (
								<Table.Summary.Row style={{ textAlign: 'center', fontWeight: 'bold' }}>
									<Table.Summary.Cell index={0} />
									<Table.Summary.Cell index={1}>
										{intl.formatMessage({ id: 'thongke.tongiao.common.total' })}
									</Table.Summary.Cell>
									<Table.Summary.Cell index={2}>{allSoLuong}</Table.Summary.Cell>
									<Table.Summary.Cell index={3}>{allNu}</Table.Summary.Cell>
									<Table.Summary.Cell index={4}>{allNam}</Table.Summary.Cell>
									<Table.Summary.Cell index={5}>{allKhongThongTin}</Table.Summary.Cell>
								</Table.Summary.Row>
							);
						},
					} as any
				}
				addStt
				columns={columns}
				data={data}
			/>
		</>
	) : (
		<Row>
			<Button
				type='primary'
				icon={<ExportOutlined />}
				onClick={() => {
					handleExportDuLieu();
				}}
			>
				{intl.formatMessage({ id: 'thongke.tongiao.common.export' })}
			</Button>
			<Col md={12} lg={8}>
				<DonutChart
					showTotal
					formatY={(val) => `${intl.formatMessage({ id: 'thongke.tongiao.unit.sinhvien' }, { value: val })}`}
					height={220}
					yLabel={[intl.formatMessage({ id: 'thongke.tongiao.chart.sinhvien' })]}
					xAxis={data.map((item) =>
						item.tonGiao ? item.tonGiao : intl.formatMessage({ id: 'thongke.dantoc.common.noInfo' }),
					)}
					yAxis={[data.map((item) => item?.tongSoSv)]}
				/>
			</Col>
			<Col md={12} lg={8}>
				<DonutChart
					showTotal
					formatY={(val) => `${intl.formatMessage({ id: 'thongke.tongiao.unit.sinhvien' }, { value: val })}`}
					height={220}
					yLabel={[intl.formatMessage({ id: 'thongke.tongiao.chart.sinhvien' })]}
					xAxis={data.map((item) =>
						item.tonGiao ? item.tonGiao : intl.formatMessage({ id: 'thongke.dantoc.common.noInfo' }),
					)}
					yAxis={[data.map((item) => item?.nu)]}
				/>
			</Col>
			<Col md={12} lg={8}>
				<DonutChart
					showTotal
					formatY={(val) => `${intl.formatMessage({ id: 'thongke.tongiao.unit.nam' }, { value: val })}`}
					height={220}
					yLabel={[intl.formatMessage({ id: 'thongke.tongiao.chart.nam' })]}
					xAxis={data.map((item) =>
						item.tonGiao ? item.tonGiao : intl.formatMessage({ id: 'thongke.dantoc.common.noInfo' }),
					)}
					yAxis={[data.map((item) => item?.nam)]}
				/>
			</Col>
		</Row>
	);
};

export default ThongKeTonGiao;
