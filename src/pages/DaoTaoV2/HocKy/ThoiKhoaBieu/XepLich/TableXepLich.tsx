import { EOperatorType } from '@/components/Table/constant';
import { ELoaiPhongHoc, ETrangThaiPhong } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import type { ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import { ELoaiHinhHocTap } from '@/services/DaoTaoV2/HocKy/constant';
import { boxesIntersect, useSelectionContainer, type Box } from '@air/react-drag-to-select';
import { Pagination, Spin, notification } from 'antd';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import { checkTrungLichTuan } from '../LichHocTuan';
import XepLichHeader from './Header';
import ModalXepLich from './ModalXepLich';
import RowXepLich from './Row';
import './style.less';

export type TDataXepLich = {
	maPhong: string;
	[key: string]: { span: number; maHoa?: LopHocPhan.TMaHoaLichHoc } | any;
};

export type TCell = Box & { thu?: number; tiet?: number; phong?: string; tenlop?: string };

const TableXepLich = (props: { tuanHienTai: number; getData: () => Promise<any> }) => {
	const {
		getModel: getPhong,
		danhSach: danhSachPhong,
		total,
		loading: loadingPhong,
		page,
		limit,
		setPage,
		setLimit,
		visibleForm,
	} = useModel('daotaov2.danhmuc.phonghoc');
	const { loading, danhSach } = useModel('daotaov2.hocky.lophocphan');
	const { putLichHocTuanModel } = useModel('daotaov2.hocky.thoikhoabieu');
	const [data, setData] = useState<TDataXepLich[]>([]);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [lichHocTuan, setLichHocTuan] = useState<Partial<ThoiKhoaBieu.ILichHocTuan>>();
	const { tuanHienTai, getData } = props;
	//xử lý Select box
	const [selectedCells, setSelectedCells] = useState<TCell[]>([]);
	const [selectableItems, setSelectableItems] = useState<TCell[]>([]);
	const elementsContainerRef = useRef<HTMLDivElement | null>(null);

	const getDataInternal = () => {
		// DS Mã hóa lịch học của tuần hiện tại
		const maHoas = danhSach
			.map((lop) => {
				const mahoa = lop.maHoaLichHoc?.filter((mh) => mh.danhSachTuan.some((tuan) => tuan.tuan === tuanHienTai)) ?? [];

				return mahoa.map((item) => ({ ...item, lopHocPhanId: lop._id, tenLop: lop.ten, tenHocPhan: lop.hocPhan?.ten }));
			})
			.flat();
		const temp: TDataXepLich[] = danhSachPhong.map((phong) => {
			const da: TDataXepLich = { maPhong: phong.ma };
			maHoas
				.filter((mh) => mh.phongHoc === phong.ma)
				.map((mh) => {
					da[`${mh.thu}.${mh.tietBatDau}`] = { span: mh.soTiet, maHoa: mh };
					_.range(1, mh.soTiet).map((tiet) => {
						da[`${mh.thu}.${mh.tietBatDau + tiet}`] = { span: 0 };
					});
				});

			return da;
		});

		setData(temp);
	};

	useEffect(() => {
		getPhong(
			{ trangThai: ETrangThaiPhong.HOAT_DONG },
			[
				{
					active: true,
					field: 'loaiPhong',
					operator: EOperatorType.NOT_INCLUDE,
					values: [ELoaiPhongHoc.PHONG_HOP],
				},
			],
			{ ma: 1 },
		);
	}, [page, limit]);

	useEffect(() => {
		if (tuanHienTai && !loading && !loadingPhong) getDataInternal();
	}, [tuanHienTai, loading, loadingPhong]);

	useEffect(() => {
		if (!elementsContainerRef.current) return;
		const items: TCell[] = [];
		let currentTop = elementsContainerRef.current?.getBoundingClientRect()?.top ?? 0; // Khoảng cách từ top drag selection đến hàng hiện tại

		Array.from(elementsContainerRef.current.children).forEach((row) => {
			const { height } = row.getBoundingClientRect();
			Array.from(row.children).forEach((cell) => {
				if (cell instanceof HTMLElement) {
					const thu = cell.dataset.thu;
					const tiet = cell.dataset.tiet;
					const phong = cell.dataset.phong;
					const tenlop = cell.dataset.tenlop;
					const { left, width } = cell.getBoundingClientRect();

					if (thu && tiet && phong)
						items.push({
							left: left + window.scrollX,
							top: window.scrollY + currentTop,
							width,
							height,
							thu: +thu,
							tiet: +tiet,
							phong,
							tenlop,
						});
				}
			});

			currentTop += height + 1; //  Cộng thêm height hàng hiện tại + 1px border
		});
		setSelectableItems(items);
	}, [data.at(-1)?.maPhong]);

	const handleClickCell = (lich: Partial<ThoiKhoaBieu.ILichHocTuan>) => {
		setLichHocTuan({
			loaiHinhHocTap: ELoaiHinhHocTap.LY_THUYET,
			...lich,
			danhSachTuanHoc: lich.danhSachTuanHoc ?? [tuanHienTai],
		});
		setVisibleModal(true);
	};

	const handleSaveLich = (lich: ThoiKhoaBieu.ILichHocTuan) => {
		if (!lich.lopHocPhanId) return;
		// Lưu lại mã hóa lịch học vào lớp tín chỉ
		const lop = danhSach.find((item) => item._id === lich.lopHocPhanId);
		if (!lop?.ten) return;
		const maHoas = lop?.maHoaLichHoc?.filter((item) => item.id !== lich.id);
		// Chuyển từ mã hóa => Lịch học tuần để put
		const lichHocTuanList: ThoiKhoaBieu.ILichHocTuan[] =
			maHoas?.map((mh) => {
				const thu = mh.thu === 0 ? '7' : mh.thu.toString();
				return { ...mh, thu, danhSachTuanHoc: mh.danhSachTuan.map((i) => i.tuan) };
			}) ?? [];
		lichHocTuanList.push(lich);

		// Check trùng lịch trong lớp
		if (checkTrungLichTuan(lichHocTuanList))
			notification.error({ message: 'Trùng lịch học', description: 'Vui lòng kiểm tra lại' });
		else
			putLichHocTuanModel(lop?.ten, {
				lichHocTuanList: lichHocTuanList.map((item) => ({ ...item, thu: (+item.thu + 1).toString() })),
			})
				.then(() => {
					// get all lớp tín chỉ then tính data hiển thị
					getData().then(() => getDataInternal());
					setVisibleModal(false);
				})
				.catch((er) => console.log(er));
	};

	const { DragSelection } = useSelectionContainer({
		onSelectionChange: (box) => {
			// Ô đang quét
			const scrollAwareBox: Box = {
				...box,
				top: box.top + window.scrollY + (elementsContainerRef?.current?.scrollTop ?? 0),
				left: box.left + window.scrollX + (elementsContainerRef?.current?.scrollLeft ?? 0),
			};
			const cellsToSelect: TCell[] = [];
			// Tìm ra các index nằm trong vùng quét
			selectableItems.forEach((item) => {
				const cell = cellsToSelect?.[0];
				if (
					!item.tenlop &&
					(!cell || (cell.phong === item.phong && cell.thu === item.thu)) &&
					boxesIntersect(scrollAwareBox, item)
				)
					cellsToSelect.push(item);
			});
			setSelectedCells(cellsToSelect);
		},

		onSelectionEnd: () => {
			if (selectedCells.length)
				handleClickCell({
					phongHoc: selectedCells[0].phong,
					tietBatDau: selectedCells[0].tiet,
					soTiet: (selectedCells.at(-1)?.tiet ?? 0) - (selectedCells[0].tiet ?? 0) + 1,
					thu: selectedCells[0].thu?.toString(),
				});
		},
		isEnabled: !visibleForm,
		eventsElement: document.getElementById('grid-xep-tkb'),
		selectionProps: { hidden: true },

		shouldStartSelecting: (target) => {
			if (target instanceof HTMLElement) {
				let el = target;
				while (el.parentElement && !el.dataset.disableselect) {
					el = el.parentElement;
				}
				return el.dataset.disableselect !== 'true';
			}
			return true;
		},
	});

	const mainContent = () => (
		<div className='table-base'>
			<div className='header' style={{ marginBottom: 8 }}>
				<div className='fw500'>Xếp lịch trong tuần</div>
				<div className='extra'>
					<div className='total'>
						Tổng số:
						<span>{total || 0}</span>
					</div>
				</div>
			</div>
			<div style={{ textAlign: 'right' }}>
				<i>Nhấn vào mỗi ô, hoặc kéo chọn các ô liên tiếp để thêm mới / chỉnh sửa lịch học chi tiết</i>
			</div>

			<Spin spinning={loadingPhong}>
				<DragSelection />
				<div className='grid-xep-tkb' id='grid-xep-tkb' ref={elementsContainerRef} tabIndex={0}>
					<XepLichHeader width={50} />

					{/* Pageable Theo lớp tín chỉ */}
					{data.map((item) => (
						<RowXepLich
							dataPhong={item}
							key={item.maPhong}
							onCell={handleClickCell}
							selectableItems={selectableItems}
							selectedCells={selectedCells}
							setSelectedCells={setSelectedCells}
						/>
					))}
				</div>

				<div style={{ textAlign: 'right' }}>
					<Pagination
						pageSize={limit}
						current={page}
						pageSizeOptions={['10', '25', '50']}
						showTotal={(tongSo: number) => <div>Tổng số: {tongSo}</div>}
						showSizeChanger
						total={total}
						onChange={(p, l) => {
							setPage(p);
							setLimit(l);
						}}
					/>
				</div>
			</Spin>
		</div>
	);

	return (
		<div data-disableselect={true}>
			{mainContent()}

			<ModalXepLich
				visible={visibleModal}
				onCancel={() => {
					setVisibleModal(false);
					setSelectedCells([]);
				}}
				onOk={handleSaveLich}
				lichTuan={lichHocTuan}
			/>
		</div>
	);
};

export default TableXepLich;
