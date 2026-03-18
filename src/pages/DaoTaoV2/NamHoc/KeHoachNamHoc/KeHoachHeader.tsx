import type { KeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc/typings';
import { tuanHocHighlight } from '@/services/DaoTaoV2/NamHoc/constant';

const KeHoachHeader = (props: { header?: KeHoachNamHoc.TGridHeader }) => {
	const { header } = props;

	const calIndexTrongKy = (index: number): number => {
		let ind = index;
		header?.hocKys?.some((hk) => {
			if (ind < hk.span) return true;
			ind -= hk.span;
			return false;
		});
		return ind;
	};

	return (
		<div className='title-row'>
			<div className='row-ke-hoach'>
				<div className='cell title-cell first-cell'>Học kỳ</div>
				{header?.hocKys?.map((item) => (
					<div
						className={`cell title-cell border-right ${item.isBreak ? 'break' : ''}`}
						key={item.title}
						style={{ width: 70 * item.span + item.span - 1 }}
					>
						{item.isBreak ? '' : item.title}
					</div>
				))}
			</div>
			<div className='row-ke-hoach'>
				<div className='cell title-cell first-cell'>Tháng</div>
				{header?.months.map((item) => (
					<div
						className='cell title-cell border-right'
						key={item.title}
						style={{ width: 70 * item.span + item.span - 1 }}
					>
						{item.title}
					</div>
				))}
			</div>
			<div className='row-ke-hoach'>
				<div className='cell title-cell first-cell'>Tuần</div>
				{header?.weeks.map((tuan, index) => (
					<div
						className={`cell title-cell ${
							tuanHocHighlight.includes((calIndexTrongKy(index) + 1).toString())
								? 'highlight'
								: header?.days?.[index]?.isBreak
								? 'break'
								: ''
						}`}
						key={tuan}
					>
						{tuan}
					</div>
				))}
			</div>
			<div className='row-ke-hoach'>
				<div className='cell title-cell first-cell'>Ngày</div>
				{header?.days.map((item, index) => (
					<div
						className={`cell title-cell ${
							tuanHocHighlight.includes((calIndexTrongKy(index) + 1).toString())
								? 'highlight'
								: header?.days?.[index]?.isBreak
								? 'break'
								: ''
						}`}
						key={item.span}
					>
						{item.title}
					</div>
				))}
			</div>
		</div>
	);
};

export default KeHoachHeader;
