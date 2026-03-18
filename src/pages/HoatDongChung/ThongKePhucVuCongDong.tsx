import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { thongKeChungV2 } from '@/services/HoatDongChung';
import { EHoatDongChungType1, MapKeyNameHoatDongPhucVuCongDong } from '@/services/HoatDongChung/constants';
import { jsonToXlsx, transformDataColumnsTableToJson } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectHocKy from '../HocKy/components/SelectHocKy';

const ThongKePhucVuCongDong = () => {
	const intl = useIntl();
	const [data, setData] = useState<
		{
			donViThuocHocVien: string[];
			linhVuc: string;
			soCbGvThamGia: number;
			soSvThamGia: number;
			tiepCan: number;
		}[]
	>([]);
	const { record: recHocKy, setRecord: setRecHocKy, danhSach } = useModel('daotaov2.hocky.hocky');

	const getData = async () => {
		if (recHocKy?.ma) {
			const res = await thongKeChungV2({
				condition: { phanLoaiCap1: EHoatDongChungType1.PHUC_VU_CONG_DONG, maHocKy: recHocKy?.ma },
			});
			setData(
				res?.data?.data?.map((item: any) => ({
					...item,
					linhVuc: MapKeyNameHoatDongPhucVuCongDong?.[item.linhVuc] ?? item.linhVuc,
				})) ?? [],
			);
		}
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const columns: IColumn<{
		donViThuocHocVien: string[];
		linhVuc: string;
		soCbGvThamGia: number;
		soSvThamGia: number;
		tiepCan: number;
	}>[] = [
		{
			title: intl.formatMessage({ id: 'phucvucongdong.thongke.column.linhvuc' }),
			dataIndex: 'linhVuc',
			width: 200,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'phucvucongdong.thongke.column.donvitugoc' }),
			dataIndex: 'donViThuocHocVien',
			width: 200,
			align: 'center',
			render: (val: string[]) => <div>{val.length}</div>,
		},
		{
			title: intl.formatMessage({ id: 'phucvucongdong.thongke.column.socbgvthamgia' }),
			dataIndex: 'soCbGvThamGia',
			align: 'center',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'phucvucongdong.thongke.column.sosvthamgia' }),
			dataIndex: 'soSvThamGia',
			align: 'center',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'phucvucongdong.thongke.column.tiepcan' }),
			dataIndex: 'tiepCan',
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
		<Card title={intl.formatMessage({ id: 'phucvucongdong.thongke.title' })}>
			<Row>
				<Col span={24}>
					<div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
						<SelectHocKy
							style={{ width: 300, marginRight: 8 }}
							value={recHocKy?._id}
							onChange={(val) => setRecHocKy(danhSach.find((item) => item._id === val))}
							isSetRecord
						/>
						<Button
							onClick={() =>
								handleExportDuLieu(
									columns,
									data.map((item) => ({ ...item, donViThuocHocVien: item.donViThuocHocVien.length })),
									intl.formatMessage({ id: 'phucvucongdong.thongke.title' }),
								)
							}
							icon={<ExportOutlined />}
							type='primary'
						>
							{intl.formatMessage({ id: 'phucvucongdong.thongke.export' })}
						</Button>
					</div>
				</Col>
				<Col span={24}>
					<TableStaticData
						addStt
						otherProps={
							{
								summary: (pageData: any[]) => {
									let donViThuocHocVien = 0;
									let soCbGvThamGia = 0;
									let soSvThamGia = 0;
									let tiepCan = 0;
									pageData.map((item) => {
										donViThuocHocVien += item?.donViThuocHocVien?.length ?? 0;
										soCbGvThamGia += item?.soCbGvThamGia ?? 0;
										soSvThamGia += item?.soSvThamGia ?? 0;
										tiepCan += item?.tiepCan;
									});
									return (
										<Table.Summary.Row style={{ textAlign: 'center', fontWeight: 'bold' }}>
											<Table.Summary.Cell index={0} />
											<Table.Summary.Cell index={1}>
												{intl.formatMessage({ id: 'phucvucongdong.thongke.tongso' })}
											</Table.Summary.Cell>
											<Table.Summary.Cell index={2}>{donViThuocHocVien}</Table.Summary.Cell>
											<Table.Summary.Cell index={3}>{soCbGvThamGia}</Table.Summary.Cell>
											<Table.Summary.Cell index={4}>{soSvThamGia}</Table.Summary.Cell>
											<Table.Summary.Cell index={5}>{tiepCan}</Table.Summary.Cell>
										</Table.Summary.Row>
									);
								},
							} as any
						}
						columns={columns}
						data={data}
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default ThongKePhucVuCongDong;
