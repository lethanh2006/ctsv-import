import { exportKeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc';
import { boxesIntersect, useSelectionContainer, type Box } from '@air/react-drag-to-select';
import {
	EditOutlined,
	ExportOutlined,
	FileOutlined,
	ImportOutlined,
	RetweetOutlined,
	SaveOutlined,
	SnippetsOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Divider, Empty, Modal, Popconfirm, Spin } from 'antd';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { calHeader } from '../NamHoc/ChiTiet/functions';
import SelectNamHoc from '../NamHoc/components/Select';
import DanhSachHoatDongTuan from './DanhSachHoatDongTuan';
import FilterKhoaNganhKeHoachNamHoc from './FilterKhoaNganh';
import FormKeHoachTheoTuan from './Form';
import KeHoachHeader from './KeHoachHeader';
// import ModalImportKeHoach from './ModalImportKeHoach';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { KeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc/typings';
import { Space } from 'antd';
import ModalImportKeHoach from './ModalImportKeHoach';
import FormXinYKien from './components/FormXinYKien';
import ModalChotKeHoach from './components/ModalChotKeHoach';
import ModalYKien from './components/ModalYKien';
import './style.less';

export type TCell = Box & { tuan?: number; maKhoaNganh?: string };

const KeHoachNamHocPage = (props: { hideSelect?: boolean }) => {
	const intl = useIntl();
	const { hideSelect } = props;
	const {
		record: recNam,
		getByIdModel: getNamHoc,
		getModel,
		danhSach: danhSachNam,
		setRecord: setNam,
	} = useModel('daotaov2.namhoc.namhoc');
	const { getAllService: getHocKy } = useModel('daotaov2.hocky.hocky');
	const {
		initKeHoachNamHocModel,
		formSubmiting,
		loading,
		visibleForm,
		setVisibleForm,
		getDataModel,
		setRecordKHTheoTuan,
	} = useModel('daotaov2.namhoc.kehoachnamhoc');
	const {
		setDanhSach: setDanhSachKhoa,
		record: recKhoa,
		setRecord: setKhoa,
	} = useModel('daotaov2.namhoc.khoasinhvien');
	const {
		setDanhSach: setDanhSachNganh,
		record: recNganh,
		setRecord: setNganh,
	} = useModel('daotaov2.danhmuc.nganhdaotao');
	const [data, setData] = useState<KeHoachNamHoc.TKeHoachData[]>([]);
	const [header, setHeader] = useState<KeHoachNamHoc.TGridHeader>();
	const [visibleImport, setVisibleImport] = useState<boolean>(false);
	const [visibleChotKeHoach, setVisibleChotKeHoach] = useState<boolean>(false);
	const [visibleYKien, setVisibleYKien] = useState<boolean>(false);
	const [visibleModelYKien, setVisibleModelYKien] = useState<boolean>(false);
	//xử lý Select box
	const [distanceToTop, setDistanceToTop] = useState<number>(0);
	const [selectedCells, setSelectedCells] = useState<TCell[]>([]);
	const [selectableItems, setSelectableItems] = useState<TCell[]>([]);
	const elementsContainerRef = useRef<HTMLDivElement | null>(null);

	/** Lấy danh sách học kỳ, tính toán giá trị tháng, tuần, ngày
	 * Lấy toàn bộ kế hoạch năm học & group by `Khóa ngành`
	 */
	const getData = async () => {
		getHocKy({ sort: { soThuTu: 1 }, condition: { namHocId: recNam?._id } }).then((hocKyList) => {
			const day = dayjs(recNam?.thoiGianBatDau).startOf('isoWeek');
			const head = calHeader(day, hocKyList.data?.data ?? [], recNam?.soTuan ?? 0);
			setHeader(head);
		});

		getDataModel(recNam?._id ?? '').then((res) => {
			const khoas = _.uniqBy(res, (i) => i.khoaNganh?.maKhoaSinhVien)?.map((i) => i.khoaNganh?.khoaSinhVien);
			setDanhSachKhoa(khoas.filter((i) => !!i));
			const nganhs = _.uniqBy(res, (i) => i.khoaNganh?.maNganh)?.map((i) => i.khoaNganh?.nganh);
			setDanhSachNganh(nganhs.filter((i) => !!i));

			const gKhoaNganh = _.groupBy(
				_.sortBy(res, (item) => item.khoaNganh?.maKhoaSinhVien),
				(item) => item.maKhoaNganh,
			);
			const dat: KeHoachNamHoc.TKeHoachData[] = Object.entries(gKhoaNganh)?.map(([maKhoaNganh, keHoachList]) => ({
				maKhoa: keHoachList[0].khoaNganh?.maKhoaSinhVien,
				maNganh: keHoachList[0].khoaNganh?.maNganh,
				maKhoaNganh,
				keHoachList,
				tenKhoaNganh: [keHoachList[0].khoaNganh?.khoaSinhVien?.ten, keHoachList[0].khoaNganh?.nganh?.ma].join(' - '),
			}));
			setData(dat);
		});
	};

	useEffect(() => {
		setKhoa(undefined);
		setNganh(undefined);
		if (recNam?._id) getData();
	}, [recNam?._id]);

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
					const maKhoaNganh = cell.dataset.makhoanganh;
					const { left, width } = cell.getBoundingClientRect();

					if (tuan && maKhoaNganh)
						items.push({
							left,
							top: distanceToTop === 0 ? top : distanceToTop + currentTop,
							width,
							height,
							tuan: +tuan,
							maKhoaNganh,
						});
				}
			});

			currentTop += height + 1; //  Cộng thêm height hàng hiện tại + 1px border
		});
		setSelectableItems(items);
	}, [data.at(-1)?.maKhoaNganh, data.length]);

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

		onSelectionEnd: () => {
			const selected = selectedCells.filter((item) => item.tuan && item.maKhoaNganh);
			if (selected.length) {
				setRecordKHTheoTuan({
					maKhoaNganhList: _.uniq(selected.map((item) => item.maKhoaNganh ?? '')),
					namHocId: recNam?._id,
					tuanBatDau: _.minBy(selected, (item) => item.tuan)?.tuan ?? 1,
					tuanKetThuc: _.maxBy(selected, (item) => item.tuan)?.tuan ?? 1,
				});
				setVisibleForm(true);
				setSelectedCells([]);
			}
		},
		isEnabled: !visibleForm && recNam?.isKhoiTaoKeHoach,
		eventsElement: document.getElementById('grid-ke-hoach'),
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

	const handleInitKeHoach = () => {
		initKeHoachNamHocModel(recNam?._id ?? '').then(() => {
			if (recNam?._id) getNamHoc(recNam._id);
			getModel();
			getData();
		});
	};

	const onExport = () => {
		if (recNam?._id && recNam.isKhoiTaoKeHoach)
			exportKeHoachNamHoc(recNam?._id).then((res) => fileDownload(res.data, `Kế hoạch ${recNam.ten}.xlsx`));
	};

	const mainContent = () => (
		<>
			{!hideSelect ? (
				<div>
					<Space wrap style={{ marginBottom: 12 }}>
						<SelectNamHoc
							isSetRecord
							style={{ width: 200 }}
							value={recNam?._id}
							onChange={(val) => setNam(danhSachNam.find((item) => item._id === val))}
						/>
						{!recNam?.daChotKeHoachNamHoc ? (
							<>
								{recNam?.ngayBdLayYKien && recNam.ngayKtLayYKien ? (
									<a href='#!' onClick={() => setVisibleModelYKien(true)}>
										Thời gian xin ý kiến phòng ban từ {dayjs(recNam.ngayBdLayYKien).format('DD/MM/YYYY')} đến{' '}
										{dayjs(recNam.ngayKtLayYKien).format('DD/MM/YYYY')}
									</a>
								) : recNam?.isKhoiTaoKeHoach ? (
									<ButtonExtend disabled={recNam?.daChotKeHoachNamHoc} onClick={() => setVisibleYKien(true)}>
										Xin ý kiến phòng ban
									</ButtonExtend>
								) : null}
							</>
						) : null}
					</Space>

					{recNam?.daChotKeHoachNamHoc ? (
						<div style={{ marginBottom: 12 }}>
							<Alert description='Đã chốt kế hoạch năm học !' showIcon type='success' />
						</div>
					) : null}
				</div>
			) : null}

			{recNam?.isKhoiTaoKeHoach ? (
				<Space style={{ marginBottom: 12 }} wrap>
					<ButtonExtend
						disabled={recNam?.daChotKeHoachNamHoc}
						type='primary'
						icon={<EditOutlined />}
						onClick={() => {
							setRecordKHTheoTuan(undefined);
							setVisibleForm(true);
						}}
					>
						Chỉnh sửa kế hoạch
					</ButtonExtend>
					<ButtonExtend
						disabled={recNam?.daChotKeHoachNamHoc}
						icon={<ImportOutlined />}
						onClick={() => setVisibleImport(true)}
					>
						Nhập dữ liệu
					</ButtonExtend>
					<Popconfirm
						disabled={!recNam?._id || recNam?.daChotKeHoachNamHoc}
						title={
							<>
								Xác nhận khởi tạo lại kế hoạch năm học?
								<br />
								Những kế hoạch đã tạo sẽ bị loại bỏ
							</>
						}
						onConfirm={() => handleInitKeHoach()}
					>
						<ButtonExtend
							icon={<RetweetOutlined />}
							loading={formSubmiting}
							disabled={!recNam?._id || recNam?.daChotKeHoachNamHoc}
						>
							Khởi tạo lại kế hoạch
						</ButtonExtend>
					</Popconfirm>
					<ButtonExtend icon={<ExportOutlined />} onClick={onExport}>
						Xuất dữ liệu
					</ButtonExtend>

					{!recNam.daChotKeHoachNamHoc ? (
						<ButtonExtend
							hidden={hideSelect}
							icon={<SaveOutlined />}
							type='primary'
							className='btn-success'
							onClick={() => setVisibleChotKeHoach(true)}
						>
							Chốt kế hoạch năm học
						</ButtonExtend>
					) : (
						<ButtonExtend icon={<FileOutlined />} onClick={() => setVisibleChotKeHoach(true)}>
							Cập nhật file kế hoạch
						</ButtonExtend>
					)}
				</Space>
			) : null}

			{!recNam?.isKhoiTaoKeHoach ? (
				<Spin spinning={loading}>
					<div style={{ display: 'flex', justifyContent: 'center', margin: '24px 12px' }}>
						<Empty
							description={
								<>
									Chưa có kế hoạch năm học!
									<br />
									{recNam?._id ? (
										<Button
											type='primary'
											icon={<SnippetsOutlined />}
											loading={formSubmiting}
											onClick={() => handleInitKeHoach()}
											style={{ marginTop: 18 }}
										>
											Khởi tạo kế hoạch
										</Button>
									) : (
										<i>Vui lòng chọn năm học trước</i>
									)}
								</>
							}
						/>
					</div>
				</Spin>
			) : (
				<>
					<Divider style={{ marginTop: 24 }}>Chi tiết kế hoạch năm học theo từng khóa ngành</Divider>
					<div style={{ textAlign: 'right' }}>
						<i>Nhấn vào mỗi ô để chỉnh sửa kế hoạch chi tiết cho khóa ngành/tuần học tương ứng</i>
					</div>
					<Spin spinning={loading}>
						<FilterKhoaNganhKeHoachNamHoc />

						<DragSelection />
						<div className='grid-ke-hoach' id='grid-ke-hoach' ref={elementsContainerRef} tabIndex={0}>
							<KeHoachHeader header={header} />

							{data
								.filter(
									(item) =>
										(!recKhoa?.ma || item.maKhoa === recKhoa.ma) && (!recNganh?.ma || item.maNganh === recNganh.ma),
								)
								.map((item) => (
									<div className='row-ke-hoach' key={item.maKhoaNganh}>
										<div className='cell first-cell border-right'>{item.maKhoaNganh}</div>
										{_.sortBy(item.keHoachList, (j) => j.thuTuTuan).map((kh, index) => (
											<div
												data-disableselect={false}
												data-tuan={header?.days?.[index]?.isBreak ? undefined : index + 1}
												data-makhoanganh={header?.days?.[index]?.isBreak ? undefined : item.maKhoaNganh}
												className={`cell ${header?.days?.[index]?.isBreak ? 'break' : ''}`}
												key={kh._id}
												style={{
													backgroundColor: selectedCells.find(
														(j) => j.tuan === index + 1 && j.maKhoaNganh === item.maKhoaNganh,
													)
														? 'var(--color-primary-bg)'
														: kh.hoatDongTuan?.maMau,
													cursor: header?.days?.[index]?.isBreak ? 'not-allowed' : 'pointer',
												}}
												onClick={() => {
													if (!header?.days?.[index]?.isBreak) {
														setRecordKHTheoTuan({
															hoatDongTuanId: kh.hoatDongTuanId,
															maKhoaNganhList: [item.maKhoaNganh],
															namHocId: recNam._id,
															tuanBatDau: index + 1,
															tuanKetThuc: index + 1,
														});
														setVisibleForm(true);
													}
												}}
											>
												{header?.days?.[index]?.isBreak ? null : kh.hoatDongTuan?.kyHieu ?? '--'}
											</div>
										))}
									</div>
								))}
						</div>
					</Spin>

					<DanhSachHoatDongTuan />
				</>
			)}
		</>
	);

	return (
		<div data-disableselect={true}>
			{!hideSelect ? (
				<Card title={intl.formatMessage({ id: 'namhoc.kehoachnamhoc.title' })}>{mainContent()}</Card>
			) : (
				mainContent()
			)}

			<Modal
				title='Chỉnh sửa kế hoạch năm học'
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				maskClosable={false}
				width={600}
				footer={null}
			>
				<FormKeHoachTheoTuan afterAddNew={getData} />
			</Modal>

			<Modal
				title='Xin ý kiến kế hoạch năm học'
				open={visibleYKien}
				onCancel={() => setVisibleYKien(false)}
				maskClosable={false}
				width={600}
				footer={null}
			>
				<FormXinYKien visible={visibleYKien} setVisible={setVisibleYKien} />
			</Modal>

			<ModalImportKeHoach
				visible={visibleImport}
				onCancel={() => setVisibleImport(false)}
				onOk={() => {
					getData();
					setVisibleImport(false);
				}}
			/>

			<ModalChotKeHoach
				tongKhoaNganh={data.length}
				visible={visibleChotKeHoach}
				onCancel={() => setVisibleChotKeHoach(false)}
				onOk={() => {
					getModel().then((res) => setNam(res.find((item) => recNam?._id === item._id)));
				}}
			/>

			<ModalYKien visible={visibleModelYKien} onCancel={() => setVisibleModelYKien(false)} />
		</div>
	);
};

export default KeHoachNamHocPage;
