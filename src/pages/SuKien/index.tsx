import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import { messagesCalendar } from '@/services/Calendar/constant';
import {
	ColorSuKien,
	ESuKienTypeMappingToLabel,
	ETrangThaiDienRa,
	ETrangThaiDienRaMappingToHexColor,
	ETrangThaiDienRaMappingToTagColor,
	ETrangThaiDienRaMappingToTagLabel,
	ETrangThaiDienRaMappingToThongKeKey,
	MapETrangThaiDienRa,
} from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import {
	CalendarOutlined,
	CheckOutlined,
	DeleteOutlined,
	DownloadOutlined,
	EditOutlined,
	MenuOutlined,
	PieChartOutlined,
	SendOutlined,
	TableOutlined,
	UndoOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Modal, Popconfirm, Popover, Row, Segmented, Spin, Tag, Tooltip } from 'antd';
import { sum } from 'lodash';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-big-calendar';
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useModel } from 'umi';
import { Detail } from './components/Detail';
import Form from './components/Form';
import { ThongKeNguoiThamDu } from './components/ThongKeNguoiThamDu';

const localizer = dayjsLocalizer(dayjs);

const SuKienPage = () => {
	const {
		getModel,
		deleteModel,
		handleEdit,
		handleView,
		getSuKienType,
		thongKeTheoNamData,
		isLoadingThongKeTheoNam,
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
		handleViewThongKe,
	} = useModel('sukien');

	const [layout, setLayout] = useState<'listing' | 'time'>('listing');
	const [calendarView, setCalendarView] = useState<string>(Views.MONTH);
	const [date, setDate] = useState(new Date());
	const [dateRange, setDateRange] = useState<Dayjs[]>([dayjs().startOf('month'), dayjs().endOf('month')]);
	const [dataCalendar, setDataCalendar] = useState<{ title: string; rawData: SuKien.IRecord }[]>([]);

	const eventPropGetter = (event: { title: string; rawData: SuKien.IRecord }) => ({
		style: { backgroundColor: ColorSuKien?.[event?.rawData?.loaiSuKien as keyof typeof ColorSuKien] },
	});
	const eventCustom = ({ event }: { event: { title: string; rawData: SuKien.IRecord } }) => {
		const { title } = event;
		return <div style={{ width: '100%', fontSize: 13 }}>{title || '--'}</div>;
	};

	const handleSelect = (event?: any) => {
		setRecord({
			thoiGianBatDau: event?.start?.toISOString(),
			thoiGianKetThuc: event?.end?.toISOString(),
		} as SuKien.IRecord);
		setEdit(false);
		setIsView(false);
		setVisibleForm(true);
	};

	const onCell = (rec: SuKien.IRecord) => ({
		onClick: () => handleView(rec),
		style: {
			cursor: 'pointer',
		},
	});
	const columns: IColumn<SuKien.IRecord>[] = [
		{
			title: 'Tên hoạt động',
			dataIndex: 'tenSuKien',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Địa điểm',
			dataIndex: 'diaDiem',
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thời gian bắt đầu',
			align: 'center',
			sortable: true,
			dataIndex: 'thoiGianBatDau',
			filterType: 'datetime',
			width: 160,
			onCell,
			render: (_, record) => {
				return record.thoiGianBatDau ? dayjs(record.thoiGianBatDau).format('HH:mm DD/MM/YYYY') : null;
			},
		},
		{
			title: 'Thời gian kết thúc',
			align: 'center',
			sortable: true,
			dataIndex: 'thoiGianKetThuc',
			filterType: 'datetime',
			width: 160,
			onCell,
			render: (_, record) => {
				return record.thoiGianKetThuc ? dayjs(record.thoiGianKetThuc).format('HH:mm DD/MM/YYYY') : null;
			},
		},
		{
			title: 'Thời gian diễn ra',
			align: 'center',
			sortable: true,
			dataIndex: 'thoiGianDienRa',
			width: 160,
			onCell,
			render: (_, record) => {
				return record.thoiGianDienRa ? dayjs(record.thoiGianDienRa).format('HH:mm DD/MM/YYYY') : null;
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
		// 	title: 'Số lượng',
		// 	dataIndex: 'soLuong',
		// 	width: 140,
		// 	filterType: 'number',
		// 	sortable: true,
		// 	onCell,
		// 	align: 'center',
		// },
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 160,
			filterType: 'select',
			filterData: Object.values(ETrangThaiDienRa)?.map((val) => ({ value: val, label: MapETrangThaiDienRa?.[val] })),
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
			title: 'Thao tác',
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (_, record) => {
				return (
					<>
						{record.trangThai !== ETrangThaiDienRa.CHUA_DIEN_RA && (
							<Tooltip title='Thống kê người tham dự'>
								<Button onClick={() => handleViewThongKe(record)} type='link' icon={<PieChartOutlined />} />
							</Tooltip>
						)}
						<Tooltip title='Chỉnh sửa'>
							<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
						</Tooltip>
						<Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, () => getModel())}
								title='Bạn có chắc chắn muốn xóa ngành đào tạo này?'
								placement='topLeft'
							>
								<Button danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
						<Popover
							placement={'left'}
							content={
								<>
									<Tooltip title='Duyệt'>
										<Button type='link' shape={'circle'} icon={<CheckOutlined />} />
									</Tooltip>
									<Divider type={'vertical'} />
									<Tooltip title='Yêu cầu chỉnh sửa'>
										<Button type='link' shape={'circle'} icon={<UndoOutlined />} />
									</Tooltip>
									<Divider type={'vertical'} />
									<Tooltip title='Tải xuống'>
										<Button type='link' shape={'circle'} icon={<DownloadOutlined />} />
									</Tooltip>
									<Divider type={'vertical'} />
									<Tooltip title='Tải lên'>
										<Button type='link' shape={'circle'} icon={<UploadOutlined />} />
									</Tooltip>
									<Divider type={'vertical'} />
									<Tooltip title='Gửi văn thư'>
										<Button type='link' shape={'circle'} icon={<SendOutlined />} />
									</Tooltip>
								</>
							}
						>
							<Button type='link' icon={<MenuOutlined />} />
						</Popover>
					</>
				);
			},
		},
	];

	useEffect(() => {
		if (layout === 'time') {
			getModel(undefined, [
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
			]);
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

	const renderContent = () => {
		if (layout === 'listing') {
			return (
				<TableBase
					hideCard
					widthDrawer={900}
					modelName='sukien'
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
						dayRangeHeaderFormat: (range: any) => {
							return `${dayjs(range.start).format('DD/MM')} - ${dayjs(range.end).format('DD/MM')}`;
						},
					}}
					onRangeChange={(val) => {
						if (Array.isArray(val)) setDateRange([dayjs(val[0]).startOf('d'), dayjs(val.at(-1)).endOf('d')]);
						else setDateRange([dayjs(val.start).startOf('d'), dayjs(val.end).endOf('d')]);
					}}
					localizer={localizer}
					defaultView={calendarView}
					onView={(view: any) => setCalendarView(view)}
					onNavigate={(newDate: any) => setDate(newDate)}
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
					components={{ event: (event: any) => eventCustom(event) }}
					popup
					onSelectEvent={(event: any) => {
						setRecord(event.rawData);
						setIsVisibleFormDetail(true);
					}}
				/>
				<Modal
					onCancel={() => setVisibleForm(false)}
					footer={null}
					title={`${isView ? 'Chi tiết' : edit ? 'Chỉnh sửa' : 'Thêm mới'} hoạt động`}
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
						<Card styles={{ padding: '8px 14px' }} loading={isLoadingThongKeTheoNam}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<div style={{ fontSize: 18, fontWeight: 700, color: '#007EB9' }}>
									{sum([
										thongKeTheoNamData?.suKienChuaDienRa ?? 0,
										thongKeTheoNamData?.suKienDangDienRa ?? 0,
										thongKeTheoNamData?.suKienDaDienRa ?? 0,
									])}
								</div>
								<div>Tổng số hoạt động</div>
							</div>
						</Card>
					</Col>
					{Object.values(ETrangThaiDienRa).map((item) => {
						const key = ETrangThaiDienRaMappingToThongKeKey[item];
						return (
							<Col key={item} span={24} md={12} lg={6}>
								<Card styles={{ padding: '8px 14px' }} loading={isLoadingThongKeTheoNam}>
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
								<div>{ESuKienTypeMappingToLabel[getSuKienType()]}</div>
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
