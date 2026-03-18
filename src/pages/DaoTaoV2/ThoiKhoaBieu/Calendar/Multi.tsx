import { EOperatorType } from '@/components/Table/constant';
import { ColorSuKien, ELoaiSuKien, messagesCalendar } from '@/services/Calendar/constant';
import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import type { ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import type { DateRange } from 'react-big-calendar';
import { Calendar, type View, Views, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useIntl, useModel } from 'umi';
const localizer = dayjsLocalizer(dayjs);

/** Hiển thị lịch học của danh sách lớp học phần dưới dạng calendar */
const LichHocLopHocPhanMulti = React.forwardRef<CalendarLopHpRef, TProps>((props, ref) => {
	const intl = useIntl();
	const { getAllModel, loading } = useModel('daotaov2.hocky.thoikhoabieu');
	const { getByIdModel: getLopHp } = useModel('daotaov2.hocky.lophocphan');
	const [calendarView, setCalendarView] = useState<View>(Views.WEEK);
	const [dataCalendar, setDataCalendar] = useState<{ title: string; [x: string]: unknown }[]>([]);
	const [date, setDate] = useState<Date>();

	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();
	const { onClickLop, danhSachLop, danhSachTKb } = props;

	const genData = (tkb: ThoiKhoaBieu.IRecord[]) => {
		const data = tkb.map((j) => ({
			...j.lopHocPhan,
			title: `${j?.lopHocPhan?.hocPhan?.ten} - ${j?.tenLopHocPhan}`,
			start: dayjs(j?.thoiGianBatDau).toDate(),
			end: dayjs(j?.thoiGianKetThuc).toDate(),
		}));
		const start = _.minBy(data, (item) => item.start)?.start;
		const end = _.maxBy(data, (item) => item.end)?.end;
		setStartDate(start);
		setEndDate(end);
		setDate(start);
		setDataCalendar(data);
	};

	const getData = () => {
		if (danhSachLop?.length)
			getAllModel(
				undefined,
				undefined,
				undefined,
				[
					{
						field: 'tenLopHocPhan',
						operator: EOperatorType.INCLUDE,
						values: danhSachLop ?? [],
					},
				],
				undefined,
				false,
			).then((danhSach) => {
				genData(danhSach);
			});
		else genData([]);
	};

	useEffect(() => {
		if (danhSachTKb?.length) genData(danhSachTKb);
		else getData();
	}, [JSON.stringify(danhSachLop)]);

	/**
	 * Create trigger for calling functions from other component
	 */
	useImperativeHandle(ref, () => ({
		refresh: () => {
			if (danhSachTKb?.length) genData(danhSachTKb);
			else getData();
		},
	}));

	const eventPropGetter = () => ({
		style: { backgroundColor: ColorSuKien?.[ELoaiSuKien.LICH_HOC] },
	});

	const eventCustom = ({ event }: any) => {
		const { title } = event;
		return <div style={{ width: '100%', fontSize: 13 }}>{title}</div>;
	};

	return (
		<Spin spinning={loading}>
			<p
				dangerouslySetInnerHTML={{
					__html: intl.formatMessage(
						{ id: 'loptinchi.lichhoc.lophocphan.description' },
						{
							soLop: danhSachLop?.length,
							soBuoiHoc: dataCalendar.length,
							ngayBatDau: dayjs(startDate).format('DD/MM/YYYY'),
							ngayKetThuc: dayjs(endDate).format('DD/MM/YYYY'),
						},
					),
				}}
			/>

			<Calendar
				formats={{
					dayRangeHeaderFormat: (range: DateRange) => {
						return `${dayjs(range.start).format('DD/MM')} - ${dayjs(range.end).format('DD/MM')}`;
					},
				}}
				localizer={localizer}
				events={dataCalendar}
				views={[Views.MONTH, Views.WEEK]}
				defaultView={Views.MONTH}
				view={calendarView}
				onView={(view) => setCalendarView(view)}
				defaultDate={new Date()}
				date={date}
				onNavigate={(newDate) => setDate(newDate)}
				selectable={false}
				messages={messagesCalendar}
				style={{ height: 600, overflow: 'auto' }}
				min={dayjs('0600', 'HHmm').toDate()}
				max={dayjs('2100', 'HHmm').toDate()}
				eventPropGetter={eventPropGetter}
				components={{ event: (event: any) => eventCustom(event) }}
				onSelectEvent={(rec: any) => {
					getLopHp(rec._id).then((res) => onClickLop(res));
				}}
				onShowMore={(events: any[], d) => {
					setCalendarView(Views.WEEK);
					setDate(d);
				}}
			/>
		</Spin>
	);
});

type TProps = {
	danhSachLop?: string[];
	danhSachTKb?: ThoiKhoaBieu.IRecord[];
	onClickLop: (lop: LopHocPhan.IRecord) => void;
};

export type CalendarLopHpRef = {
	refresh: () => void;
};

export default LichHocLopHocPhanMulti;
