import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import _ from 'lodash';
import { useModel } from 'umi';
import { Popover, Descriptions } from 'antd';

const RowCauHinhGiaiDoan = (props: {
	lopHocPhan: LopHocPhan.IRecord;
	selectedCells: any[];
	setSelectedCells: any;
	selectableItems: any[];
}) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { lopHocPhan: item, selectedCells, selectableItems, setSelectedCells } = props;
	const tongSoTiet = _.sumBy(item.cauHinhTkb ?? [], (j) => j.soTiet ?? 0);
	const soTiet = 45;

	const popoverContent = (
		<Descriptions column={1} style={{ maxWidth: 350 }}>
			<Descriptions.Item label='Tên lớp tín chỉ'>{item.ten}</Descriptions.Item>
			<Descriptions.Item label='Học phần'>{item.hocPhan?.ten}</Descriptions.Item>
			<Descriptions.Item label='Số thứ tự lớp'>{item.soThuTuLop}</Descriptions.Item>
			<Descriptions.Item label='Số tiết đã cấu hình'>{tongSoTiet} tiết</Descriptions.Item>
			<Descriptions.Item label='Số tiết phân bổ'>{soTiet} tiết</Descriptions.Item>
		</Descriptions>
	);

	return (
		<div className='row-thoi-khoa-bieu'>
			<div className='cell first-cell data-cell border-right'>
				<Popover content={popoverContent}>
					{item.ten} (
					<span className={tongSoTiet === soTiet ? 'text-success' : 'text-error'}>
						{tongSoTiet}/{45} tiết
					</span>
					)
				</Popover>
			</div>

			{/* Dữ liệu tương ứng với từng tuần */}
			{_.range(1, (recHocKy?.soTuan ?? 0) + 1).map((tuan) => {
				const cauHinh = item.cauHinhTkb?.find((j) => j.tuan === tuan);
				return (
					<div
						className={`cell data-cell ${cauHinh?.soTiet ? 'has-data' : ''}`}
						key={`${tuan}${item._id}`}
						data-disableselect={false}
						data-tuan={tuan}
						data-lopid={item._id}
						style={{
							backgroundColor: selectedCells.find((j) => j.tuan === tuan && j.lopHocPhanId === item._id)
								? 'var(--color-primary-bg)'
								: undefined,
						}}
						onClick={() =>
							setSelectedCells(selectableItems.filter((j) => j.tuan === tuan && j.lopHocPhanId === item._id))
						}
					>
						{cauHinh?.soTiet ?? '--'}
					</div>
				);
			})}
		</div>
	);
};

export default RowCauHinhGiaiDoan;
