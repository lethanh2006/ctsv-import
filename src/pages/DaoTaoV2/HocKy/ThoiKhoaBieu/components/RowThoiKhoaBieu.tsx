import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { type ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';

const RowThoiKhoaBieu = (props: {
	item: ThoiKhoaBieu.TThoiKhoaBieuData;
	isChild?: boolean;
	onViewDetail: (lopHp: LopHocPhan.IRecord) => void;
	openKey: string[];
	setOpenKey: (val: string[]) => void;
}) => {
	const { item, isChild, onViewDetail, openKey, setOpenKey } = props;

	return (
		<div className='row-thoi-khoa-bieu'>
			<div className='cell first-cell data-cell border-right'>
				{/* Nút expand/collapse children rows */}
				{item.lopHocPhan.children?.length ? (
					openKey.includes(item.lopHocPhan._id) ? (
						<a onClick={() => setOpenKey(openKey.filter((i) => i !== item.lopHocPhan._id))}>
							<MinusSquareOutlined />
						</a>
					) : (
						<a onClick={() => setOpenKey([...openKey, item.lopHocPhan._id])}>
							<PlusSquareOutlined />
						</a>
					)
				) : null}
				<span style={{ paddingLeft: isChild ? 24 : 0 }}>{item.lopHocPhan.ten}</span>
			</div>
			{/* Dữ liệu tương ứng với từng tuần */}
			{item.thoiKhoaBieuList.map((ngays) => (
				<div
					className={`cell data-cell ${ngays.chiTiet.length ? 'has-data' : ''}`}
					key={ngays.tuan}
					style={{ cursor: 'pointer' }}
					onClick={() => onViewDetail(item.lopHocPhan)}
				>
					{ngays.chiTiet?.length ? (
						<ul>
							{ngays.chiTiet.map((ngay) => (
								<li key={ngay.thu + ngay.soTiet}>
									{ngay.thu === 0 ? 'CN' : `T${ngay.thu + 1}`}, tiết {ngay.tietBatDau}-
									{ngay.tietBatDau + ngay.soTiet - 1}
								</li>
							))}
						</ul>
					) : (
						'--'
					)}
				</div>
			))}
		</div>
	);
};

export default RowThoiKhoaBieu;
