import { EOperatorType } from '@/components/Table/constant';
import { getDataThongKeJson as getDataThongKeJsonCheDoChinhSach } from '@/services/CheDoSinhVien/index';
import { getDataThongKeJson as getDataThongKeJsonQuyTrinhDong } from '@/services/QuyTrinhDong/ThongKe/thongke';

import { ELoaiBoLoc } from '@/services/CheDoSinhVien/constant';
import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Input, Select, Spin, Tabs, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ViewColumnThongKe from './ViewColumn';
import ViewDonutThongKe from './ViewDonut';
import ViewTableThongKe from './ViewTable';

const ViewThongKe = (props: { idThongKe: string; type: 'CheDoChinhSach' | 'QuyTrinhDong' }) => {
	const intl = useIntl();
	const { danhSach }: any = useModel(props.type === 'CheDoChinhSach' ? 'chedochinhsach.thongke' : 'quytrinh.thongke');
	const getDataThongKeJson =
		props.type === 'CheDoChinhSach' ? getDataThongKeJsonCheDoChinhSach : getDataThongKeJsonQuyTrinhDong;
	const [filters, setFilters] = useState<any[]>([]);

	const { danhSach: danhSachDanhMuc, getAllModel: getAllDanhMuc } = useModel('quytrinh.danhmuc');

	const recordThongKe = danhSach.find((item: { _id: string }) => item._id === props.idThongKe);
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const getData = async () => {
		if (!props.idThongKe || !danhSach.map((item: { _id: any }) => item._id).includes(props.idThongKe)) return;
		setLoading(true);
		const res = await getDataThongKeJson(props.idThongKe, { filters: filters });
		setData(res?.data?.data?.data ?? []);
		setLoading(false);
	};

	useEffect(() => {
		getData();
	}, [props.idThongKe, filters]);

	useEffect(() => {
		getAllDanhMuc(false, undefined, { maModule: ELoaiDanhMucChung.CHE_DO_CHINH_SACH });
	}, []);

	return (
		<Spin spinning={loading}>
			<Tabs
				tabBarExtraContent={
					<>
						{/* {recordThongKe?.danhSachFilterThongKe?.find(
							(item: { loaiFilterThongKe: ELoaiFilterThongKe }) => item.loaiFilterThongKe === ELoaiFilterThongKe.DOT,
						)?.tenThongKe && (
							<SelectDotKhaiBao
								multiple
								style={{ width: 500, marginRight: 8 }}
								placeholder='Lọc theo đợt'
								allowClear
								idQuyTrinh={recordQuyTrinh?._id ?? ''}
								onChange={(val: any) => {
									const filter: any = filters.filter((item: any) => item.field !== 'dotQuyTrinhId');
									setFilters(
										val.length
											? [...filter, { field: 'dotQuyTrinhId', values: val, operator: EOperatorType.INCLUDE }]
											: filter,
									);
								}}
							/>
						)} */}
						<div style={{ display: 'flex', alignItems: 'center' }}>
							{/* {recordThongKe?.danhSachFilterThongKe
								?.filter(
									(item: { loaiFilterThongKe: ELoaiFilterThongKe }) =>
										item.loaiFilterThongKe === ELoaiFilterThongKe.TRUONG_THONG_TIN,
								)
								?.map((item: { truongThongTinThongKe: any; tenThongKe: Key | null | undefined }) => (
									<Input.Search
										onSearch={(val) => {
											const filter: any = filters.filter((fil: any) => fil.field !== item.truongThongTinThongKe);
											setFilters(
												val.length
													? [
															...filter,
															{ field: item.truongThongTinThongKe, values: [val], operator: EOperatorType.CONTAIN },
													  ]
													: filter,
											);
										}}
										placeholder={`Lọc theo ${item.tenThongKe}`}
										key={item.tenThongKe}
									/>
								))} */}
							{recordThongKe?.danhSachFilterThongKe?.map(
								(item: {
									tenThongKe: any;
									loai: ELoaiBoLoc;
									truongThongTinThongKe: any;
									danhSachGiaTri: any[];
									maDanhMuc: any;
									maModule: any;
								}) => (
									<>
										{item.loai === ELoaiBoLoc.GIA_TRI ? (
											<Input.Search placeholder={item.tenThongKe} />
										) : (
											<Select
												mode='multiple'
												onChange={(val) => {
													if (!val?.length) {
														setFilters(filters?.filter((ft) => ft.field !== item.truongThongTinThongKe) ?? []);
													} else
														setFilters([
															...(filters?.filter((ft) => ft.field !== item.truongThongTinThongKe) ?? []),
															{
																field: item.truongThongTinThongKe,
																active: true,
																values: val,
																operator: EOperatorType.INCLUDE,
															},
														] as any);
												}}
												style={{ width: 250, marginLeft: 8 }}
												allowClear
												placeholder={`Lọc theo ${item.tenThongKe}`}
												options={
													item.loai === ELoaiBoLoc.MANG
														? item.danhSachGiaTri.map((gt) => ({ value: gt, label: gt }))
														: danhSachDanhMuc
																.find((dm) => dm.maDanhMuc === item.maDanhMuc && dm.maModule === item.maModule)
																?.danhSachGiaTri.map((gt) => ({ value: gt?.value, label: gt?.value }))
												}
											/>
										)}
									</>
								),
							)}
							<Tooltip title={intl.formatMessage({ id: 'chedochinhsach.thongke.lammoi' })}>
								<Button loading={loading} onClick={getData} size='small' type='link' icon={<ReloadOutlined />} />
							</Tooltip>
						</div>
					</>
				}
				style={{ marginTop: -8 }}
			>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'chedochinhsach.thongke.bang' })} key={'table'} tabKey='table'>
					<ViewTableThongKe data={data} />
				</Tabs.TabPane>
				{data.length && Object.keys(data?.[0])?.length === 2 && (
					<Tabs.TabPane
						tab={intl.formatMessage({ id: 'chedochinhsach.thongke.biendotron' })}
						key={'donut'}
						tabKey='donut'
					>
						<ViewDonutThongKe data={data} />
					</Tabs.TabPane>
				)}
				{data.length && Object.keys(data?.[0])?.length === 2 && (
					<Tabs.TabPane
						tab={intl.formatMessage({ id: 'chedochinhsach.thongke.biendocot' })}
						key={'column'}
						tabKey='column'
					>
						<ViewColumnThongKe data={data} />
					</Tabs.TabPane>
				)}
			</Tabs>
		</Spin>
	);
};

export default ViewThongKe;
