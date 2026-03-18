import { Space, Tag } from 'antd';
import _ from 'lodash';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import './style.less';
const { CheckableTag } = Tag;

const GroupTagTuanHoc = (props: {
	value?: number[];
	onChange?: (arr: number[]) => void;
	soTuan: number;
	thoiGianBatDau?: string;
	dayOfWeek?: number;
	fromPhanCong?: boolean;
	prefix?: string;
}) => {
	const { value, onChange, soTuan, thoiGianBatDau, dayOfWeek, fromPhanCong, prefix = 'Tuần ' } = props;
	const [startDate, setStartDate] = useState<Dayjs | undefined>();

	useEffect(() => {
		if (thoiGianBatDau && dayOfWeek !== undefined) {
			const date = dayjs(thoiGianBatDau).startOf('isoWeek').add(dayOfWeek, 'day');
			setStartDate(date);
		} else setStartDate(undefined);
	}, [thoiGianBatDau, dayOfWeek]);

	const handleChange = (week: number, checked: boolean) => {
		if (!checked) {
			const newVal = value?.filter((i) => i !== week) ?? [];
			if (onChange) onChange(newVal);
		} else {
			const find = value?.find((i) => i === week);
			if (!find && onChange) {
				const newVal = [...(value ?? []), week];
				onChange(newVal);
			}
		}
	};

	return (
		<Space wrap size={8} className='lich-tuan-list'>
			{_.range(1, soTuan + 1).map((week) => (
				<CheckableTag
					key={week}
					checked={value?.includes(week) || false}
					onChange={(checked) => {
						if (!fromPhanCong) handleChange(week, checked);
					}}
				>
					{prefix}
					{week}{' '}
					{startDate
						? `(${startDate
								.clone()
								.add(week - 1, 'week')
								.format('D/M')})`
						: ''}
				</CheckableTag>
			))}
		</Space>
	);
};

export default GroupTagTuanHoc;
