import DonutChart from '@/components/Chart/DonutChart';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getThongKeNganhSinhVien } from '@/services/DaoTaoV2/SinhVien';
import { jsonToXlsx, transformDataColumnsTableToJson } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Col, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const ThongKeNganh = (props: { mode: 'table' | 'donut' }) => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const [data, setData] = useState<
		{ nganh: string; tongSoSv: number; nu: number; nam: number; noInfoGioiTinh: number }[]
	>([]);

	const getData = async () => {
		if (!recHocKy) return;
		const res = await getThongKeNganhSinhVien(recHocKy.ma);
		setData(res?.data?.data ?? []);
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const columns: IColumn<{
		nganh: string;
		tongSoSv: number;
		nu: number;
		nam: number;
		noInfoGioiTinh: number;
		danToc: number;
		tonGiao: number;
	}>[] = [
		{
			title: intl.formatMessage({ id: 'thongke.nganh.column.nganh' }),
			dataIndex: 'nganh',
			filterType: 'string',
			width: 200,
			// align: 'center',
			render: (val) => val || intl.formatMessage({ id: 'thongke.nganh.common.noInfo' }),
		},
		{
			title: intl.formatMessage({ id: 'thongke.nganh.column.tongSo' }),
			dataIndex: 'tongSoSv',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.nganh.column.dantoc' }),
			dataIndex: 'danToc',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.nganh.column.tongiao' }),
			dataIndex: 'tonGiao',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.nganh.column.nu' }),
			dataIndex: 'nu',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.nganh.column.nam' }),
			dataIndex: 'nam',
			width: 200,
			sortable: true,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.nganh.column.noGenderInfo' }),
			dataIndex: 'noInfoGioiTinh',
			width: 200,
			sortable: true,
			align: 'center',
		},
	];

	const handleExportDuLieu = async () => {
		try {
			const payload = transformDataColumnsTableToJson(columns, data);
			jsonToXlsx(payload, 'Thống kê sinh viên theo ngành');
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
				{intl.formatMessage({ id: 'thongke.nganh.common.export' })}
			</Button>
			<TableStaticData
				otherProps={
					{
						pagination: false,

						summary: (pageData: any[]) => {
							let allSoLuong = 0;
							let allNu = 0;
							let allNam = 0;
							let allKhongThongTin = 0;
							let allDanToc = 0;
							let allTonGiao = 0;
							pageData.map((item) => {
								allSoLuong += item?.tongSoSv ?? 0;
								allNu += item?.nu ?? 0;
								allNam += item?.nam ?? 0;
								allKhongThongTin += item?.noInfoGioiTinh ?? 0;
								allDanToc += item?.danToc ?? 0;
								allTonGiao += item?.tonGiao ?? 0;
							});
							return (
								<Table.Summary.Row style={{ textAlign: 'center', fontWeight: 'bold' }}>
									<Table.Summary.Cell index={0} />
									<Table.Summary.Cell index={1}>
										{intl.formatMessage({ id: 'thongke.nganh.common.total' })}
									</Table.Summary.Cell>
									<Table.Summary.Cell index={2}>{allSoLuong}</Table.Summary.Cell>
									<Table.Summary.Cell index={2}>{allDanToc}</Table.Summary.Cell>
									<Table.Summary.Cell index={2}>{allTonGiao}</Table.Summary.Cell>
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
				{intl.formatMessage({ id: 'thongke.nganh.common.export' })}
			</Button>
			<Col md={12} lg={12}>
				<DonutChart
					showTotal
					formatY={(val) => `${intl.formatMessage({ id: 'thongke.nganh.unit.sinhvien' }, { value: val })}`}
					height={220}
					yLabel={[intl.formatMessage({ id: 'thongke.nganh.chart.sinhvien' })]}
					xAxis={data.map((item) =>
						item.nganh ? item.nganh : intl.formatMessage({ id: 'thongke.nganh.common.noInfo' }),
					)}
					yAxis={[data.map((item) => item.tongSoSv)]}
				/>
			</Col>
			<Col md={12} lg={12}>
				<DonutChart
					showTotal
					formatY={(val) => `${intl.formatMessage({ id: 'thongke.nganh.unit.nu' }, { value: val })}`}
					height={220}
					yLabel={[intl.formatMessage({ id: 'thongke.nganh.chart.nu' })]}
					xAxis={data.map((item) =>
						item.nganh ? item.nganh : intl.formatMessage({ id: 'thongke.nganh.common.noInfo' }),
					)}
					yAxis={[data.map((item) => item?.nu)]}
				/>
			</Col>
			<Col md={12} lg={12}>
				<DonutChart
					showTotal
					formatY={(val) => `${intl.formatMessage({ id: 'thongke.nganh.unit.nam' }, { value: val })}`}
					height={220}
					yLabel={[intl.formatMessage({ id: 'thongke.nganh.chart.nam' })]}
					xAxis={data.map((item) =>
						item.nganh ? item.nganh : intl.formatMessage({ id: 'thongke.nganh.common.noInfo' }),
					)}
					yAxis={[data.map((item) => item?.nam)]}
				/>
			</Col>
		</Row>
	);
};

export default ThongKeNganh;
