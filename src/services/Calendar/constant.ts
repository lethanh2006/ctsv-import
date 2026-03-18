export const messagesCalendar = {
	allDay: 'Cả ngày',
	previous: 'Trước',
	next: 'Sau',
	today: 'Hôm nay',
	month: 'Tháng',
	week: 'Tuần',
	day: 'Ngày',
	agenda: 'Chung',
	date: 'Ngày',
	time: 'Thời gian',
	event: 'Sự kiện',
	showMore: (total: number) => `+ Xem thêm (${total})`,
	noEventsInRange: 'Không có sự kiện nào trong khoảng thời gian này',
};

export enum ELoaiSuKien {
	LICH_GIANG_DAY = 'Lịch giảng dạy',
	LICH_HOC = 'Lịch học',
	LICH_THI = 'Lịch thi',
	CA_NHAN = 'Cá nhân',
	CHUNG = 'Chung',
}

export const ColorSuKien = {
	[ELoaiSuKien.LICH_GIANG_DAY]: 'rgba(49, 190, 203, 0.7)',
	[ELoaiSuKien.LICH_HOC]: 'rgba(49, 190, 203, 0.7)',
	[ELoaiSuKien.LICH_THI]: 'rgba(223, 68, 113, 0.7)',
	[ELoaiSuKien.CA_NHAN]: 'rgba(87, 191, 86, 0.7)',
	[ELoaiSuKien.CHUNG]: 'rgba(32, 152, 199, 0.7)',
};
