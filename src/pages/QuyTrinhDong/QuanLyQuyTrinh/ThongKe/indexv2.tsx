import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import { exportThongKeLuotGiaiQuyetDon, thongKeLuotGiaiQuyetDon } from '@/services/QuyTrinhDong/ThongKe/thongke';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const ThongKeDichVuHanhChinh = (props: { isTrangChu?: boolean }) => {
	const intl = useIntl();
	const [data, setData] = useState<any[]>([]);
	const { record: recHocKy, setRecord: setRecHocKy, danhSach } = useModel('daotaov2.hocky.hocky');
	const [loading, setLoading] = useState(false);
	const getData = async () => {
		setLoading(true);
		if (recHocKy?.ma) {
			const res = await thongKeLuotGiaiQuyetDon(recHocKy?.ma);
			setData(
				res?.data?.data?.length === 1
					? []
					: (res?.data?.data?.map((item: any) => ({
							...item,
							['Loại đơn']: item?.STT === 'Tổng cộng' ? item?.STT : item?.['Loại đơn'],
						})) ?? []),
			);
		}
		setLoading(false);
	};

	const handleExportData = async () => {
		if (!recHocKy?.ma) return;
		setLoading(true);
		const res = await exportThongKeLuotGiaiQuyetDon(recHocKy?.ma);
		fileDownload(res?.data, `Thống kê lượt giải quyết DVHC cho SV ${recHocKy.ten}.xlsx`);
		setLoading(false);
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const column: IColumn<any>[] = Object.keys(data?.[0] ?? {})
		?.filter((item) => item !== 'STT')
		?.map((item) => ({
			title: item,
			dataIndex: item,
			fixed: item === 'Tổng cộng' ? 'right' : undefined,
			width: item === 'Tổng cộng' ? 100 : 200,
			align: item === 'Loại đơn' ? 'left' : 'center',
		}));

	return (
		<Card title={intl.formatMessage({ id: 'dichvuhanhchinh.thongke.title' })}>
			<Row gutter={[8, 8]}>
				<Col span={24}>
					<SelectHocKy
						style={{ width: 300 }}
						value={recHocKy?._id}
						onChange={(val) => setRecHocKy(danhSach.find((item) => item._id === val))}
						isSetRecord
					/>
					<Button
						onClick={handleExportData}
						loading={loading}
						type='primary'
						icon={<ExportOutlined />}
						style={{ marginLeft: 8 }}
					>
						{intl.formatMessage({ id: 'global.button.xuatdulieu' })}
					</Button>
				</Col>
				<Col span={24}>
					<TableStaticData loading={loading} otherProps={{ pagination: false }} addStt columns={column} data={data} />
				</Col>
			</Row>
		</Card>
	);
};

export default ThongKeDichVuHanhChinh;
