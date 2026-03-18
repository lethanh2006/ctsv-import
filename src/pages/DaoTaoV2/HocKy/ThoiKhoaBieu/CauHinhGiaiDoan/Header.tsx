import type { KeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc/typings';
import { tuanHocHighlight } from '@/services/DaoTaoV2/NamHoc/constant';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThoiKhoaBieuHeader = (props: { width?: number }) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const [header, setHeader] = useState<KeHoachNamHoc.TGridHeader>();

	const getDataHeader = () => {
		const day = dayjs(recHocKy?.thoiGianBatDau).startOf('isoWeek');
		let month: number = -1;
		const weeks: number[] = [];
		const months: KeHoachNamHoc.THeadGroup[] = [];
		const days: KeHoachNamHoc.THeadGroup[] = [];
		_.range(0, recHocKy?.soTuan).map((tuan) => {
			weeks.push(tuan + 1);
			// Tiêu đề các tháng
			if (month !== day.month()) {
				month = day.month();
				months.push({ title: `T${day.format('M/YY')}`, span: 1 });
			} else {
				months.slice(-1)[0].span++;
				months.slice(-1)[0].title = `Tháng ${day.format('M/YYYY')}`;
			}
			// Ngày bắt đầu - kết thúc của tuần
			days.push({ title: `${day.date()}-${day.clone().add(6, 'd').date()}`, span: tuan });
			day.add(7, 'd');
		});
		setHeader({ weeks, months, days });
	};

	useEffect(() => {
		if (recHocKy?._id) getDataHeader();
	}, [recHocKy?._id]);

	return (
		<div className='title-row'>
			<div className='row-thoi-khoa-bieu'>
				<div className='cell title-cell first-cell'>Tháng</div>
				{header?.months.map((item) => (
					<div
						className='cell title-cell border-right'
						key={item.title}
						style={{ width: (props.width ?? 60) * item.span + item.span - 1 }}
					>
						{item.title}
					</div>
				))}
			</div>
			<div className='row-thoi-khoa-bieu'>
				<div className='cell title-cell first-cell'>Tuần</div>
				{header?.weeks.map((tuan) => (
					<div
						className={`cell title-cell ${tuanHocHighlight.includes(tuan.toString()) ? 'highlight' : ''}`}
						key={tuan}
					>
						{tuan}
					</div>
				))}
			</div>
			<div className='row-thoi-khoa-bieu'>
				<div className='cell title-cell first-cell'>Ngày</div>
				{header?.days.map((item, index) => (
					<div
						className={`cell title-cell ${tuanHocHighlight.includes((index + 1).toString()) ? 'highlight' : ''}`}
						key={item.span}
					>
						{item.title}
					</div>
				))}
			</div>
		</div>
	);
};

export default ThoiKhoaBieuHeader;
