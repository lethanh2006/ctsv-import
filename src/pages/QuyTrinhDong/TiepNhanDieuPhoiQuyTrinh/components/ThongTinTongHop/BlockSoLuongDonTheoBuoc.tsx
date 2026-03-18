import ColumnChart from '@/components/Chart/ColumnChart';
import { inputFormat } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
// import vi from '@/components/Chart/vi.json';
import { MapColorTrangThaiTiepNhanDon, TrangThaiTiepNhanDon } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/constants';
import { thongKeDonTheoBuoc } from '@/services/QuyTrinhDong/ThongKe/thongke';

const BlockSoLuongDonTheoBuoc = () => {
	const { quyTrinhSelect } = useModel('quytrinh.khaibaoquytrinh');

	const [data, setData] = useState<{ name: string; data: number[] }[]>([]);

	const getData = async () => {
		if (quyTrinhSelect?._id) {
			const res = await thongKeDonTheoBuoc(quyTrinhSelect?._id);
			const dataTemp: { name: string; data: number[] }[] = [];
			Object.values(TrangThaiTiepNhanDon).map((item) => {
				dataTemp.push({
					name: item,
					data: quyTrinhSelect?.danhSachBuocXuLy?.map((buoc) => {
						return (
							res?.data?.data
								?.find((ele: { _id: string }) => ele._id === buoc.ma)
								?.danhSachTrangThai?.find((ele2: { trangThai: TrangThaiTiepNhanDon }) => ele2.trangThai === item)
								?.soLuong ?? 0
						);
					}),
				});
			});
			setData(dataTemp);
		}
	};

	useEffect(() => {
		getData();
	}, [quyTrinhSelect?._id]);

	return (
		<ColumnChart
			otherOptions={{
				chart: {
					defaultLocale: 'vi',
					// locales: [vi],
					stacked: true,
					toolbar: {
						show: true,
					},

					zoom: {
						enabled: true,
						type: 'x',
						autoScaleYaxis: false,
						zoomedArea: {
							fill: {
								color: '#90CAF9',
								opacity: 0.4,
							},
							stroke: {
								color: '#0D47A1',
								opacity: 0.4,
								width: 1,
							},
						},
					},
				},
				responsive: [
					{
						breakpoint: 1200, //xxl
						options: {
							legend: { horizontalAlign: 'center', position: 'bottom' },
							plotOptions: {
								bar: {
									columnWidth: '100%',
								},
							},
						},
					},
				],
				plotOptions: {
					bar: {
						horizontal: false,
						borderRadius: 10,
						dataLabels: {
							position: 'center',
							maxItems: 100,
							total: {
								enabled: true,
								style: {
									fontSize: '13px',
									fontWeight: 900,
								},
							},
						},
					},
				},
				dataLabels: {
					enabled: true,
					style: {
						fontWeight: 900,
					},
				},
				legend: {
					position: 'right',
					offsetY: 40,
				},
				fill: {
					opacity: 1,
				},
			}}
			height={350}
			title=''
			yLabel={Object.values(TrangThaiTiepNhanDon)}
			colors={Object.values(TrangThaiTiepNhanDon).map((item) => MapColorTrangThaiTiepNhanDon[item])}
			xAxis={quyTrinhSelect?.danhSachBuocXuLy?.map((item) => item.ten) ?? []}
			formatY={(val) => inputFormat(val ?? 0) + ''}
			yAxis={data?.map((item) => item.data)}
		/>
	);
};

export default BlockSoLuongDonTheoBuoc;
