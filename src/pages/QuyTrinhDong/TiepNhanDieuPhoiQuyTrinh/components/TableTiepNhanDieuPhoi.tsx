import formWaiting from '@/components/Loading/FormWaiting';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import ModalSinhVien from '@/pages/DaoTaoV2/SinhVien/component/ModalSinhVien';
import View from '@/pages/QuyTrinhDong/QuanLyQuyTrinh/ViewQuyTrinh/components/View';
import SelectDotKhaiBao from '@/pages/QuyTrinhDong/QuanLyQuyTrinh/components/DotKhaiBao/Select';
import FormTiepNhanNhieuDon from '@/pages/QuyTrinhDong/TiepNhanDieuPhoiQuyTrinh/components/FormTiepNhanNhieuDon';
import ThongTinThanhToan from '@/pages/TaiChinh/HoaDon/ThanhToan/ThongTinThanhToan';
import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import {
	MapColorTrangThaiTiepNhan,
	TrangThaiTiepNhan,
	TrangThaiTiepNhanDon,
} from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/constants';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/typings';
import { ELoaiTinhTrangDon } from '@/services/QuyTrinhDong/constant';
import type { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { toISOString } from '@/utils/utils';
import { CheckOutlined, DollarCircleOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, DatePicker, Dropdown, Menu, Modal, Select, Tabs, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

interface IProps {
	type: 'dieu_phoi' | 'tiep_nhan';
	title?: string;
}
const TableTiepNhanDieuPhoi = (props: IProps) => {
	const intl = useIntl();
	const { type, title } = props;
	const {
		getQuyTrinhChuyenVienModel,
		page,
		limit,
		condition,
		setCondition,
		visibleForm,
		setVisibleForm,
		record,
		current,
		setCurrent,
		setCurrentFormKhaiBao,
		setDataQuyTrinh,
		loaiTinhTrangDon,
		setLoaiTinhTrangDon,
		exportMauDonTheoBuocModel,
		exportMauTraKetQuaTheoBuocModel,
		loading,
		traKetQuaModel,
		quyTrinhSelect,
		maBuoc,
		selectedIds,
		setSelectedIds,
		selectedIdsMauTiepNhan,
		setSelectedIdsMauTiepNhan,
		danhSach,
	} = useModel('quytrinh.khaibaoquytrinh');

	const { getAllModel: getAllDanhMucChung } = useModel('quytrinh.danhmuc');
	const { record: recordChiTietThu, getByIdModel } = useModel('taichinh.hoadon');
	const {
		visibleForm: visibleModalSinhVien,
		setVisibleForm: setVisibleModalSinhVien,
		getAllModel,
	} = useModel('daotaov2.sinhvien.sinhvien');

	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	useEffect(() => {
		getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.QUY_TRINH });
	}, []);
	const [currentRecord, setCurrentRecord] = useState<any>();

	const [visibleTiepNhanNhieuDon, setVisibleTiepNhanNhieuDon] = useState<boolean>(false);
	const [dotQuyTrinhId, setDotQuyTrinhId] = useState<string>();

	const [trangThaiTiepNhan, settrangThaiTiepNhan] = useState<string>();
	const isTabTraKetQua = condition?.daTraKetQua !== null && condition?.daTraKetQua !== undefined;

	const handleSetData = (recordVal: KhaiBaoQuyTrinh.IRecord) => {
		//set data buoc hien tai
		setCurrent(recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1]);
		const arr = recordVal?.quyTrinh?.danhSachFormKhaiBao;
		const obj = arr?.find((item: { ma: any }) => item?.ma === recordVal?.danhSachBuocXuLy?.[0]?.maFormKhaiBao);
		setCurrentFormKhaiBao(obj);
	};

	const getData = async (idRecord?: string) => {
		if (quyTrinhSelect?._id)
			getQuyTrinhChuyenVienModel(type, {
				quyTrinhId: quyTrinhSelect?._id,
				maBuoc,
				trangThaiTiepNhan: idRecord ? undefined : trangThaiTiepNhan,
				dotQuyTrinhId,
			}).then((danhSachRes) => {
				if (idRecord) {
					const recordRes = danhSachRes?.find((item) => item?._id === idRecord);
					if (recordRes) {
						setCurrentRecord(recordRes);
						setDataQuyTrinh(recordRes);
						handleSetData(recordRes);
					}
					return recordRes;
				}
				return null;
			});
	};

	const onCell = (recordVal: KhaiBaoQuyTrinh.IRecord) => ({
		onClick: () => {
			setCurrentRecord(recordVal);
			setDataQuyTrinh(recordVal);
			handleSetData(recordVal);
			setVisibleForm(true);
		},
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<KhaiBaoQuyTrinh.IRecord>[] = [
		// {
		// 	title: 'Tên quy trình',
		// 	dataIndex: 'quyTrinh',
		// 	width: 150,
		// 	render: (val, recordVal) => {
		// 		return recordVal?.quyTrinh?.ten;
		// 	},
		// 	onCell,
		// },
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.hoten' }),
			dataIndex: 'nguoiKhaiBao.ten',
			width: 150,
			filterType: 'string',
			align: 'center',
			render: (val, recordVal) => {
				return (
					<div>
						{recordVal?.nguoiKhaiBao?.ten ? recordVal?.nguoiKhaiBao?.ten : recordVal.moTa}
						<Button
							onClick={async () => {
								await getAllModel(true, undefined, { ssoId: recordVal?.nguoiKhaiBao?.ssoId });
								setVisibleModalSinhVien(true);
							}}
							style={{ padding: 0 }}
							type='link'
						>
							{intl.formatMessage({ id: 'global.button.chitiet' })}
						</Button>
					</div>
				);
			},
			// onCell,
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.masv' }),
			dataIndex: 'nguoiKhaiBao.ma',
			width: 120,
			filterType: 'string',
			align: 'center',
			render: (val, recordVal) => {
				return recordVal?.nguoiKhaiBao?.ma
					? recordVal?.nguoiKhaiBao?.ma
					: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.empty' });
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.tientrinh' }),
			dataIndex: 'quyTrinh',
			width: 180,
			align: 'center',
			render: (val, recordVal) => {
				const buocHienTai = recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1];
				return (
					<>
						{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.buoc' })} {recordVal?.danhSachBuocXuLy?.length}/
						{val?.danhSachBuocXuLy?.length} : {buocHienTai.ten}
					</>
				);
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.trangthai' }),
			dataIndex: 'trangThaiTiepNhan',
			width: 200,
			align: 'center',
			render: (val, recordVal) => (
				<Tag
					color={
						MapColorTrangThaiTiepNhan?.[
							recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1]
								?.trangThaiTiepNhan as TrangThaiTiepNhan
						] ?? 'yellow'
					}
				>
					{recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1]?.trangThaiTiepNhan}
				</Tag>
			),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.thanhtoan' }),
			dataIndex: 'trangThaiThanhToan',
			width: 200,
			align: 'center',
			render: (val: EMaTrangThaiThanhToan) => (
				<Tag color={EMauTrangThaiThanhToanTable?.[val] ?? 'gray'}>
					{val ? ETrangThaiThanhToan[val] : intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.dichvu' })}
				</Tag>
			),
			onCell,
		},
		// {
		// 	title: 'Ngày khai',
		// 	dataIndex: 'createdAt',
		// 	width: 120,
		// 	// filterType: 'string',
		// 	filterType: 'date',
		// 	sortable: true,
		// 	align: 'center',
		// 	render: (val) => {
		// 		return val ? dayjs(val).format('DD/MM/YYYY') : 'Không có dữ liệu';
		// 	},
		// 	onCell,
		// },
		{
			title: !isTabTraKetQua
				? intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.hanxuly' })
				: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.ngayhen' }),
			width: 120,
			align: 'center',
			render: (val, recordVal) => {
				const buocHienTai = recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1];
				const thoiGianTemp = isTabTraKetQua ? recordVal?.ngayHenTraKetQua : buocHienTai?.hanCuoiTiepNhan;
				return thoiGianTemp
					? dayjs(thoiGianTemp).format('DD/MM/YYYY')
					: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.empty' });
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.nguoihen' }),
			width: 140,
			align: 'center',
			hide: !condition?.daTraKetQua === true,
			render: (recordVal: KhaiBaoQuyTrinh.IRecord) => (
				<div>
					{recordVal?.hoTenNguoiTraKetQua} (
					{recordVal?.thoiGianTraKetQua
						? dayjs(recordVal?.thoiGianTraKetQua).format('HH:mm DD/MM/YYYY')
						: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.nguoihen.empty' })}
					)
				</div>
			),
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.column.thaotac' }),
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (recordVal: KhaiBaoQuyTrinh.IRecord) => {
				const buocHienTai = recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1];
				const formKhai = recordVal?.quyTrinh?.danhSachFormKhaiBao?.find(
					(item) => item.ma === buocHienTai?.maFormKhaiBao,
				);
				const buocDaTiepNhan = recordVal?.danhSachBuocXuLy?.find(
					(item) => item?.maFormTiepNhan && item?.thongTinTiepNhan,
				);
				const formTiepNhan = recordVal?.quyTrinh?.danhSachFormTiepNhan?.find(
					(item) => item.ma === buocDaTiepNhan?.maFormTiepNhan,
				);
				const formTiepNhanBuocHienTai = recordVal?.quyTrinh?.danhSachFormTiepNhan?.find(
					(item) => item.ma === buocHienTai?.maFormTiepNhan,
				);
				const buocFinal =
					buocHienTai?.thongTinTiepNhan && _.isEmpty(buocHienTai.thongTinTiepNhan) !== true
						? buocHienTai
						: buocDaTiepNhan;
				const formFinal =
					buocHienTai.thongTinTiepNhan && _.isEmpty(buocHienTai.thongTinTiepNhan) !== true
						? formTiepNhanBuocHienTai
						: formTiepNhan;
				return (
					<>
						<Tooltip title={intl.formatMessage({ id: 'global.button.chitiet' })}>
							<Button
								onClick={() => {
									setCurrentRecord(recordVal);
									handleSetData(recordVal);
									setDataQuyTrinh(recordVal);
									setVisibleForm(true);
								}}
								type='link'
								icon={<EyeOutlined />}
							/>
						</Tooltip>
						{recordVal.idHoaDon && (
							<Tooltip
								title={
									<div style={{ maxWidth: 100 }}>
										{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.button.thanhtoan' })}
									</div>
								}
							>
								<Button
									onClick={() => {
										getByIdModel(recordVal.idHoaDon);
										setVisibleModal(true);
									}}
									type='link'
									icon={<DollarCircleOutlined />}
								/>
							</Tooltip>
						)}
						{(formKhai?.fileId || formTiepNhan?.fileId) && (
							<Tooltip title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.button.xuatmaudon' })}>
								<Dropdown
									overlay={
										<Menu
											onClick={(val) => {
												if (val.key === 'MAU_DON')
													exportMauDonTheoBuocModel(recordVal._id, buocHienTai.ma, formKhai?.ten ?? '');
												else exportMauTraKetQuaTheoBuocModel(recordVal._id, buocFinal?.ma ?? '', formFinal?.ten ?? '');
											}}
										>
											{formKhai?.fileId && (
												<Menu.Item key={'MAU_DON'}>
													{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.button.maudon' })}
												</Menu.Item>
											)}
											{formFinal?.fileId && (
												<Menu.Item key={'MAU_TRA_KET_QUA'}>
													{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.button.maukq' })}
												</Menu.Item>
											)}
										</Menu>
									}
									placement='bottomLeft'
								>
									<Button loading={loading} type='link' icon={<ExportOutlined />} />
								</Dropdown>
							</Tooltip>
						)}
						{buocHienTai?.laBuocCuoi &&
							recordVal?.daTraKetQua === false &&
							buocHienTai?.trangThaiTiepNhan === TrangThaiTiepNhan.DA_DUYET && (
								<Tooltip
									title={
										<div style={{ maxWidth: 100 }}>
											{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.button.traketqua' })}
										</div>
									}
								>
									<Button
										loading={loading}
										onClick={() => {
											traKetQuaModel(recordVal._id, getData);
										}}
										type='link'
										icon={<CheckOutlined />}
									/>
								</Tooltip>
							)}
					</>
				);
			},
		},
	];

	const handleDownloadMauDon = async () => {
		try {
			if (selectedIds && selectedIds?.length > 0) {
				formWaiting('Hệ thống đang xử lý');
				await Promise.all(
					selectedIds?.map((val) => {
						const dataDon = danhSach?.find((item) => item?._id === val);
						const buocHienTai = dataDon?.danhSachBuocXuLy?.[dataDon?.danhSachBuocXuLy?.length - 1];
						const formKhai = dataDon?.quyTrinh?.danhSachFormKhaiBao?.find(
							(item) => item.ma === buocHienTai?.maFormKhaiBao,
						);

						return exportMauDonTheoBuocModel(val, buocHienTai?.ma ?? '', formKhai?.ten ?? '');
					}),
				).then((res) => {});
			}
		} catch (e) {
			console.log(e);
		} finally {
			Modal.destroyAll();
		}
	};

	const handleDownloadMauDonTiepNhan = async () => {
		try {
			if (selectedIdsMauTiepNhan && selectedIdsMauTiepNhan?.length > 0) {
				formWaiting('Hệ thống đang xử lý');
				await Promise.all(
					selectedIdsMauTiepNhan?.map((val: string) => {
						const dataDon = danhSach?.find((item) => item?._id === val);

						const buocHienTai = dataDon?.danhSachBuocXuLy?.[dataDon?.danhSachBuocXuLy?.length - 1];
						const buocDaTiepNhan = dataDon?.danhSachBuocXuLy?.find(
							(item) => item?.maFormTiepNhan && item?.thongTinTiepNhan,
						);
						const formKhai = dataDon?.quyTrinh?.danhSachFormKhaiBao?.find(
							(item) => item.ma === buocHienTai?.maFormKhaiBao,
						);
						const buocFinal =
							buocHienTai?.thongTinTiepNhan && _.isEmpty(buocHienTai.thongTinTiepNhan) !== true
								? buocHienTai
								: buocDaTiepNhan;

						return exportMauTraKetQuaTheoBuocModel(val, buocFinal?.ma ?? '', formKhai?.ten ?? '');
					}),
				).then((res) => {});
			}
		} catch (e) {
			console.log(e);
		} finally {
			Modal.destroyAll();
		}
	};

	useEffect(() => {
		return () => {
			setDataQuyTrinh(undefined);
			setLoaiTinhTrangDon(ELoaiTinhTrangDon.TAT_CA);
		};
	}, []);
	return (
		<>
			<TableBase
				rowSelection
				detailRow={{
					getCheckboxProps: (rec: KhaiBaoQuyTrinh.IRecord) => {
						const buocHienTai = rec?.danhSachBuocXuLy?.[rec?.danhSachBuocXuLy?.length - 1];
						const buocDaTiepNhan = rec?.danhSachBuocXuLy?.find(
							(item) => item?.maFormTiepNhan && item?.thongTinTiepNhan,
						);
						const formKhai = rec?.quyTrinh?.danhSachFormKhaiBao?.find((item) => item.ma === buocHienTai?.maFormKhaiBao);
						const formTiepNhan = rec?.quyTrinh?.danhSachFormTiepNhan?.find(
							(item) => item.ma === buocDaTiepNhan?.maFormTiepNhan,
						);

						const formTiepNhanBuocHienTai = rec?.quyTrinh?.danhSachFormTiepNhan?.find(
							(item) => item.ma === buocHienTai?.maFormTiepNhan,
						);
						const formFinal =
							buocHienTai.thongTinTiepNhan && _.isEmpty(buocHienTai.thongTinTiepNhan) !== true
								? formTiepNhanBuocHienTai
								: formTiepNhan;
						return {
							disabled: formKhai?.fileId || formFinal?.fileId ? false : true,
							name: rec.name,
						};
					},
					selectedRowKeys: [...(selectedIds || []), ...(selectedIdsMauTiepNhan || [])],
					onChange: (selectedRowKeys: string[], data: KhaiBaoQuyTrinh.IRecord[]) => {
						const idMauDon: string[] = [];
						const idMauTiepNhan: string[] = [];
						data.map((rec) => {
							const buocHienTai = rec?.danhSachBuocXuLy?.[rec?.danhSachBuocXuLy?.length - 1];

							const buocDaTiepNhan = rec?.danhSachBuocXuLy?.find(
								(item) => item?.maFormTiepNhan && item?.thongTinTiepNhan,
							);
							const formKhai = rec?.quyTrinh?.danhSachFormKhaiBao?.find(
								(item) => item.ma === buocHienTai?.maFormKhaiBao,
							);
							const formTiepNhan = rec?.quyTrinh?.danhSachFormTiepNhan?.find(
								(item) => item.ma === buocDaTiepNhan?.maFormTiepNhan,
							);

							const formTiepNhanBuocHienTai = rec?.quyTrinh?.danhSachFormTiepNhan?.find(
								(item) => item.ma === buocHienTai?.maFormTiepNhan,
							);
							const formFinal =
								buocHienTai.thongTinTiepNhan && _.isEmpty(buocHienTai.thongTinTiepNhan) !== true
									? formTiepNhanBuocHienTai
									: formTiepNhan;

							if (formKhai?.fileId) {
								idMauDon.push(rec._id);
							}
							if (formFinal?.fileId) {
								idMauTiepNhan.push(rec._id);
							}
						});
						setSelectedIds(idMauDon);
						setSelectedIdsMauTiepNhan(idMauTiepNhan);
					},
				}}
				hideCard
				otherProps={{ size: 'small' }}
				title={
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div>{title}</div>
						<div>
							{type === 'tiep_nhan' && (
								<Button
									size='small'
									type={'primary'}
									onClick={() => {
										setVisibleTiepNhanNhieuDon(true);
									}}
								>
									{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.button.tiepnhan' })}
								</Button>
							)}
						</div>
					</div>
				}
				modelName={'quytrinh.khaibaoquytrinh'}
				columns={columns}
				getData={getData}
				dependencies={[
					page,
					limit,
					condition,
					loaiTinhTrangDon,
					quyTrinhSelect?._id,
					maBuoc,
					dotQuyTrinhId,
					trangThaiTiepNhan,
				]}
				destroyModal
				buttons={{ create: false }}
				otherButtons={[
					<>
						{/*<SelectQuyTrinhChuyenVien*/}
						{/*	style={{ width: 250 }}*/}
						{/*	allowClear*/}
						{/*	onChange={(val: any) => {*/}
						{/*		const obj = dataQuyTrinh?.find((item) => item?._id === val);*/}
						{/*		setCurentQuyTrinhSelect(obj);*/}
						{/*	}}*/}
						{/*	loaiXuLyDon={type}*/}
						{/*/>*/}
						<SelectDotKhaiBao
							size={'small'}
							style={{ width: 170 }}
							idQuyTrinh={quyTrinhSelect?._id ?? ''}
							onChange={(val: any) => {
								setDotQuyTrinhId(val);
							}}
						/>
						{/* <Select
              size={'small'}
							placeholder={'Chọn bước'}
							style={{ width: 220 }}
							allowClear
							onChange={(val) => {
								setMaBuoc(val?.toString());
							}}
							notFoundContent={quyTrinhSelect?.danhSachBuocXuLy ? 'Không có dữ liệu' : 'Vui lòng chọn quy trình trước'}
							options={quyTrinhSelect?.danhSachBuocXuLy?.map((val) => {
								return {
									value: val?.ma,
									label: val?.ten,
								};
							})}
						/> */}
						<Select
							size={'small'}
							placeholder={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.select.trangthai' })}
							style={{ width: 220 }}
							allowClear
							onChange={(val) => {
								settrangThaiTiepNhan(val);
							}}
							options={Object.values(TrangThaiTiepNhanDon)?.map((val) => {
								return {
									value: val,
									label: val,
								};
							})}
						/>
						<DatePicker.RangePicker
							size={'small'}
							allowClear
							onChange={(val) => {
								setCondition({
									...condition,
									createdAt: val
										? {
												$gte: toISOString(val[0]),
												$lte: toISOString(val[1]),
											}
										: undefined,
								});
							}}
							format={'DD/MM/YYYY'}
							placeholder={['Từ ngày', 'đến ngày']}
						/>
						{selectedIds && selectedIds?.length > 0 && (
							<Button
								type='primary'
								size={'small'}
								icon={<ExportOutlined />}
								onClick={() => {
									handleDownloadMauDon();
								}}
							>
								{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.button.xuatmaudon' })} ({selectedIds?.length})
							</Button>
						)}
						{selectedIdsMauTiepNhan && selectedIdsMauTiepNhan?.length > 0 && (
							<Button
								type='primary'
								size={'small'}
								icon={<ExportOutlined />}
								onClick={() => {
									handleDownloadMauDonTiepNhan();
								}}
							>
								{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.button.xuatmauketqua' })} (
								{selectedIdsMauTiepNhan?.length})
							</Button>
						)}
					</>,
				]}
			>
				<Tabs
					style={{ marginTop: -16 }}
					onChange={(val: any) => {
						setLoaiTinhTrangDon(val as ELoaiTinhTrangDon);
						setCondition({
							...condition,
							danhSachBuocXuLy: [ELoaiTinhTrangDon.CAN_XU_LY, ELoaiTinhTrangDon.TAT_CA].includes(val)
								? undefined
								: ({ $elemMatch: { laBuocCuoi: true, trangThaiTiepNhan: TrangThaiTiepNhan.DA_DUYET } } as any),
							daTraKetQua: [ELoaiTinhTrangDon.CAN_XU_LY, ELoaiTinhTrangDon.TAT_CA].includes(val)
								? undefined
								: val === ELoaiTinhTrangDon.DA_TRA_KET_QUA,
						});
					}}
				>
					{Object.values(ELoaiTinhTrangDon)?.map((val) => <Tabs.TabPane tab={val} key={val} />)}
				</Tabs>
			</TableBase>
			<Modal
				zIndex={100}
				title={record?.quyTrinh?.ten}
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				width={1200}
				footer={null}
			>
				{current && (
					<View
						modalName={'quytrinh.khaibaoquytrinh'}
						dataQuyTrinh={currentRecord}
						current={current}
						type={type}
						getData={getData}
					/>
				)}
			</Modal>
			<Modal
				title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.button.tiepnhan' })}
				open={visibleTiepNhanNhieuDon}
				onCancel={() => setVisibleTiepNhanNhieuDon(false)}
				width={800}
				destroyOnClose
				footer={null}
			>
				<FormTiepNhanNhieuDon
					handleCancel={() => {
						setVisibleTiepNhanNhieuDon(false);
						getData();
					}}
				/>
			</Modal>

			<Modal
				open={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				styles={{ body: { padding: 0 } }}
				width={1000}
				destroyOnClose
			>
				{recordChiTietThu?._id ? <ThongTinThanhToan setVisible={setVisibleModal} /> : null}
			</Modal>
			<Modal
				footer={null}
				styles={{ body: { padding: 0 } }}
				width={1200}
				open={visibleModalSinhVien}
				onCancel={() => setVisibleModalSinhVien(false)}
				zIndex={101}
			>
				<ModalSinhVien />
			</Modal>
		</>
	);
};
export default TableTiepNhanDieuPhoi;
