import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import FilterHocPhan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/Filter';
import { ELoaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { boxesIntersect, useSelectionContainer, type Box } from '@air/react-drag-to-select';
import { ReloadOutlined } from '@ant-design/icons';
import { Card, Empty, Pagination, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ThoiKhoaBieuHeader from './Header';
import RowCauHinhGiaiDoan from './Row';
import './style.less';

type TCell = Box & { tuan: number; lopHocPhanId: string };

const CauHinhGiaiDoanTKBPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, loading, total, setPage, setLimit, danhSach, updateCauHinhTKBModel } =
		useModel('daotaov2.hocky.lophocphan');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan, danhSach: danhSachHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const { record: recDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	//xử lý Select box
	const [distanceToTop, setDistanceToTop] = useState<number>(0);
	const elementsContainerRef = useRef<HTMLDivElement | null>(null);
	const [selectedCells, setSelectedCells] = useState<TCell[]>([]);
	const [selectableItems, setSelectableItems] = useState<TCell[]>([]);

	const getLopHocPhan = async () => {
		getModel(
			{
				maHocKy: recHocKy?.ma,
				loai: ELoaiLopHocPhan.CHINH,
				maHocPhan: recHocPhan?.ma,
			},
			!recHocPhan?.ma && recDonVi?.maDonVi
				? [
						{
							active: true,
							field: 'maHocPhan',
							operator: EOperatorType.INCLUDE,
							values: danhSachHocPhan.length ? danhSachHocPhan.map((item) => item.ma) : [''],
						},
				  ]
				: undefined,
		);
		setSelectedCells([]);
	};

	useEffect(() => {
		if (recHocKy?._id) getLopHocPhan();
	}, [page, limit, recHocKy?._id, recHocPhan?.ma, recDonVi?.maDonVi]);

	useEffect(() => {
		// TODO: Tính lại khi screen width thay đổi => top thay đổi
		const calculateDistanceToTop = () => {
			return elementsContainerRef.current
				? elementsContainerRef.current.children?.[0]?.getBoundingClientRect()?.top ?? 0
				: 0;
		};
		// Khoảng cách từ drag selection đến đầu trang
		const updatedDistanceToTop = calculateDistanceToTop();
		if (updatedDistanceToTop !== distanceToTop) setDistanceToTop(updatedDistanceToTop);
	}, [elementsContainerRef.current]);

	useEffect(() => {
		if (!elementsContainerRef.current) return;
		const items: TCell[] = [];
		let currentTop = 0; // Khoảng cách từ top drag selection đến hàng hiện tại

		Array.from(elementsContainerRef.current.children).forEach((row) => {
			const { top, height } = row.getBoundingClientRect();
			Array.from(row.children).forEach((cell) => {
				if (cell instanceof HTMLElement) {
					const tuan = cell.dataset.tuan;
					const lopHocPhanId = cell.dataset.lopid;
					const { left, width } = cell.getBoundingClientRect();

					if (tuan && lopHocPhanId)
						items.push({
							left,
							top: distanceToTop === 0 ? top : distanceToTop + currentTop,
							width,
							height,
							tuan: +tuan,
							lopHocPhanId,
						});
				}
			});

			currentTop += height + 1; //  Cộng thêm height hàng hiện tại + 1px border
		});
		setSelectableItems(items);
	}, [danhSach.at(-1)?._id]);

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
				if (boxesIntersect(scrollAwareBox, item)) cellsToSelect.push(item);
			});
			setSelectedCells(cellsToSelect);
		},

		isEnabled: true,
		eventsElement: document.getElementById('grid-thoi-khoa-bieu'),
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

	const onKeyDown = (e: any) => {
		if (selectedCells.length) {
			const tuans = _.uniq(selectedCells.map((item) => item.tuan));
			const lopHocPhanIds = _.uniq(selectedCells.map((item) => item.lopHocPhanId));

			if (e.key === 'Enter') {
				updateCauHinhTKBModel(tuans, lopHocPhanIds).then(() => {
					getLopHocPhan();
				});
			} else if (e.key === 'Delete' || e.key === 'Backspace') {
				updateCauHinhTKBModel(tuans, lopHocPhanIds, 0).then(() => {
					getLopHocPhan();
				});
			} else if (e.key >= 1 && e.key <= 9)
				updateCauHinhTKBModel(tuans, lopHocPhanIds, +e.key).then(() => {
					getLopHocPhan();
				});
		}
	};

	const mainContent = () => (
		<div className='table-base'>
			<FilterHocPhan />

			<div className='header' style={{ marginBottom: 8 }}>
				<div />
				<div className='extra'>
					<ButtonExtend tooltip='Tải lại dữ liệu' icon={<ReloadOutlined />} onClick={() => getLopHocPhan()}>
						<span className='extend'>Tải lại</span>
					</ButtonExtend>
					<div className='total'>
						Tổng số:
						<span>{total || 0}</span>
					</div>
				</div>
			</div>
			<div style={{ textAlign: 'right' }}>
				<i>
					Nhấn hoặc kéo chọn các ô liên tiếp, sau đó nhấn Enter, Delete hoặc Phím số (1-9) để điền số tiết vào các tuần
					tương ứng
				</i>
			</div>

			<Spin spinning={loading}>
				{danhSach.length ? (
					<div data-disableselect={true}>
						<DragSelection />
						<div
							className='grid-cau-hinh-tkb'
							id='grid-thoi-khoa-bieu'
							ref={elementsContainerRef}
							onKeyDown={onKeyDown}
							tabIndex={0}
						>
							<ThoiKhoaBieuHeader />

							{/* Pageable Theo lớp tín chỉ */}
							{danhSach.map((item) => (
								<RowCauHinhGiaiDoan
									lopHocPhan={item}
									key={item._id}
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
					</div>
				) : (
					<Empty description={<i>Không có lớp tín chỉ nào</i>} style={{ marginBottom: 32, marginTop: 32 }} />
				)}
			</Spin>
		</div>
	);

	return (
		<>
			<Card title={intl.formatMessage({ id: 'kyhoc.cauhinhgiaidoan.title' })}>{mainContent()}</Card>
		</>
	);
};

export default CauHinhGiaiDoanTKBPage;
