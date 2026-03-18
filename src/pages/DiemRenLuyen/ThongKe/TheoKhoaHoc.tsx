import ColumnChart from '@/components/Chart/ColumnChart';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getThongKeTheoKhoaHoc } from '@/services/DiemRenLuyen';
import { inputFormat, jsonToXlsx, transformDataColumnsTableToJson } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Col, Row, Spin } from 'antd';
import numeral from 'numeral';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from './style.less';

type Data = {
	Khóa: string;
	'Phân loại Khá': number;
	'Phân loại Trung bình': number;
	'Phân loại Tốt': number;
	'Phân loại XS': number;
	'Phân loại Yếu/Kém': number;
	'Tổng số sinh viên': number;
	tenVietTat: string;
	'Chưa đánh giá': number;
};

interface IDataThongKe {
	tenVietTat: string;
	_id: string;
	externalId: string;
	active: boolean;
	dmNganhId: string;
	ma: string;
	ten: string;
	tenTiengAnh: string;
	canCuId: string;
	maDonVi: string;
	createdAt: string;
	updatedAt: string;
	maDmNganh: string;
	maTrinhDo: string;
	maNganhGoc: string;
	maCanCuPhapLy: string;
	xuatSac: number;
	tot: number;
	kha: number;
	trungBinh: number;
	yeu: number;
	kem: number;
	tong: number;
	chuaXepLoai: number;
}

const ThongKePhieuDiemTheoKhoaHoc = (props: { trinhDo: string; hinhThuc: string }) => {
	const intl = useIntl();
	const { record } = useModel('diemrenluyen.dot');
	const [data, setData] = useState<Data[]>([]);
	const [dataBieuDo, setDataBieuDo] = useState<any>();
	const [loading, setLoading] = useState<boolean>(false);
	const getData = async () => {
		if (!record?.kyHoc) return;
		setLoading(true);
		const res = await getThongKeTheoKhoaHoc(record.kyHoc, {
			maTrinhDoDaoTao: props?.trinhDo,
			maHinhThucDaoTao: props?.hinhThuc,
		});
		const dataRes: IDataThongKe[] = (res?.data?.data?.filter((item: { tong: any }) => item?.tong) ??
			[]) as IDataThongKe[];

		const dataBieuDoRes = dataRes?.map((val) => {
			return {
				Khóa: val?.ten,
				'Phân loại Khá': val?.kha ?? 0,
				'Phân loại Trung bình': val?.trungBinh ?? 0,
				'Phân loại Tốt': val?.tot ?? 0,
				'Phân loại XS': val?.xuatSac ?? 0,
				'Phân loại Yếu/Kém': val?.kem ?? 0,
				'Tổng số sinh viên': val?.tong ?? 0,
				'Chưa đánh giá': val?.chuaXepLoai ?? 0,
				tenVietTat: val.tenVietTat,
			};
		});

		setData(dataBieuDoRes);
		setDataBieuDo({
			'Xuất sắc': dataBieuDoRes?.map((item: Data) => item['Phân loại XS']),
			Tốt: dataBieuDoRes?.map((item: Data) => item['Phân loại Tốt']),
			Khá: dataBieuDoRes?.map((item: Data) => item['Phân loại Khá']),
			'Trung bình': dataBieuDoRes?.map((item: Data) => item['Phân loại Trung bình']),
			'Yếu/kém': dataBieuDoRes?.map((item: Data) => item['Phân loại Yếu/Kém']),
		});
		setLoading(false);
	};

	useEffect(() => {
		getData();
	}, [record?.kyHoc, props?.trinhDo, props?.hinhThuc]);

	const handleExportDuLieu = async (columnParam: any, dataParam: any, title: string) => {
		try {
			const payload = transformDataColumnsTableToJson(columnParam, dataParam, '');
			jsonToXlsx(payload, title);
		} catch (e) {
			console.log(e);
		}
	};

	const columnFinal: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'thongke.khoa' }),
			dataIndex: 'Khóa',
			width: 200,
			render: (val) => (
				<div style={{ fontWeight: val === intl.formatMessage({ id: 'thongke.tongcong' }) ? 'bold' : undefined }}>
					{val}
				</div>
			),
		},
		// {
		// 	title: 'Tổng số sinh viên',
		// 	width: 120,
		// 	align: 'center',
		// },
		{
			title: intl.formatMessage({ id: 'thongke.tongsv' }),
			width: 150,
			dataIndex: 'Tổng số sinh viên',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'thongke.chuadanhgia' }),
			width: 150,
			dataIndex: 'Chưa đánh giá',
			align: 'center',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
		{
			title: intl.formatMessage({ id: 'thongke.xuatsac' }),
			width: 150,
			dataIndex: 'Phân loại XS',
			align: 'center',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
		{
			title: intl.formatMessage({ id: 'thongke.tot' }),
			width: 150,
			dataIndex: 'Phân loại Tốt',
			align: 'center',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
		{
			title: intl.formatMessage({ id: 'thongke.kha' }),
			width: 150,
			dataIndex: 'Phân loại Khá',
			align: 'center',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
		{
			title: intl.formatMessage({ id: 'thongke.trungbinh' }),
			width: 150,
			dataIndex: 'Phân loại Trung bình',
			align: 'center',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
		{
			title: intl.formatMessage({ id: 'thongke.yeukem' }),
			width: 150,
			dataIndex: 'Phân loại Yếu/Kém',
			align: 'center',
			render: (val, rec) =>
				rec?.['Tổng số sinh viên'] ? (
					<div>
						{val} ({((val / rec['Tổng số sinh viên']) * 100).toFixed(2)}%)
					</div>
				) : (
					<div>{val}</div>
				),
		},
	];

	return (
		<Spin spinning={loading}>
			<Row gutter={[16, 0]}>
				<Col xl={18} lg={12} md={12} sm={24} xs={24}>
					<ColumnChart
						height={500}
						title=''
						yLabel={[
							intl.formatMessage({ id: 'thongke.xuatsac' }),
							intl.formatMessage({ id: 'thongke.tot' }),
							intl.formatMessage({ id: 'thongke.kha' }),
							intl.formatMessage({ id: 'thongke.trungbinh' }),
							intl.formatMessage({ id: 'thongke.yeukem' }),
						]}
						colors={['#1fba36', '#0d6efd', '#0dcaf0', '#ffca2c', '#dc3545']}
						xAxis={data?.map((item) => `${item.Khóa}`)}
						formatY={(val) => inputFormat(val ?? 0) + ''}
						yAxis={[
							dataBieuDo?.['Xuất sắc'],
							dataBieuDo?.['Tốt'],
							dataBieuDo?.['Khá'],
							dataBieuDo?.['Trung bình'],
							dataBieuDo?.['Yếu/kém'],
						]}
					/>
				</Col>
				<Col xl={6} lg={12} md={12} sm={24} xs={24}>
					<div style={{ height: 470, overflowY: 'scroll' }} className={styles.salesRank}>
						<ul className={styles.rankingList}>
							{data
								?.sort((a, b) => {
									return b['Tổng số sinh viên'] - a['Tổng số sinh viên'];
								})
								.map((item, i) => (
									<li key={item?.Khóa}>
										<span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>{i + 1}</span>
										<span className={styles.rankingItemTitle} title={item.Khóa}>
											{item.Khóa}
										</span>
										<span className={styles.rankingItemValue}>{numeral(item['Tổng số sinh viên']).format('0,0')}</span>
									</li>
								))}
						</ul>
					</div>
				</Col>
			</Row>
			<TableStaticData
				otherProps={{ pagination: false }}
				data={[
					...data,
					{
						Khóa: intl.formatMessage({ id: 'thongke.tongcong' }),
						'Phân loại Khá': data.reduce((pre, cur) => {
							return pre + (cur?.['Phân loại Khá'] ?? 0);
						}, 0),
						'Phân loại Trung bình': data.reduce((pre, cur) => {
							return pre + (cur?.['Phân loại Trung bình'] ?? 0);
						}, 0),
						'Phân loại Tốt': data.reduce((pre, cur) => {
							return pre + (cur?.['Phân loại Tốt'] ?? 0);
						}, 0),
						'Phân loại XS': data.reduce((pre, cur) => {
							return pre + (cur?.['Phân loại XS'] ?? 0);
						}, 0),
						'Chưa đánh giá': data.reduce((pre, cur) => {
							return pre + (cur?.['Chưa đánh giá'] ?? 0);
						}, 0),
						'Phân loại Yếu/Kém': data.reduce((pre, cur) => {
							return pre + (cur?.['Phân loại Yếu/Kém'] ?? 0);
						}, 0),
						'Tổng số sinh viên': data.reduce((pre, cur) => {
							return pre + (cur?.['Tổng số sinh viên'] ?? 0);
						}, 0),
					},
				]}
				columns={columnFinal}
			>
				<Button
					key={'export'}
					onClick={() =>
						handleExportDuLieu(
							columnFinal.filter((item) => item.title !== 'Thao tác'),
							data?.map((item) => {
								return {
									...item,
									['Chưa đánh giá']: `${item?.['Chưa đánh giá'] ?? 0} (${(
										((item?.['Chưa đánh giá'] ?? 0) / item?.['Tổng số sinh viên']) *
										100
									).toFixed(2)}%)`,
									['Phân loại XS']: `${item?.['Phân loại XS'] ?? 0} (${(
										((item?.['Phân loại XS'] ?? 0) / item?.['Tổng số sinh viên']) *
										100
									).toFixed(2)}%)`,
									['Phân loại Tốt']: `${item?.['Phân loại Tốt'] ?? 0} (${(
										((item?.['Phân loại Tốt'] ?? 0) / item?.['Tổng số sinh viên']) *
										100
									).toFixed(2)}%)`,
									['Phân loại Khá']: `${item?.['Phân loại Khá'] ?? 0} (${(
										((item?.['Phân loại Khá'] ?? 0) / item?.['Tổng số sinh viên']) *
										100
									).toFixed(2)}%)`,
									['Phân loại Trung bình']: `${item?.['Phân loại Trung bình'] ?? 0} (${(
										((item?.['Phân loại Trung bình'] ?? 0) / item?.['Tổng số sinh viên']) *
										100
									).toFixed(2)}%)`,
									['Phân loại Yếu/Kém']: `${item?.['Phân loại Yếu/Kém'] ?? 0} (${(
										((item?.['Phân loại Yếu/Kém'] ?? 0) / item?.['Tổng số sinh viên']) *
										100
									).toFixed(2)}%)`,
								};
							}),
							intl.formatMessage({ id: 'thongke.export.filename.khoa' }, { tenDot: record?.tenDot ?? '' }),
						)
					}
					icon={<ExportOutlined />}
					type='primary'
				>
					{intl.formatMessage({ id: 'global.button.xuatdulieu' })}
				</Button>
			</TableStaticData>
		</Spin>
	);
};

export default ThongKePhieuDiemTheoKhoaHoc;
