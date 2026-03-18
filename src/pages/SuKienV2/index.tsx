import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import { messagesCalendar } from '@/services/Calendar/constant';
import {
	ColorSuKien,
	ETrangThaiDienRa,
	ETrangThaiDienRaMappingToHexColor,
	ETrangThaiDienRaMappingToTagColor,
	ETrangThaiDienRaMappingToTagLabel,
	ETrangThaiDienRaMappingToThongKeKey,
} from '@/services/SuKien/constant';
import { ESuKienType } from '@/services/SuKienV2/constant';
import type { SuKienV2 } from '@/services/SuKienV2/typings';
import dayjs from '@/utils/dayjs';
import { CalendarOutlined, DeleteOutlined, EditOutlined, PieChartOutlined, TableOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Popconfirm, Row, Segmented, Spin, Switch, Tag, Tooltip } from 'antd';
import { View } from 'bizcharts';
import { Dayjs } from 'dayjs';
import { sum } from 'lodash';
import { useEffect, useState } from 'react';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useIntl, useModel } from 'umi';
import { Detail } from './components/Detail';
import Form from './components/Form';
import { ThongKeNguoiThamDu } from './components/ThongKeNguoiThamDu';

const localizer = dayjsLocalizer(dayjs);

const SuKienPage = () => {
	const intl = useIntl();
	const {
		getModel,
		deleteModel,
		handleEdit,
		handleView,
		putModel,
		// getSuKienType,
		thongKeTheoNamData,
		loading,
		visibleForm,
		setRecord,
		setEdit,
		setIsView,
		setVisibleForm,
		setIsVisibleFormDetail,
		isView,
		edit,
		danhSach,
	} = useModel('sukienv2');

	const { danhSach: danhSachCauHinhMinhChungDRL, getAllModel: getAllCauHinhMinhChungDRL } = useModel(
		'diemrenluyen.minhchung.cauhinh',
	);

	const [layout, setLayout] = useState<'listing' | 'time'>('listing');
	const [calendarView, setCalendarView] = useState<View>(Views.MONTH);
	const [date, setDate] = useState(new Date());
	const [dateRange, setDateRange] = useState<Dayjs[]>([dayjs().startOf('month'), dayjs().endOf('month')]);
	const [dataCalendar, setDataCalendar] = useState<{ title: string; rawData: SuKienV2.IRecord }[]>([]);

	const eventPropGetter = (event: { title: string; rawData: SuKienV2.IRecord }) => ({
		//@ts-ignore
		style: { backgroundColor: ColorSuKien?.[event?.rawData?.loaiSuKien as keyof typeof ColorSuKien] },
	});
	const eventCustom = ({ event }: { event: { title: string; rawData: SuKienV2.IRecord } }) => {
		const { title } = event;
		return <div style={{ width: '100%', fontSize: 13 }}>{title || '--'}</div>;
	};

	const getData = () => {
		getModel({
			loaiSuKien: {
				$nin: [ESuKienType.CA_NHAN, ESuKienType.HOP_LOP],
			} as any,
		});
	};

	const handleSelect = (event?: any) => {
		setRecord({
			thoiGianBatDau: event?.start?.toISOString(),
			thoiGianKetThuc: event?.end?.toISOString(),
		} as SuKienV2.IRecord);
		setEdit(false);
		setIsView(false);
		setVisibleForm(true);
	};

	const onCell = (rec: SuKienV2.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});

	const columns: IColumn<SuKienV2.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'sukien.column.ten' }),
			dataIndex: 'tenSuKien',
			width: 250,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sukien.column.loai' }),
			dataIndex: 'loaiSuKien',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ESuKienType).filter(
				(item) => item !== ESuKienType.CA_NHAN && item !== ESuKienType.HOP_LOP,
			),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sukien.column.diadiem' }),
			dataIndex: 'diaDiem',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'sukien.column.thamgia' }),
			dataIndex: 'cauHinhMinhChungId',
			width: 200,
			onCell,
			render: (val: string) =>
				val ? danhSachCauHinhMinhChungDRL.find((item) => item._id === val)?.tenMinhChung : 'Không',
		},
		// {
		// 	title: 'Thời gian bắt đầu đăng ký',
		// 	align: 'center',
		// 	sortable: true,
		// 	dataIndex: 'thoiGianBatDauDangKy',
		// 	filterType: 'datetime',
		// 	width: 160,
		// 	onCell,
		// 	render: (_, record) => {
		// 		return record.thoiGianBatDauDangKy ? dayjs(record.thoiGianBatDauDangKy).format('HH:mm DD/MM/YYYY') : '--';
		// 	},
		// },
		// {
		// 	title: 'Thời gian kết thúc đăng ký',
		// 	align: 'center',
		// 	sortable: true,
		// 	dataIndex: 'thoiGianKetThucDangKy',
		// 	filterType: 'datetime',
		// 	width: 160,
		// 	onCell,
		// 	render: (_, record) => {
		// 		return record.thoiGianKetThucDangKy ? dayjs(record.thoiGianKetThucDangKy).format('HH:mm DD/MM/YYYY') : '--';
		// 	},
		// },
		{
			title: intl.formatMessage({ id: 'sukien.column.thoigian' }),
			align: 'center',
			sortable: true,
			dataIndex: 'thoiGianBatDau',
			width: 160,
			onCell,
			render: (_, record) => {
				return record.thoiGianBatDau
					? `${dayjs(record.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(record.thoiGianKetThuc).format(
							'HH:mm DD/MM/YYYY',
						)}`
					: null;
			},
		},
		// {
		// 	title: 'Kinh phí',
		// 	dataIndex: 'kinhPhi',
		// 	width: 180,
		// 	filterType: 'number',
		// 	onCell,
		// 	sortable: true,
		// },
		// {
		// 	title: 'Số lượng đăng ký',
		// 	dataIndex: 'soDangKy',
		// 	width: 140,
		// 	filterType: 'number',
		// 	sortable: true,
		// 	onCell,
		// 	align: 'center',
		// },
		{
			title: intl.formatMessage({ id: 'sukien.column.sl' }),
			dataIndex: 'soCheckIn',
			width: 140,
			filterType: 'number',
			sortable: true,
			onCell,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'sukien.column.trangthai' }),
			dataIndex: 'trangThai',
			width: 160,
			filterType: 'select',
			filterData: Object.values(ETrangThaiDienRa)?.map((val) => ({ value: val, label: val })),
			onCell,
			align: 'center',
			render: (_, record) => {
				if (record.trangThai) {
					return (
						<Tag color={ETrangThaiDienRaMappingToTagColor[record.trangThai]}>
							{ETrangThaiDienRaMappingToTagLabel[record.trangThai]}
						</Tag>
					);
				}
				return null;
			},
		},
		{
			title: intl.formatMessage({ id: 'sukien.column.kichhoat' }),
			dataIndex: 'isHieuLuc',
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (val, rec) => (
				<Switch
					size='small'
					checked={val}
					onChange={(checked) => putModel(rec._id, { ...rec, isHieuLuc: checked }, getData)}
				/>
			),
		},
		{
			title: intl.formatMessage({ id: 'sukien.column.thaotac' }),
			align: 'center',
			width: 130,
			fixed: 'right',
			render: (_, record) => {
				return (
					<>
						{record.trangThai !== ETrangThaiDienRa.CHUA_DIEN_RA && (
							<Tooltip title={intl.formatMessage({ id: 'sukien.column.button.thongke' })}>
								<Button onClick={() => handleView(record)} type='link' icon={<PieChartOutlined />} />
							</Tooltip>
						)}
						<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
							<Button
								// disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
								// 	record?.trangThai as ETrangThaiDienRa,
								// )}
								onClick={() => handleEdit(record)}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>
						<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
							<Popconfirm
								disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
									record?.trangThai as ETrangThaiDienRa,
								)}
								onConfirm={() =>
									deleteModel(record._id, getData, {
										messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
									})
								}
								title={intl.formatMessage({ id: 'sukien.column.confirm.xoa' })}
								placement='topLeft'
							>
								<Button
									disabled={[ETrangThaiDienRa.DANG_DIEN_RA, ETrangThaiDienRa.DA_DIEN_RA].includes(
										record?.trangThai as ETrangThaiDienRa,
									)}
									danger
									type='link'
									icon={<DeleteOutlined />}
								/>
							</Popconfirm>
						</Tooltip>
						{/*<Popover*/}
						{/*	placement={'left'}*/}
						{/*	content={*/}
						{/*		<>*/}
						{/*			<Tooltip title='Duyệt'>*/}
						{/*				<Button type='link' shape={'circle'} icon={<CheckOutlined />} />*/}
						{/*			</Tooltip>*/}
						{/*			<Divider type={'vertical'} />*/}
						{/*			<Tooltip title='Yêu cầu chỉnh sửa'>*/}
						{/*				<Button type='link' shape={'circle'} icon={<UndoOutlined />} />*/}
						{/*			</Tooltip>*/}
						{/*			<Divider type={'vertical'} />*/}
						{/*			<Tooltip title='Tải xuống'>*/}
						{/*				<Button type='link' shape={'circle'} icon={<DownloadOutlined />} />*/}
						{/*			</Tooltip>*/}
						{/*			<Divider type={'vertical'} />*/}
						{/*			<Tooltip title='Tải lên'>*/}
						{/*				<Button type='link' shape={'circle'} icon={<UploadOutlined />} />*/}
						{/*			</Tooltip>*/}
						{/*			<Divider type={'vertical'} />*/}
						{/*			<Tooltip title='Gửi văn thư'>*/}
						{/*				<Button type='link' shape={'circle'} icon={<SendOutlined />} />*/}
						{/*			</Tooltip>*/}
						{/*		</>*/}
						{/*	}*/}
						{/*>*/}
						{/*	<Button type='link' icon={<MenuOutlined />} />*/}
						{/*</Popover>*/}
					</>
				);
			},
		},
	];

	useEffect(() => {
		if (layout === 'time') {
			getModel(
				{
					loaiSuKien: {
						$nin: [ESuKienType.CA_NHAN],
					} as any,
				},
				[
					{
						active: true,
						field: 'thoiGianKetThuc',
						values: [dateRange[0].toISOString()],
						operator: EOperatorType.GREAT_EQUAL,
					},
					{
						active: true,
						field: 'thoiGianBatDau',
						values: [dateRange[1].toISOString()],
						operator: EOperatorType.LESS_EQUAL,
					},
				],
			);
		}
	}, [layout, dateRange[0].valueOf(), dateRange[1].valueOf()]);

	useEffect(() => {
		setDataCalendar(
			danhSach.map((item) => ({
				rawData: item,
				title: item.tenSuKien,
				start: dayjs(item?.thoiGianBatDau).toDate(),
				end: dayjs(item?.thoiGianKetThuc).toDate(),
			})),
		);
	}, [danhSach, layout]);

	useEffect(() => {
		if (!danhSachCauHinhMinhChungDRL.length) getAllCauHinhMinhChungDRL(false, undefined, { dungChoSuKien: true });
	}, []);

	const renderContent = () => {
		if (layout === 'listing') {
			return (
				<TableBase
					getData={getData}
					hideCard
					widthDrawer={900}
					modelName='sukienv2'
					columns={columns}
					Form={Form as any}
					otherProps={{ hideCard: false }}
				/>
			);
		}
		return (
			<Spin spinning={loading}>
				<Calendar
					events={dataCalendar}
					formats={{
						dayHeaderFormat: 'dddd DD/MM/YYYY',
						dayRangeHeaderFormat: (range: DateRange) => {
							return `${dayjs(range.start).format('DD/MM')} - ${dayjs(range.end).format('DD/MM')}`;
						},
					}}
					onRangeChange={(val) => {
						if (Array.isArray(val)) setDateRange([dayjs(val[0]).startOf('d'), dayjs(val.at(-1)).endOf('d')]);
						else setDateRange([dayjs(val.start).startOf('d'), dayjs(val.end).endOf('d')]);
					}}
					localizer={localizer}
					defaultView={calendarView}
					onView={(view) => setCalendarView(view)}
					onNavigate={(newDate) => setDate(newDate)}
					selectable
					scrollToTime={new Date(1970, 1, 1, 6)}
					defaultDate={new Date()}
					date={date}
					messages={messagesCalendar}
					views={['month', 'week', 'day']}
					style={{ height: 700, overflow: 'auto' }}
					min={dayjs('0000', 'HHmm').toDate()}
					max={dayjs('2359', 'HHmm').toDate()}
					eventPropGetter={eventPropGetter}
					onSelectSlot={handleSelect}
					components={{ event: (event) => eventCustom(event) }}
					popup
					onSelectEvent={(event) => {
						setRecord(event.rawData);
						setIsVisibleFormDetail(true);
					}}
				/>
				<Modal
					onCancel={() => setVisibleForm(false)}
					footer={null}
					title={
						isView
							? intl.formatMessage({ id: 'sukien.form.chitiet' })
							: edit
								? intl.formatMessage({ id: 'sukien.form.chinhsua' })
								: intl.formatMessage({ id: 'sukien.form.themmoi' })
					}
					open={visibleForm}
					width={900}
				>
					<Form hideCard />
				</Modal>
			</Spin>
		);
	};

	const renderStatistic = () => {
		return (
			<Col span={24}>
				<Row gutter={[12, 12]}>
					<Col span={24} md={12} lg={6}>
						<Card styles={{ body: { padding: '8px 14px' } }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<div style={{ fontSize: 18, fontWeight: 700, color: '#007EB9' }}>
									{sum([
										thongKeTheoNamData?.suKienChuaDienRa ?? 0,
										thongKeTheoNamData?.suKienDangDienRa ?? 0,
										thongKeTheoNamData?.suKienDaDienRa ?? 0,
									])}
								</div>
								<div>{intl.formatMessage({ id: 'sukien.thongke' })}</div>
							</div>
						</Card>
					</Col>
					{Object.values(ETrangThaiDienRa).map((item) => {
						const key = ETrangThaiDienRaMappingToThongKeKey[item];
						return (
							<Col key={item} span={24} md={12} lg={6}>
								<Card styles={{ body: { padding: '8px 14px' } }}>
									<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
										<div style={{ fontSize: 18, fontWeight: 700, color: ETrangThaiDienRaMappingToHexColor[item] }}>
											{thongKeTheoNamData?.[key]}
										</div>
										<div>{ETrangThaiDienRaMappingToTagLabel[item]}</div>
									</div>
								</Card>
							</Col>
						);
					})}
				</Row>
			</Col>
		);
	};

	return (
		<>
			<Row gutter={[12, 12]}>
				{renderStatistic()}
				<Col xs={24}>
					<Card
						title={
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div>{intl.formatMessage({ id: 'sukien.title' })}</div>
								<Segmented
									value={layout}
									onChange={(value) => setLayout(value as typeof layout)}
									options={[
										{ label: <TableOutlined />, value: 'listing' },
										{ label: <CalendarOutlined />, value: 'time' },
									]}
								/>
							</div>
						}
					>
						{renderContent()}
					</Card>
				</Col>
			</Row>
			<Detail />
			<ThongKeNguoiThamDu />
		</>
	);
};

export default SuKienPage;
