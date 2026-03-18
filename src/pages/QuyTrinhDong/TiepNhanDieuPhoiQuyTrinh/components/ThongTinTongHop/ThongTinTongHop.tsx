import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';

import { chiTietDonQuaHan, thongKeDon, thongKeDonQuaHan } from '@/services/QuyTrinhDong/ThongKe/thongke';
import { Button, Card, Col, Modal, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl, useModel } from 'umi';
import BlockSoLuongDon from './BlockSoLuongDon';
import BlockSoLuongDonTheoBuoc from './BlockSoLuongDonTheoBuoc';
import DanhSachQuyTrinh from './DanhSachQuyTrinh';

export interface DataSoLuongDon {
	_id: string;
	sum: number;
}
interface IProps {
	type: 'dieu_phoi' | 'tiep_nhan';
	children?: any;
}

const ThongTinTongHop = (props: IProps) => {
	const intl = useIntl();
	const { type } = props;
	const { quyTrinhSelect, maBuoc } = useModel('quytrinh.khaibaoquytrinh');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('25%');
	const [donHomNay, setDonHomNay] = useState<DataSoLuongDon[]>();
	const [donTuanNay, setDonTuanNay] = useState<DataSoLuongDon[]>();
	const [donThangNay, setDonThangNay] = useState<DataSoLuongDon[]>();
	const [tongSoDon, setTongSoDon] = useState<DataSoLuongDon[]>();
	const [typeBuoc, setTypeBuoc] = useState<'BUOC_HIEN_TAI' | 'BUOC_BAT_KY'>('BUOC_HIEN_TAI');
	const [dataQuaHan, setDataQuaHan] = useState<any>();
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);
	const [dataChiTiet, setDataChiTiet] = useState<any>();
	const [loadingData, setLoadingData] = useState<boolean>(false);
	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const getDonHomNay = async (mode: 'day' | 'week' | 'month', quyTrinhId?: string) => {
		const res = await thongKeDon(type, {
			startDate: dayjs().startOf(mode).toISOString(),
			endDate: dayjs().endOf(mode).toISOString(),
			quyTrinhId,
		});
		if (res) {
			if (mode === 'day') setDonHomNay(res?.data?.data);
			if (mode === 'week') setDonTuanNay(res?.data?.data);
			if (mode === 'month') setDonThangNay(res?.data?.data);
		}
	};
	const getDataChiTiet = async (quyTrinhId: string) => {
		try {
			const res = await chiTietDonQuaHan(type, quyTrinhId);
			if (res) {
				setDataChiTiet(res?.data?.data ?? []);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const onCell = (record: any) => ({
		onClick: () => {
			if (typeBuoc === 'BUOC_BAT_KY') {
				getDataChiTiet(record?._id);
				setVisibleChiTiet(true);
			}
		},
		style: { cursor: 'pointer' },
	});
	const getTongSoDon = async (quyTrinhId?: string) => {
		try {
			setLoadingData(true);
			const res = await thongKeDon(type, { quyTrinhId: quyTrinhId });
			if (res) {
				setTongSoDon(res?.data?.data);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingData(false);
		}
	};
	const getTongSoDonQuaHan = async (kieuBuoc: 'BUOC_HIEN_TAI' | 'BUOC_BAT_KY') => {
		const res = await thongKeDonQuaHan(type, kieuBuoc);
		if (res) {
			setDataQuaHan(res?.data?.data ?? []);
		}
	};
	useEffect(() => {
		if (quyTrinhSelect?._id) {
			getTongSoDon(quyTrinhSelect?._id);
			getDonHomNay('day', quyTrinhSelect?._id);
			getDonHomNay('week', quyTrinhSelect?._id);
			getDonHomNay('month', quyTrinhSelect?._id);
		}
	}, [quyTrinhSelect]);

	useEffect(() => {
		getTongSoDonQuaHan(typeBuoc);
	}, [typeBuoc]);

	const columns: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.ten' }),
			dataIndex: 'ten',
			width: 150,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.sl' }),
			dataIndex: typeBuoc === 'BUOC_HIEN_TAI' ? 'daTiepNhan' : 'buocDaTiepNhan',
			width: 80,
			align: 'center',
			// filterType: 'string',v
			onCell,
			render: (val, recordVal) => {
				return (
					<>
						{val}/
						{typeBuoc === 'BUOC_HIEN_TAI'
							? +recordVal?.chuaTiepNhan + +recordVal?.daTiepNhan
							: +recordVal?.buocChuaTiepNhan + +recordVal?.buocDaTiepNhan}
					</>
				);
			},
		},
		// {
		// 	title: 'Số bước chưa tiếp nhận',
		// 	dataIndex: 'quyTrinh',
		// 	width: 80,
		// 	// filterType: 'string',
		// 	render: (val, recordVal) => {
		// 		return recordVal?.quyTrinh?.ten;
		// 	},
		// },
		// {
		// 	title: 'Thao tác',
		// 	align: 'center',
		// 	width: 50,
		// 	fixed: 'right',
		// 	render: (recordVal: any) => (
		// 		<>
		// 			<Tooltip title='Xem chi tiết'>
		// 				<Button
		// 					onClick={() => {
		// 						// history.push(`/quan-ly-khoa-hoc/khai-bao-quy-trinh/${recordVal?._id}`);
		// 					}}
		// 					type='link'
		// 					icon={<EyeOutlined />}
		// 				/>
		// 			</Tooltip>
		// 			{/*<Tooltip title='Xóa'>*/}
		// 			{/*	<Popconfirm*/}
		// 			{/*		// onConfirm={() => deleteModel(recordVal._id ?? '', getModel)}*/}
		// 			{/*		title='Bạn có chắc chắn muốn xóa?'*/}
		// 			{/*		placement='topLeft'*/}
		// 			{/*	>*/}
		// 			{/*		<Button danger type='link' icon={<DeleteOutlined />} />*/}
		// 			{/*	</Popconfirm>*/}
		// 			{/*</Tooltip>*/}
		// 		</>
		// 	),
		// },
	];
	const columnsBuoc: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.buoc' }),
			dataIndex: 'tenBuoc',
			align: 'center',
			width: 150,
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.datiepnhan' }),
			dataIndex: 'daTiepNhan',
			width: 80,
			align: 'center',
			// filterType: 'string',v
			// render: (val, recordVal) => {
			// 	return (
			// 		<>
			// 			{val}/{+recordVal?.chuaTiepNhan + +recordVal?.daTiepNhan}
			// 		</>
			// 	);
			// },
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.chuatiepnhan' }),
			dataIndex: 'chuaTiepNhan',
			width: 80,
			align: 'center',
			// filterType: 'string',v
			// render: (val, recordVal) => {
			//   return (
			//     <>
			//       {val}/{+recordVal?.chuaTiepNhan + +recordVal?.daTiepNhan}
			//     </>
			//   );
			// },
		},
	];

	return (
		<>
			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='10%'>
					<Card title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.dsdichvu.title' })}>
						<DanhSachQuyTrinh type={type} />
					</Card>
				</Pane>
				<Pane minSize='30%'>
					<Card title={quyTrinhSelect?.ten}>
						<Spin spinning={loadingData}>
							<Row gutter={[20, 20]}>
								{!maBuoc && (
									<>
										<Col span={24}>
											<Row gutter={[12, 12]}>
												<Col xs={24} md={12} lg={12} xl={6} xxl={6}>
													<BlockSoLuongDon
														title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.tongdon' })}
														data={tongSoDon || []}
													/>
												</Col>
												<Col xs={24} md={12} lg={12} xl={6} xxl={6}>
													<BlockSoLuongDon
														title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.tongdonhomnay' })}
														data={donHomNay || []}
													/>
												</Col>
												<Col xs={24} md={12} lg={12} xl={6} xxl={6}>
													<BlockSoLuongDon
														title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.tongdontuannay' })}
														data={donTuanNay || []}
													/>
												</Col>
												<Col xs={24} md={12} lg={12} xl={6} xxl={6}>
													<BlockSoLuongDon
														title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.tongdonthangnay' })}
														data={donThangNay || []}
													/>
												</Col>
											</Row>
										</Col>
										{/* <Col xs={24} md={24}>
											<Card title={'Đơn quá hạn xử lý'}>
												<Tabs
													onChange={(val: any) => {
														setTypeBuoc(val);
													}}
												>
													<Tabs.TabPane tab='Theo tiến trình chung' key='BUOC_HIEN_TAI' />
													<Tabs.TabPane tab='Theo bước' key='BUOC_BAT_KY' />
												</Tabs>
												<TableStaticData size={'small'} data={dataQuaHan} columns={columns} />
											</Card>
										</Col> */}
										{/* <Col xs={24} md={24} lg={12} xl={12}>
											<Card
												title={
													<div style={{ display: 'flex', justifyContent: 'space-between' }}>
														<div>Số lượng đơn theo từng dịch vụ</div>
														
													</div>
												}
											>
												<DonutChart
													formatY={(vsl) => `${vsl} Đơn`}
													showTotal={true}
													xAxis={
														tongSoDon?.map((item) => {
														
															return item?._id;
														}) as string[]
													}
													height={300}
													yAxis={[
														tongSoDon?.map((item) => {
															// @ts-ignore
															return +item.sum;
														}) as number[],
													]}
													yLabel={['']}
												/>
											</Card>
										</Col> */}
										<Col xs={24}>
											<BlockSoLuongDonTheoBuoc />
										</Col>
									</>
								)}
								<Col span={24}>{props?.children}</Col>
							</Row>
						</Spin>
					</Card>
				</Pane>
			</SplitPane>

			<Modal
				title={intl.formatMessage({ id: 'global.button.chitiet' })}
				open={visibleChiTiet}
				onCancel={() => setVisibleChiTiet(false)}
				destroyOnClose
				footer={
					<>
						<Button onClick={() => setVisibleChiTiet(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</>
				}
			>
				<TableStaticData data={dataChiTiet} columns={columnsBuoc} />
			</Modal>
		</>
	);
};

export default ThongTinTongHop;
