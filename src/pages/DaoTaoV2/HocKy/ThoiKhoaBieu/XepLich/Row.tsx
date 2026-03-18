import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import type { ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import _ from 'lodash';
import { useModel } from 'umi';
import type { TDataXepLich } from './TableXepLich';

const RowXepLich = (props: {
	dataPhong: TDataXepLich;
	onCell: (val: Partial<ThoiKhoaBieu.ILichHocTuan>) => void;
	selectedCells: any[];
	setSelectedCells: any;
	selectableItems: any[];
}) => {
	const { danhSach: danhSachTietHoc } = useModel('daotaov2.danhmuc.tiethoc');
	const { dataPhong: item, selectedCells } = props;

	return (
		<div className='row-thoi-khoa-bieu'>
			<div className='cell first-cell data-cell border-right'>
				<span>{item.maPhong}</span>
			</div>

			{/* Dữ liệu tương ứng với từng tiết */}
			{_.range(1, 8).map((thu) =>
				danhSachTietHoc.map((tiet, index) => {
					const tkb = item?.[`${thu}.${tiet.tietHoc}`];
					const maHoa = tkb?.maHoa as LopHocPhan.TMaHoaLichHoc;

					if (tkb?.span === 0) return null;
					return (
						<div
							className={`cell data-cell ${maHoa?.tenLop ? 'has-data' : ''} ${
								index === danhSachTietHoc.length - 1 ? 'border-right' : ''
							}`}
							key={`${thu}.${tiet.tietHoc}`}
							data-disableselect={false}
							data-thu={thu}
							data-tiet={tiet.tietHoc}
							data-phong={item.maPhong}
							data-tenlop={maHoa?.tenLop}
							style={{
								width: 50 * (tkb?.span ?? 1) + (tkb?.span ?? 1) - 1,
								backgroundColor: selectedCells.find(
									(j) => j.thu === thu && j.tiet === tiet.tietHoc && j.phong === item.maPhong,
								)
									? 'var(--color-primary-bg)'
									: undefined,
							}}
							onClick={
								() => {
									if (props.onCell)
										props.onCell({
											phongHoc: item.maPhong,
											danhSachTuanHoc: maHoa?.danhSachTuan?.map((t) => t.tuan),
											...maHoa,
											tietBatDau: tiet.tietHoc,
											thu: thu.toString(),
										});
								}
								// setSelectedCells(
								// 	tkb?.tenLop
								// 		? []
								// 		: selectableItems.filter(
								// 				(j) => j.thu === thu && j.tiet === tiet.tietHoc && j.phong === item.maPhong,
								// 		  ),
								// )
							}
						>
							{maHoa?.tenLop ?? <i style={{ color: '#999' }}>--</i>}
						</div>
					);
				}),
			)}
		</div>
	);
};

export default RowXepLich;
