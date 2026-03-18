import { EOperatorType } from '@/components/Table/constant';
import type { HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import type { KeHoachNamHoc } from '@/services/DaoTaoV2/NamHoc/KeHoachNamHoc/typings';
import { resetFieldsForm } from '@/utils/utils';
import { boxesIntersect, useSelectionContainer, type Box } from '@air/react-drag-to-select';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Modal, Popconfirm } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { history, useIntl, useModel } from 'umi';
import DanhSachHoatDongTuan from '../../KeHoachNamHoc/DanhSachHoatDongTuan';
import FilterKhoaNganhKeHoachNamHoc from '../../KeHoachNamHoc/FilterKhoaNganh';
import FormKeHoachTheoTuan from '../../KeHoachNamHoc/Form';
import KeHoachHeader from '../../KeHoachNamHoc/KeHoachHeader';
import '../../KeHoachNamHoc/style.less';
import FormHocKyDetail from './FormHocKy';
import FormNamHocDetail from './FormNamHoc';
import { calHeader, calNumWeek } from './functions';

export type TCell = Box & { tuan?: number; maKhoaNganh?: string };

const ChiTietNamHocPage = () => {
	const intl = useIntl();
	const { ma: maNamHoc }: { ma?: string } = useParams();
	const [form] = Form.useForm();
	const { getOneModel, setRecord, setEdit, edit, khoiTaoNamHocModel, formSubmiting } =
		useModel('daotaov2.namhoc.namhoc');
	const { setRecordKHTheoTuan, visibleForm, setVisibleForm } = useModel('daotaov2.namhoc.kehoachnamhoc');
	const { setDanhSach: setDanhSachKhoa, record: recKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { setDanhSach: setDanhSachNganh, record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { getAllModel: getAllKhoaNganh } = useModel('daotaov2.namhoc.khoanganh');
	const [data, setData] = useState<KeHoachNamHoc.TKeHoachData[]>([]);
	const [header, setHeader] = useState<KeHoachNamHoc.TGridHeader>();
	const thoiGianBatDau = Form.useWatch('thoiGianBatDau', form);
	const soKyChinh = Form.useWatch('soKyChinh', form) ?? 0;
	const soKyPhu = Form.useWatch('soKyPhu', form) ?? 0;
	const hocKyList: Partial<HocKy.IRecord>[] = Form.useWatch('hocKyList', form);
	//xử lý Select box
	const soTuanTKB = Form.useWatch('soTuan', form);
	const [selectedCells, setSelectedCells] = useState<TCell[]>([]);
	const [selectableItems, setSelectableItems] = useState<TCell[]>([]);
	const elementsContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!maNamHoc) {
			resetFieldsForm(form);
			setEdit(false);
			setRecord(undefined);
		} else
			getOneModel({ ma: maNamHoc })
				.then((rec) => {
					form.setFieldsValue(rec);
					setEdit(true);
				})
				.catch((er) => console.log(er));
	}, [maNamHoc]);

	useEffect(() => {
		const nam = dayjs(thoiGianBatDau).year();
		getAllKhoaNganh(false, undefined, undefined, [
			{
				active: true,
				field: 'namBatDau',
				operator: EOperatorType.LESS_EQUAL,
				values: [nam],
			},
			{
				active: true,
				field: 'namKetThuc',
				operator: EOperatorType.GREAT_EQUAL,
				values: [nam],
			},
		]).then((da) => {
			const khoas = _.uniqBy(da, (i) => i.maKhoaSinhVien)?.map((i) => i.khoaSinhVien);
			setDanhSachKhoa(khoas.filter((i) => !!i));
			const nganhs = _.uniqBy(da, (i) => i.maNganh)?.map((i) => i.nganh);
			setDanhSachNganh(nganhs.filter((i) => !!i));

			const dat: KeHoachNamHoc.TKeHoachData[] = da.map((khoaNganh) => ({
				maKhoa: khoaNganh?.maKhoaSinhVien,
				maNganh: khoaNganh?.maNganh,
				maKhoaNganh: khoaNganh.ma,
				keHoachList: [],
				tenKhoaNganh: khoaNganh.ten,
			}));
			setData(dat);
		});
	}, [dayjs(thoiGianBatDau).year()]);

	useEffect(() => {
		if (!thoiGianBatDau || !hocKyList?.length) return;
		const day = dayjs(thoiGianBatDau).startOf('isoWeek');
		const soTuan = calNumWeek(day, hocKyList);
		const head = calHeader(day, hocKyList, soTuan);
		setHeader(head);
		form.setFieldsValue({ soTuan });
		form.validateFields(['soTuan']);

		const tempData = [...data];
		tempData.map((khoaNganh) => {
			khoaNganh.keHoachList = _.range(0, soTuan).map((tuan) => ({ thuTuTuan: tuan + 1 }));
			return khoaNganh;
		});
		setData(tempData);
	}, [JSON.stringify(hocKyList), thoiGianBatDau]);

	useEffect(() => {
		if (!elementsContainerRef.current) return;
		const items: TCell[] = [];
		let currentTop = elementsContainerRef.current?.getBoundingClientRect()?.top ?? 0; // Khoảng cách từ top drag selection đến hàng hiện tại

		Array.from(elementsContainerRef.current.children).forEach((row) => {
			const { height } = row.getBoundingClientRect();
			Array.from(row.children).forEach((cell) => {
				if (cell instanceof HTMLElement) {
					const tuan = cell.dataset.tuan;
					const maKhoaNganh = cell.dataset.makhoanganh;
					const { left, width } = cell.getBoundingClientRect();

					if (tuan && maKhoaNganh)
						items.push({
							left: left + window.scrollX,
							top: window.scrollY + currentTop,
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
	}, [data.length, soTuanTKB]);

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
			setRecordKHTheoTuan({
				maKhoaNganhList: _.uniq(selected.map((item) => item.maKhoaNganh ?? '')),
				// namHocId: recNam?._id,
				tuanBatDau: _.minBy(selected, (item) => item.tuan)?.tuan ?? 1,
				tuanKetThuc: _.maxBy(selected, (item) => item.tuan)?.tuan ?? 1,
			});
			setVisibleForm(true);
			setSelectedCells([]);
		},
		isEnabled: !visibleForm,
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

	const handleKeHoach = (keHoach: KeHoachNamHoc.IKeHoachTheoTuan) => {
		const temp = [...data];
		temp.forEach((khoaNganh) => {
			if (keHoach.maKhoaNganhList.includes(khoaNganh.maKhoaNganh)) {
				khoaNganh.keHoachList.forEach((item) => {
					if (item.thuTuTuan && item.thuTuTuan >= keHoach.tuanBatDau && item.thuTuTuan <= keHoach.tuanKetThuc) {
						item.hoatDongTuanId = keHoach.hoatDongTuanId;
						item.hoatDongTuan = keHoach.hoatDongTuan;
					}
				});
			}
		});
		setData(temp);
		setVisibleForm(false);
	};

	const onFinish = (values: any) => {
		delete values.hocKyList;
		const danhSachKeHoachNamHoc: Partial<KeHoachNamHoc.IRecord>[] = [];
		data.forEach((item) => {
			item.keHoachList.map((j) =>
				danhSachKeHoachNamHoc.push({
					maKhoaNganh: item.maKhoaNganh,
					hoatDongTuanId: j.hoatDongTuanId,
					thuTuTuan: j.thuTuTuan,
				}),
			);
		});
		khoiTaoNamHocModel({
			danhSachKeHoachNamHoc,
			namHoc: values,
			danhSachKyHoc: hocKyList.filter((item) => item.thoiGianBatDau),
		})
			.then(() => {
				history.push('thong-tin-nam-hoc');
			})
			.catch((er) => console.log(er));
	};

	return (
		<div data-disableselect={true}>
			<Card
				title={
					<>
						<Button
							icon={<ArrowLeftOutlined />}
							style={{ marginRight: 8 }}
							type='text'
							onClick={() => history.push('thong-tin-nam-hoc')}
						/>
						{intl.formatMessage({ id: 'namhoc.namhoc.kehoachnamhoc' })}
					</>
				}
			>
				<Form form={form} onFinish={onFinish} layout='vertical'>
					<FormNamHocDetail form={form} />

					{!edit && (soKyChinh || soKyPhu) ? (
						<FormHocKyDetail
							soKyChinh={soKyChinh}
							soKyPhu={soKyPhu}
							thoiGianBatDau={thoiGianBatDau}
							hocKyList={hocKyList}
						/>
					) : null}

					<Divider>Kế hoạch chi tiết</Divider>
					<div style={{ textAlign: 'right' }}>
						<i>Nhấn vào mỗi ô để chỉnh sửa kế hoạch chi tiết cho khóa ngành/tuần học tương ứng</i>
					</div>
					<FilterKhoaNganhKeHoachNamHoc />

					<DragSelection />
					<div className='grid-ke-hoach' id='grid-ke-hoach' ref={elementsContainerRef}>
						<KeHoachHeader header={header} />

						{data
							.filter(
								(item) =>
									(!recKhoa?.ma || item.maKhoa === recKhoa.ma) && (!recNganh?.ma || item.maNganh === recNganh.ma),
							)
							.map((item) => (
								<div className='row-ke-hoach' key={item.maKhoaNganh}>
									<div className='cell first-cell'>{item.maKhoaNganh}</div>
									{_.sortBy(item.keHoachList, (j) => j.thuTuTuan).map((kh, index) => (
										<div
											data-disableselect={false}
											data-tuan={header?.days?.[index]?.isBreak ? undefined : index + 1}
											data-makhoanganh={header?.days?.[index]?.isBreak ? undefined : item.maKhoaNganh}
											className={`cell ${header?.days?.[index]?.isBreak ? 'break' : ''}`}
											key={`${item.maKhoaNganh}${kh.thuTuTuan}`}
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

					<div className='form-footer' style={{ marginTop: 24, marginBottom: 24 }}>
						<Popconfirm
							title='Xác nhận khởi tạo năm học kèm thông tin kế hoạch'
							onConfirm={() => form.validateFields().then(onFinish)}
						>
							<Button type='primary' size='large' icon={<SaveOutlined />} loading={formSubmiting}>
								Khởi tạo Năm học kèm thông tin kế hoạch năm
							</Button>
						</Popconfirm>
					</div>
				</Form>

				<DanhSachHoatDongTuan />
			</Card>

			<Modal
				title='Chỉnh sửa kế hoạch năm học'
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				maskClosable={false}
				width={600}
				footer={null}
			>
				<FormKeHoachTheoTuan afterAddNew={handleKeHoach} isLocal />
			</Modal>
		</div>
	);
};

export default ChiTietNamHocPage;
