import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { thongKeSinhVienHoatDong, thongKeSinhVienHoatDongCap2 } from '@/services/HoatDongChung';
import { EHoatDongChungType1, EHoatDongChungType2 } from '@/services/HoatDongChung/constants';
import { jsonToXlsx, transformDataColumnsTableToJson } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectHocKy from '../HocKy/components/SelectHocKy';

const ThongKeGiaoDucChinhTriTuTuong = () => {
	const intl = useIntl();
	const [data, setData] = useState<any[]>([]);
	const [data2, setData2] = useState<any[]>([]);
	const { record: recHocKy, setRecord: setRecHocKy, danhSach } = useModel('daotaov2.hocky.hocky');
	const getData = async () => {
		const res = await thongKeSinhVienHoatDong({
			condition: {
				phanLoaiCap1: EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG,
				phanLoaiCap2: EHoatDongChungType2.HUONG_NGHIEP_VIEC_LAM,
				maHocKy: recHocKy?.ma,
			},
		});
		setData(res?.data?.data ?? []);
	};
	const getData2 = async () => {
		const res = await thongKeSinhVienHoatDongCap2({
			condition: {
				phanLoaiCap1: EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG,
				phanLoaiCap2: {
					$in: [
						EHoatDongChungType2.TUAN_LE_CONG_DAN,
						EHoatDongChungType2.HOAT_DONG_HUY_DONG_GIAO_DUC_TU_TUONG_CHINH_TRI,
					],
				},
				maHocKy: recHocKy?.ma,
			},
		});
		setData2(res?.data?.data ?? []);
	};

	useEffect(() => {
		getData();
		getData2();
	}, [recHocKy?._id]);

	const column2: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'hoatdongchung.thongke.export.column.nganh' }),
			dataIndex: 'nganh',
			align: 'center',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'hoatdongchung.thongke.export.column.svthuoc' }),
			width: 400,
			align: 'center',
			dataIndex: 'Giáo dục chính trị tư tưởng|Tuần sinh hoạt công dân|total',
		},
		{
			title: intl.formatMessage({ id: 'hoatdongchung.thongke.export.column.svthamgia' }),
			width: 400,
			align: 'center',
			dataIndex: 'Giáo dục chính trị tư tưởng|Tuần sinh hoạt công dân|attended',
		},
		{
			title: intl.formatMessage({ id: 'hoatdongchung.thongke.export.column.hdsvthuoc' }),
			width: 400,
			align: 'center',
			dataIndex: 'Giáo dục chính trị tư tưởng|Hoạt động huy động giáo dục tư tưởng chính trị|total',
		},
		{
			title: intl.formatMessage({ id: 'hoatdongchung.thongke.export.column.hdsvthamgia' }),
			width: 400,
			align: 'center',
			dataIndex: 'Giáo dục chính trị tư tưởng|Hoạt động huy động giáo dục tư tưởng chính trị|attended',
		},
	];

	const columns: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqtochuc.nganh' }),
			dataIndex: 'nganh',
			align: 'center',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqtochuc.tongsv' }),
			dataIndex: 'tongSoSinhVien',
			align: 'center',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqtochuc.svthamgiangayhoi' }),
			dataIndex: 'Ngày hội việc làm',
			align: 'center',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqtochuc.svthamgiahoithao' }),
			dataIndex: 'Hội thảo, nói chuyện chuyên đề về việc làm',
			align: 'center',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqtochuc.svdaotao' }),
			dataIndex: 'Đào tạo kỹ năng mềm',
			align: 'center',
			width: 200,
		},
	];

	const handleExportDuLieu = async (columnParam: any, dataParam: any, title: string) => {
		try {
			const payload = transformDataColumnsTableToJson(columnParam, dataParam, 0);
			jsonToXlsx(payload, title);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<Card>
			<Row gutter={[16, 8]}>
				<Col span={24}>
					<SelectHocKy
						style={{ width: 300, marginBottom: 8 }}
						value={recHocKy?._id}
						onChange={(val) => setRecHocKy(danhSach.find((item) => item._id === val))}
						isSetRecord
					/>
				</Col>
				<Col span={24}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<b>{intl.formatMessage({ id: 'hoatdongchung.thongke.kqthuchien' })}</b>
						<Button
							onClick={() =>
								handleExportDuLieu(column2, data2, intl.formatMessage({ id: 'hoatdongchung.thongke.kqthuchien' }))
							}
							icon={<ExportOutlined />}
							type='primary'
						>
							{intl.formatMessage({ id: 'hoatdongchung.thongke.export' })}
						</Button>
					</div>
				</Col>

				<Col span={24}>
					<TableStaticData
						otherProps={
							{
								pagination: false,
								summary: (pageData: any[]) => {
									let shcdPhaiHoc = 0;
									let shcdThamgia = 0;
									let gdctttPhaiHoc = 0;
									let gdctttThamGia = 0;
									pageData.map((item) => {
										shcdPhaiHoc += item?.['Giáo dục chính trị tư tưởng|Tuần sinh hoạt công dân|total'] ?? 0;
										shcdThamgia += item?.['Giáo dục chính trị tư tưởng|Tuần sinh hoạt công dân|attended'] ?? 0;
										gdctttPhaiHoc +=
											item?.['Giáo dục chính trị tư tưởng|Hoạt động huy động giáo dục tư tưởng chính trị|total'] ?? 0;
										gdctttThamGia +=
											item?.['Giáo dục chính trị tư tưởng|Hoạt động huy động giáo dục tư tưởng chính trị|attended'] ??
											0;
									});
									return (
										<Table.Summary.Row style={{ textAlign: 'center', fontWeight: 'bold' }}>
											<Table.Summary.Cell index={0} />
											<Table.Summary.Cell index={1}>
												{intl.formatMessage({ id: 'hoatdongchung.thongke.tongso' })}
											</Table.Summary.Cell>
											<Table.Summary.Cell index={2}>{shcdPhaiHoc}</Table.Summary.Cell>
											<Table.Summary.Cell index={3}>{shcdThamgia}</Table.Summary.Cell>
											<Table.Summary.Cell index={4}>{gdctttPhaiHoc}</Table.Summary.Cell>
											<Table.Summary.Cell index={5}>{gdctttThamGia}</Table.Summary.Cell>
										</Table.Summary.Row>
									);
								},
							} as any
						}
						addStt
						columns={[
							{
								title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqthuchien.column.nganh' }),
								dataIndex: 'nganh',
								align: 'center',
								width: 200,
							},
							{
								title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqthuchien.column.tuansh' }),
								width: 400,
								align: 'center',
								children: [
									{
										title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqthuchien.column.tuansh.svthuoc' }),
										dataIndex: 'Giáo dục chính trị tư tưởng|Tuần sinh hoạt công dân|total',
										width: 200,
										align: 'center',
										render: (val) => val || 0,
									},
									{
										title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqthuchien.column.tuansh.svthamgia' }),
										dataIndex: 'Giáo dục chính trị tư tưởng|Tuần sinh hoạt công dân|attended',
										width: 200,
										align: 'center',
									},
								],
							},
							{
								title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqthuchien.column.hd' }),
								width: 400,
								align: 'center',
								children: [
									{
										title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqthuchien.column.hd.svthuoc' }),
										dataIndex: 'Giáo dục chính trị tư tưởng|Hoạt động huy động giáo dục tư tưởng chính trị|total',
										width: 200,
										align: 'center',
										render: (val) => val || 0,
									},
									{
										title: intl.formatMessage({ id: 'hoatdongchung.thongke.kqthuchien.column.hd.svthamgia' }),
										dataIndex: 'Giáo dục chính trị tư tưởng|Hoạt động huy động giáo dục tư tưởng chính trị|attended',
										width: 200,
										align: 'center',
										render: (val) => val || 0,
									},
								],
							},
						]}
						data={data2}
					/>
				</Col>
				<Col span={24}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<b>{intl.formatMessage({ id: 'hoatdongchung.thongke.kqtochuc' })}</b>

						<Button
							onClick={() =>
								handleExportDuLieu(columns, data, intl.formatMessage({ id: 'hoatdongchung.thongke.kqtochuc' }))
							}
							icon={<ExportOutlined />}
							type='primary'
						>
							{intl.formatMessage({ id: 'hoatdongchung.thongke.export' })}
						</Button>
					</div>
				</Col>
				<Col span={24}>
					<TableStaticData
						otherProps={
							{
								pagination: false,
								summary: (pageData: any[]) => {
									let tongSoSinhVien = 0;
									let ngayHoiViecLam = 0;
									let hoiThaoViecLam = 0;
									let kyNangMem = 0;
									pageData.map((item) => {
										tongSoSinhVien += item?.tongSoSinhVien ?? 0;
										ngayHoiViecLam += item?.['Ngày hội việc làm'] ?? 0;
										hoiThaoViecLam += item?.['Hội thảo, nói chuyện chuyên đề về việc làm'] ?? 0;
										kyNangMem += item?.['Đào tạo kỹ năng mềm'] ?? 0;
									});
									return (
										<Table.Summary.Row style={{ textAlign: 'center', fontWeight: 'bold' }}>
											<Table.Summary.Cell index={0} />
											<Table.Summary.Cell index={1}>
												{intl.formatMessage({ id: 'hoatdongchung.thongke.tongso' })}
											</Table.Summary.Cell>
											<Table.Summary.Cell index={2}>{tongSoSinhVien}</Table.Summary.Cell>
											<Table.Summary.Cell index={3}>{ngayHoiViecLam}</Table.Summary.Cell>
											<Table.Summary.Cell index={4}>{hoiThaoViecLam}</Table.Summary.Cell>
											<Table.Summary.Cell index={5}>{kyNangMem}</Table.Summary.Cell>
										</Table.Summary.Row>
									);
								},
							} as any
						}
						addStt
						columns={columns}
						data={data}
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default ThongKeGiaoDucChinhTriTuTuong;
