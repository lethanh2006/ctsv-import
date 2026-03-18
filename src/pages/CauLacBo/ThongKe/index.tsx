import DonutChart from '@/components/Chart/DonutChart';
import TableStaticData from '@/components/Table/TableStaticData';
import { thongKeChung } from '@/services/CauLacBo';
import { ETrangThaiThanhVien } from '@/services/CauLacBo/constant';
import { thongKe } from '@/services/HoatDongChung';
import {
	EHoatDongChungType1,
	EHoatDongChungType2,
	MapKeyLabelTrangThaiThongKe,
} from '@/services/HoatDongChung/constants';
import { Card, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import SelectCLB from '../components/SelectCLB';
import { useModel } from 'umi';

const ThongKeCLB = () => {
	const [clb, setClb] = useState<string>();
	const { danhSach } = useModel('caulacbo.caulacbo');
	const [dataThongKe, setDataThongKe] = useState<any[]>([]);

	const getThongKe = async () => {
		const res = await thongKe({
			condition: {
				phanLoaiCap1: EHoatDongChungType1.VAN_HOA_THE_THAO,
				info: clb
					? {
							type: 'CAU_LAC_BO',
							refId: danhSach.find((item) => item.ten === clb)?._id,
					  }
					: undefined,
			},
		});
		setDataThongKe(res?.data?.data ?? []);
	};

	const [dataThongKeThanhVien, setDataThongKeThanhVien] = useState<
		{
			cauLacBo: string;
			thanhVien: {
				[ETrangThaiThanhVien.DANG_HOAT_DONG]: number;
				[ETrangThaiThanhVien.NGUNG_HOAT_DONG]: number;
			};
		}[]
	>([]);
	const [dataThongKeHoatDong, setDataThongKeHoatDong] = useState<
		{
			cauLacBo: string;
			dangDienRa: number;
			daDienRa: number;
			chuaDienRa: number;
		}[]
	>([]);
	const getThongKeThanhVien = async () => {
		const res = await thongKeChung();
		setDataThongKeThanhVien(res?.data?.data ?? []);
	};

	const getHoatDongTheoCLB = async () => {
		const data = await Promise.all(
			danhSach.map(async (item) =>
				thongKe({
					condition: {
						phanLoaiCap1: EHoatDongChungType1.VAN_HOA_THE_THAO,
						info: {
							type: 'CAU_LAC_BO',
							refId: item._id,
						},
					},
				}),
			),
		);
		setDataThongKeHoatDong(
			danhSach.map((item, index) => {
				const tk = data[index]?.data?.data?.[0] ?? {};
				return {
					cauLacBo: item.ten,
					...tk,
				};
			}),
		);
	};

	useEffect(() => {
		getThongKeThanhVien();
	}, []);
	useEffect(() => {
		getHoatDongTheoCLB();
	}, [danhSach.length]);

	useEffect(() => {
		getThongKe();
	}, [clb]);

	const dataHoatDong = dataThongKe?.find((item) => item?.phanLoaiCap2 === EHoatDongChungType2.HOAT_DONG_CAU_LAC_BO);
	const dataThanhVien = dataThongKeThanhVien.map((item) => ({
		ten: item.cauLacBo,
		value: item.thanhVien
			? item?.thanhVien?.[ETrangThaiThanhVien.DANG_HOAT_DONG] ??
			  0 + item?.thanhVien?.[ETrangThaiThanhVien.NGUNG_HOAT_DONG] ??
			  0
			: 0,
	}));

	return (
		<Card title='Thống kê'>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<SelectCLB allowClear onChange={(val) => setClb(val)} keyValue='ten' style={{ width: 250 }} />
				</Col>
				{/* <Col span={12}>
					<DonutChart
						showTotal
						formatY={(val) => `${val} hoạt động`}
						height={250}
						yLabel={['Hoạt động']}
						xAxis={Object.values(MapKeyLabelTrangThaiThongKe)}
						yAxis={[[dataHoatDong?.chuaDienRa ?? 0, dataHoatDong?.dangDienRa ?? 0, dataHoatDong?.daDienRa ?? 0]]}
					/>
				</Col> */}
				<Col span={24}>
					<DonutChart
						formatY={(val) => `${val} thành viên`}
						height={250}
						showTotal
						yLabel={['Thành viên đang hoạt động', 'Thành viên ngừng hoạt động']}
						xAxis={clb ? Object.values(ETrangThaiThanhVien) : dataThongKeThanhVien.map((item) => item.cauLacBo)}
						yAxis={[
							clb
								? Object.values(dataThongKeThanhVien?.find((item) => item.cauLacBo === clb)?.thanhVien ?? 0)
								: dataThanhVien.map((item) => item.value),
						]}
					/>
				</Col>
				<Col span={24}>
					<TableStaticData
						otherProps={{ size: 'small' }}
						data={clb ? dataThongKeThanhVien.filter((item) => item.cauLacBo === clb) : dataThongKeThanhVien}
						addStt
						columns={[
							{
								title: 'Tên câu lạc bộ',
								dataIndex: 'cauLacBo',
								width: 200,
							},
							{
								title: 'Thành viên',
								width: 200,
								children: [
									{
										title: ETrangThaiThanhVien.DANG_HOAT_DONG,
										width: 100,
										align: 'center',
										render: (rec) => rec?.thanhVien?.[ETrangThaiThanhVien.DANG_HOAT_DONG] ?? 0,
									},
									{
										title: ETrangThaiThanhVien.NGUNG_HOAT_DONG,
										width: 100,
										align: 'center',
										render: (rec) => rec?.thanhVien?.[ETrangThaiThanhVien.NGUNG_HOAT_DONG] ?? 0,
									},
								],
							},
							{
								title: 'Hoạt động',
								width: 200,
								children: Object.keys(MapKeyLabelTrangThaiThongKe).map((item) => {
									return {
										title: MapKeyLabelTrangThaiThongKe[item],
										width: 100,
										align: 'center',
										render: (rec) => {
											const data: any = dataThongKeHoatDong?.find((ele) => ele.cauLacBo === rec.cauLacBo);
											return data?.[item] ?? 0;
										},
									};
								}),
							},
						]}
					/>
				</Col>
			</Row>
		</Card>
	);
};

export default ThongKeCLB;
