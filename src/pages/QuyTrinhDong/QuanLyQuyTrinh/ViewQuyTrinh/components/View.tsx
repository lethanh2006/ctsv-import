import TinyEditor from '@/components/TinyEditor';
import SelectVanBan from '@/pages/QuyTrinhDong/QuanLyVanBan/Select';
import {
	ETienDoQuyTrinh,
	MapColorTienDoQuyTrinh,
	MapColorTrangThaiTiepNhanDon,
	TrangThaiTiepNhanDon,
} from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/constants';
import { chuyenVienDieuPhoiDon } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/khaibaoquytrinh';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/typings';
import { EKieuDuLieu } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import { checkRuleXuLyDon } from '@/services/QuyTrinhDong/quytrinh';
import { chuyenVienTiepNhanDuyet } from '@/services/QuyTrinhDong/TiepNhanDeuPhoi/donquytrinh';
import type { QuyTrinh } from '@/services/QuyTrinhDong/typings';
import rules from '@/utils/rules';
import { CheckOutlined, CloseOutlined, LeftOutlined, PrinterOutlined, UndoOutlined } from '@ant-design/icons';
import { Button, Card, Col, Collapse, Form, Input, Modal, Row, Select, Spin, Steps, Tag, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import ViewDot from '../../components/DotQuyTrinh/ViewDot';
import FormRender from '../../components/MauDon/FormRender';
import FormInHoSo from './FormInHoSo';
import ThongTinTiepNhan from './thongTinTiepNhan';
import ViewFromCauHinh from './ViewFromCauHinh';

const { TextArea } = Input;
const { Step } = Steps;
interface Iprops {
	dataQuyTrinh: KhaiBaoQuyTrinh.IRecord;
	current: KhaiBaoQuyTrinh.IBuocXuLy;
	initStep?: number;
	handleClickHoanThien?: () => void;
	loadingForm?: boolean;
	modalName?: any;
	FormModal?: React.FC;
	formProps?: any;
	type?: 'dieu_phoi' | 'tiep_nhan';
	getData?: (id?: string) => void;
}
const View = (props: Iprops) => {
	const intl = useIntl();
	const { dataQuyTrinh, current, loadingForm, modalName, FormModal, formProps, type, getData } = props;
	const model = useModel(modalName);
	// const { record: recordQuyTrinh } = useModel('quanlykhoahoc.quytrinh.quytrinh');
	const {
		setCurrent,
		visibleFormKhaiBaoQuyTrinh,
		setVisibleFormKhaiBaoQuyTrinh,
		setCurrentFormKhaiBao,
		setVisibleForm,
		setEditFormKhaiBao,
		setRecordFormKhaiBao,
		currentFormKhaiBao,
	} = model;
	const [form] = Form.useForm();
	const { danhSach: danhSachDotQuyTrinh } = useModel('quytrinh.dotquytrinh');
	const { setRecordQuyTrinhForm, recordQuyTrinhForm } = useModel('quytrinh.quanlyquytrinh');
	const [visibleViewDetailDot, setVisibleViewDetailDot] = useState<boolean>(false);
	const { danhSach: danhSachDanhMuc } = useModel('quytrinh.danhmuc');
	const { getAllModel, setVisibleForm: setVisibleModalSinhVien, loading } = useModel('daotaov2.sinhvien.sinhvien');
	const { initialState } = useModel('@@initialState');
	const {
		exportMauDonTheoBuocModel,
		exportMauTraKetQuaTheoBuocModel,
		loading: loadingExport,
	} = useModel('quytrinh.khaibaoquytrinh');

	// const { setRecord: setRecordSanPham } = useModel('quanlykhoahoc.sanphamnckh');
	const [danhSachDonViXuLy, setDanhSachDonViXuLy] = useState<KhaiBaoQuyTrinh.IDonViXuLy[]>([]);
	const [currentTypeDuyet, setCurrentTypeDuyet] = useState<TrangThaiTiepNhanDon>(TrangThaiTiepNhanDon.DUYET);
	const [visibleDuyet, setVisibleDuyet] = useState<boolean>(false);
	const [loadngDuyet, setLoadingDuyet] = useState<boolean>(false);
	const [loadingDieuPhoi, setLoadingDieuPhoi] = useState<boolean>(false);
	const [visibleDieuPhoi, setVisibleDieuPhoi] = useState<boolean>(false);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [formValues, setFormValues] = useState<any>({});
	const [loadingCheckValidate, setLoadingValidate] = useState<boolean>(false);
	const [rulesXuLy, setRulesXuLy] = useState<boolean>(false);
	const [isPrint, setIsPrint] = useState<boolean>(false);
	const [visibleFormPrint, setVisibleFormPrint] = useState(false);
	const [fixedCurrent, setFixedCurrent] = useState<number | undefined>(0);
	const buocHienTai = dataQuyTrinh?.danhSachBuocXuLy?.[dataQuyTrinh?.danhSachBuocXuLy?.length - 1];
	const formKhai = dataQuyTrinh?.quyTrinh?.danhSachFormKhaiBao?.find((item) => item.ma === buocHienTai?.maFormKhaiBao);
	const formTiepNhan = dataQuyTrinh?.quyTrinh?.danhSachFormTiepNhan?.find(
		(item) => item.ma === buocHienTai?.maFormTiepNhan,
	);

	const dotCurrent = danhSachDotQuyTrinh?.find((item) => item._id === dataQuyTrinh?.dotQuyTrinhId);
	const cauHinhThoiGianDotBuocHienTai = dotCurrent?.danhSachCauHinhThoiGianDot?.find(
		(item: { maBuoc: string }) => item.maBuoc === current.ma,
	);
	const maFormTiepNhan = dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.find(
		(item) => item?.ma === current?.ma,
	)?.maFormTiepNhan;
	const dataFormTiepNhan = dataQuyTrinh?.quyTrinh?.danhSachFormTiepNhan?.find(
		(item) => item?.ma === maFormTiepNhan,
	)?.cauHinhLoaiHinh;
	const currentBoPhanXuLy = dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.find(
		(item: { ma: string }) => item?.ma === current?.maBoPhanXuLy,
	);

	const onChange = (val: number) => {
		setCurrentStep(val);
	};

	const handleCheckRule = async () => {
		try {
			setLoadingValidate(true);
			const res = await checkRuleXuLyDon(currentBoPhanXuLy);
			if (res) {
				setRulesXuLy(res?.data?.data);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingValidate(false);
		}
	};

	const handleSubmitDieuPhoi = async (values: any) => {
		try {
			setLoadingDieuPhoi(true);
			const payload = {
				maBuoc: current?.ma,
				maBoPhanXuLy: values?.maBoPhanXuLy,
			};
			const res = await chuyenVienDieuPhoiDon(dataQuyTrinh?._id, payload);
			if (res) {
				message.success('Điều phối thành công');
				setVisibleDieuPhoi(false);
				if (isPrint && formKhai?.fileId && formTiepNhan?.fileId) {
					setVisibleFormPrint(true);
				} else if (isPrint && formKhai?.fileId) {
					await exportMauDonTheoBuocModel(dataQuyTrinh._id, buocHienTai.ma, formKhai?.ten ?? '');
				} else if (isPrint && formTiepNhan?.fileId) {
					await exportMauTraKetQuaTheoBuocModel(dataQuyTrinh._id, buocHienTai.ma, formTiepNhan?.ten ?? '');
				} else {
					setVisibleForm(false);
				}

				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				getData && getData(dataQuyTrinh?._id);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingDieuPhoi(false);
		}
	};

	const handleSubmitDon = async (values: any) => {
		try {
			setLoadingDuyet(true);
			const val = { ...values };
			delete val.ghiChu;
			delete val.maVanBan;
			const valuesFinal: any = {};
			const valuesForm = { ...val };
			Object.keys(valuesForm).map((item) => {
				const cauHinh = dataFormTiepNhan?.find((ele: { ma: string }) => ele.ma === item);
				const isDanhMuc = cauHinh?.kieuDuLieu === EKieuDuLieu.DANHMUC;
				const isDate = cauHinh?.kieuDuLieu === EKieuDuLieu.DATE;
				const isMonth = cauHinh?.kieuDuLieu === EKieuDuLieu.MONTH;

				valuesFinal[item?.includes('table||') ? item.replace('table||', '') : item] = {
					value: item?.includes('table||')
						? recordQuyTrinhForm?.thongTinKhaiBao?.[item.replace('table||', '')]
						: valuesForm[item],
					info: isDanhMuc
						? danhSachDanhMuc
								?.find((ele) => ele.maDanhMuc === cauHinh.maDanhMuc)
								?.danhSachGiaTri?.find((ele) => ele.value === valuesForm[item])?.info
						: undefined,
				};

				if (isDate || isMonth) {
					valuesFinal[`${item}Date`] = { value: dayjs(valuesForm[item]).format(isDate ? 'DD/MM/YYYY' : 'MM/YYYY') };
				}
			});

			const payload = {
				maBuoc: current?.ma,
				trangThaiTiepNhan: currentTypeDuyet,
				ghiChu: values?.ghiChu ?? '',
				maVanBan: values?.maVanBan ?? '',
				thongTinTiepNhan: { ...valuesFinal },
				// maBoPhanXuLyBuocSau: 'string',
			};

			const res = await chuyenVienTiepNhanDuyet(dataQuyTrinh?._id, payload);
			if (res) {
				message.success('Xử lý thành công');
				setVisibleDuyet(false);
				setVisibleForm(false);
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				getData && getData();
				setRecordQuyTrinhForm(undefined);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingDuyet(false);
		}
	};

	const renderDescription = (value: any, tienDo?: ETienDoQuyTrinh, isBuocNgoaiHeThong?: boolean) => {
		if (isBuocNgoaiHeThong) {
			return (
				<div>
					{tienDo && (
						<div style={{ marginBottom: 8 }}>
							<Tag color={MapColorTienDoQuyTrinh[tienDo]}>{tienDo}</Tag>
						</div>
					)}
				</div>
			);
		}
		if (value) {
			return (
				<>
					<div style={{ marginBottom: 8 }}>
						<Tag color={MapColorTrangThaiTiepNhanDon?.[value?.trangThaiTiepNhan as TrangThaiTiepNhanDon] ?? 'yellow'}>
							{value?.trangThaiTiepNhan}
						</Tag>
					</div>
					{/* <div style={{ marginBottom: 8 }}>
						<Tag color={value?.coKhaiBao ? '#1fba36' : '#ffca2c'}>
							{value?.coKhaiBao ? 'Đã thực hiện' : 'Chưa thực hiện'}
						</Tag>
					</div> */}
					{tienDo && (
						<div style={{ marginBottom: 8 }}>
							<Tag color={MapColorTienDoQuyTrinh[tienDo]}>{tienDo}</Tag>
						</div>
					)}
				</>
			);
		} else {
			return (
				<>
					<div style={{ marginBottom: 8 }}>
						<Tag color={'gray'}>{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.chuadonbuoc' })}</Tag>
					</div>
					{tienDo && (
						<div style={{ marginBottom: 8 }}>
							<Tag color={MapColorTienDoQuyTrinh[tienDo]}>{tienDo}</Tag>
						</div>
					)}
				</>
			);
		}

		// }
	};

	useEffect(() => {
		if (dataQuyTrinh && type === 'dieu_phoi') {
			const currentBuocXuLy = dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.find(
				(item: { ma: any }) => item?.ma === current?.ma,
			);
			if (currentBuocXuLy) {
				const arr: KhaiBaoQuyTrinh.IDonViXuLy[] = [];
				dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.map((val: KhaiBaoQuyTrinh.IDonViXuLy) => {
					if (currentBuocXuLy?.danhSachMaBoPhanXuLy?.includes(val?.ma)) {
						arr.push(val);
					}
				});
				setDanhSachDonViXuLy(arr);
			}
		}
		setCurrentStep(dataQuyTrinh?.danhSachBuocXuLy?.length - 1);
	}, [dataQuyTrinh]);

	useEffect(() => {
		if (current) {
			const arr = dataQuyTrinh?.quyTrinh?.danhSachFormKhaiBao;
			const obj = arr?.find((item: { ma: any }) => item?.ma === current?.maFormKhaiBao);
			setCurrentFormKhaiBao(obj);
			if (current?.trangThaiTiepNhan === TrangThaiTiepNhanDon.CHINH_SUA_LAI) {
				const dataFormKhaiBao = dataQuyTrinh?.danhSachKhaiBao?.find((ele) => ele.ma === current.maFormKhaiBao);
				const valuesFormKhaiBao: any = {};
				Object.keys(dataFormKhaiBao?.thongTinKhaiBao).map((key) => {
					valuesFormKhaiBao[key] = dataFormKhaiBao?.thongTinKhaiBao[key]?.value;
				});
				setRecordQuyTrinhForm({ ...dataFormKhaiBao, thongTinKhaiBao: valuesFormKhaiBao });
				setRecordFormKhaiBao(valuesFormKhaiBao);
				setEditFormKhaiBao(true);
			}
			if (currentBoPhanXuLy) handleCheckRule();
		}
	}, [current]);

	const cauHinhForm: QuyTrinh.IMauDon = currentFormKhaiBao;
	const dataForm = dataQuyTrinh?.danhSachKhaiBao?.find((ele) => ele.ma === current.maFormKhaiBao);

	return (
		<>
			<Card title={<div>{dataQuyTrinh?.quyTrinh?.ten}</div>} variant='borderless'>
				<Spin spinning={type ? false : loadingForm}>
					{!type && (
						<Button
							style={{ marginBottom: 16 }}
							icon={<LeftOutlined />}
							type={'link'}
							onClick={() => {
								history.push('/quan-ly-khoa-hoc/khai-bao-quy-trinh');
							}}
						>
							{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.quaylai' })}
						</Button>
					)}

					<Row gutter={[16, 16]}>
						<Col xs={24} sm={24} md={6} lg={6} xl={6}>
							<Steps size='small' direction={'vertical'} current={currentStep} onChange={onChange}>
								{dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.map((value) => {
									const cauHinhThoiGianDot = dotCurrent?.danhSachCauHinhThoiGianDot?.find(
										(item: { maBuoc: string }) => item.maBuoc === value.ma,
									);

									let tienDo;
									const coKhaiBao = dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma)?.coKhaiBao;

									if (cauHinhThoiGianDot && dayjs().isAfter(dayjs(cauHinhThoiGianDot.thoiGianKetThuc)) && !coKhaiBao) {
										tienDo = ETienDoQuyTrinh.QUA_HAN;
									} else if (
										cauHinhThoiGianDot &&
										dayjs(cauHinhThoiGianDot.thoiGianBatDau).isBefore(dayjs()) &&
										dayjs().isBefore(cauHinhThoiGianDot.thoiGianKetThuc)
									) {
										tienDo = ETienDoQuyTrinh.DANG_DIEN_RA;
									} else if (
										cauHinhThoiGianDot &&
										dayjs().isBefore(dayjs(cauHinhThoiGianDot.thoiGianBatDau)) &&
										dayjs(cauHinhThoiGianDot.thoiGianBatDau).diff(dayjs(), 'days') === 7
									) {
										tienDo = ETienDoQuyTrinh.SAP_TOI;
									} else if (cauHinhThoiGianDot && dayjs().isAfter(dayjs(cauHinhThoiGianDot.thoiGianKetThuc))) {
										tienDo = ETienDoQuyTrinh.DA_DIEN_RA;
									}

									return (
										<Step
											key={value.ten}
											description={renderDescription(
												dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma),
												tienDo,
												cauHinhThoiGianDot?.tuDongChuyenBuocKhiHetHan,
											)}
											disabled={dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma) === undefined}
											title={
												<div>
													{value.ten}{' '}
													{cauHinhThoiGianDot && (
														<b>
															({dayjs(cauHinhThoiGianDot?.thoiGianBatDau).format('DD/MM/YYYY')} -{' '}
															{dayjs(cauHinhThoiGianDot?.thoiGianKetThuc).format('DD/MM/YYYY')})
														</b>
													)}
												</div>
											}
											onClick={() => {
												const obj = dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma);
												if (obj) {
													setCurrent(obj);
												}
												// setCurrent(value);
											}}
										/>
									);
								})}
							</Steps>
						</Col>

						<Col xs={24} sm={24} md={18} lg={18} xl={18}>
							<ThongTinTiepNhan
								isBuocNgoaiHeThong={cauHinhThoiGianDotBuocHienTai?.tuDongChuyenBuocKhiHetHan}
								data={current as KhaiBaoQuyTrinh.IBuocXuLy}
								modelName={modalName}
							/>
							<Collapse ghost defaultActiveKey={['viewkhaibao']}>
								<Collapse.Panel
									key={'viewkhaibao'}
									header={<b>{dataQuyTrinh?.danhSachKhaiBao?.find((ele) => ele.ma === current.maFormKhaiBao)?.ten}</b>}
								>
									<Row gutter={[0, 10]}>
										<ViewFromCauHinh
											cauHinhLoaiHinh={cauHinhForm?.cauHinhLoaiHinh ?? []}
											thongTinKhaiBao={dataForm?.thongTinKhaiBao ?? {}}
										/>
									</Row>
								</Collapse.Panel>
							</Collapse>
						</Col>
						{type === 'tiep_nhan' && (
							<Col xs={24} sm={24} md={24} lg={24} xl={24}>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									{rulesXuLy &&
										((current.danhSachThanhVienXuLy.length &&
											current?.danhSachThanhVienXuLy?.find((item) => item.ssoId === initialState?.currentUser?.ssoId)
												?.ssoId) ||
											!current.danhSachThanhVienXuLy.length) && (
											<>
												<Button
													disabled={
														current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHUA_CO &&
														current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHINH_SUA_LAI &&
														current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.DA_CHINH_SUA_LAI
													}
													style={{ marginRight: 8 }}
													type={'primary'}
													icon={<CheckOutlined />}
													onClick={() => {
														setCurrentTypeDuyet(TrangThaiTiepNhanDon.DUYET);
														setVisibleDuyet(true);
														setIsPrint(false);
														form.setFieldsValue({
															ghiChu: undefined,
															maVanBan: undefined,
														});
													}}
												>
													{current.ten}
												</Button>
												{(formKhai?.fileId || formTiepNhan?.fileId) && (
													<Button
														style={{ marginRight: 8 }}
														loading={loading}
														disabled={
															current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHUA_CO &&
															current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHINH_SUA_LAI &&
															current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.DA_CHINH_SUA_LAI
														}
														type={'primary'}
														icon={<CheckOutlined />}
														onClick={() => {
															setCurrentTypeDuyet(TrangThaiTiepNhanDon.DUYET);
															setVisibleDuyet(true);
															setIsPrint(true);
															setFixedCurrent(currentStep);
															form.setFieldsValue({
																ghiChu: undefined,
																maVanBan: undefined,
															});
														}}
													>
														{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.button.duyetvain' })}
													</Button>
												)}
												{(formKhai?.fileId || formTiepNhan?.fileId) && (
													<Button
														style={{ marginRight: 8 }}
														loading={loading}
														type={'primary'}
														icon={<PrinterOutlined />}
														onClick={() => {
															setCurrentTypeDuyet(TrangThaiTiepNhanDon.DUYET);
															if (formKhai?.fileId && formTiepNhan?.fileId) {
																setVisibleFormPrint(true);
															} else if (formKhai?.fileId) {
																exportMauDonTheoBuocModel(dataQuyTrinh._id, buocHienTai.ma, formKhai?.ten ?? '');
															} else if (formTiepNhan?.fileId) {
																exportMauTraKetQuaTheoBuocModel(
																	dataQuyTrinh._id,
																	buocHienTai.ma,
																	formTiepNhan?.ten ?? '',
																);
															}
														}}
													>
														{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.button.in' })}
													</Button>
												)}

												<Button
													disabled={
														current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHUA_CO &&
														current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHINH_SUA_LAI &&
														current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.DA_CHINH_SUA_LAI
													}
													style={{ marginRight: 8 }}
													icon={<UndoOutlined />}
													onClick={() => {
														setCurrentTypeDuyet(TrangThaiTiepNhanDon.CHINH_SUA_LAI);
														setVisibleDuyet(true);
													}}
												>
													{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.button.yccs' })}
												</Button>
												<Button
													disabled={
														current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHUA_CO &&
														current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHINH_SUA_LAI &&
														current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.DA_CHINH_SUA_LAI
													}
													style={{ marginRight: 8 }}
													danger
													type='primary'
													icon={<CloseOutlined />}
													onClick={() => {
														setCurrentTypeDuyet(TrangThaiTiepNhanDon.KHONG_DUYET);
														setVisibleDuyet(true);
													}}
												>
													{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.button.khongduyet' })}
												</Button>
											</>
										)}

									<Button
										danger
										// type={'primary'}
										icon={<CloseOutlined />}
										onClick={() => {
											setVisibleForm(false);
										}}
									>
										{intl.formatMessage({ id: 'global.button.dong' })}
									</Button>
								</div>
							</Col>
						)}
						{type === 'dieu_phoi' && (
							<Col xs={24} sm={24} md={24} lg={24} xl={24}>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button
										disabled={
											(current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHUA_CO &&
												current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHINH_SUA_LAI) ||
											current?.maBoPhanXuLy
												? true
												: false
										}
										style={{ marginRight: 8 }}
										type={'primary'}
										icon={<CheckOutlined />}
										onClick={() => {
											setVisibleDieuPhoi(true);
										}}
									>
										{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.button.dieuphoi' })}
									</Button>
									<Button
										// danger
										// type={'primary'}
										onClick={() => {
											setVisibleForm(false);
										}}
										icon={<CloseOutlined />}
									>
										{intl.formatMessage({ id: 'global.button.dong' })}
									</Button>
								</div>
							</Col>
						)}
					</Row>
				</Spin>
				{FormModal && (
					<Modal
						title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.khaobao' })}
						open={visibleFormKhaiBaoQuyTrinh}
						onCancel={() => setVisibleFormKhaiBaoQuyTrinh(false)}
						width={1200}
						footer={null}
						destroyOnClose
					>
						<FormModal {...formProps} />
					</Modal>
				)}
				<Modal
					width={700}
					zIndex={100}
					title={
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<div>{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.xulydon' })}</div>
							<Button
								loading={loading}
								onClick={async () => {
									await getAllModel(true, undefined, { ssoId: dataQuyTrinh?.nguoiKhaiBao?.ssoId });
									setVisibleModalSinhVien(true);
								}}
								type='link'
							>
								{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.thongtinsv' })}
							</Button>
						</div>
					}
					open={visibleDuyet}
					onCancel={() => {
						setVisibleDuyet(false);
					}}
					destroyOnClose
					footer={null}
				>
					<Spin spinning={loadngDuyet}>
						<Form
							form={form}
							onFinish={handleSubmitDon}
							layout={'vertical'}
							onValuesChange={(changedValues, values) => {
								setFormValues(values);
							}}
						>
							{type === 'tiep_nhan' && currentTypeDuyet === TrangThaiTiepNhanDon.DUYET && (
								<Row gutter={[12, 0]}>
									{dataFormTiepNhan?.map((item) => {
										return <FormRender form={form} formValues={formValues} key={item.ma} cauHinh={item} />;
									})}
								</Row>
							)}

							<Form.Item
								label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.ghichu' })}
								name={'ghiChu'}
								rules={currentTypeDuyet !== TrangThaiTiepNhanDon.DUYET ? [...rules.requiredHtml] : []}
							>
								<TinyEditor />
							</Form.Item>
							{currentTypeDuyet === TrangThaiTiepNhanDon.DUYET && (
								<Form.Item
									label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.vanban' })}
									name={'maVanBan'}
									rules={currentTypeDuyet !== TrangThaiTiepNhanDon.DUYET ? [...rules.required] : []}
								>
									<SelectVanBan dataState={'ma'} hasCreate />
								</Form.Item>
							)}
							<Form.Item>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
										{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.xacnhan' })}
									</Button>
									<Button
										onClick={() => {
											setVisibleDuyet(false);
										}}
									>
										{intl.formatMessage({ id: 'global.button.dong' })}
									</Button>
								</div>
							</Form.Item>
						</Form>
					</Spin>
				</Modal>
				<Modal
					title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.dieuphoi' })}
					open={visibleDieuPhoi}
					onCancel={() => {
						setVisibleDieuPhoi(false);
					}}
					destroyOnClose
					footer={null}
				>
					<Spin spinning={loadingDieuPhoi}>
						<Form onFinish={handleSubmitDieuPhoi} layout={'vertical'}>
							<Form.Item
								label={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.bophanxuly' })}
								name={'maBoPhanXuLy'}
								rules={[...rules.required]}
							>
								<Select
									style={{ width: '100%' }}
									placeholder={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.bophanxuly.place' })}
									onChange={() => {}}
									options={danhSachDonViXuLy?.map((val) => {
										return {
											value: val?.ma,
											label: val?.ten,
										};
									})}
								/>
							</Form.Item>
							<Form.Item>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
										{intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.xacnhan' })}
									</Button>
									<Button
										onClick={() => {
											setVisibleDieuPhoi(false);
										}}
									>
										{intl.formatMessage({ id: 'global.button.dong' })}
									</Button>
								</div>
							</Form.Item>
						</Form>
					</Spin>
				</Modal>
				<Modal
					footer={
						<Button
							type='primary'
							onClick={() => {
								setVisibleViewDetailDot(false);
							}}
						>
							OK
						</Button>
					}
					styles={{ body: { padding: 0 } }}
					open={visibleViewDetailDot}
					onCancel={() => setVisibleViewDetailDot(false)}
				>
					{dotCurrent && dataQuyTrinh.quyTrinh && <ViewDot recDot={dotCurrent} recQuyTrinh={dataQuyTrinh.quyTrinh} />}
				</Modal>
				<Modal
					destroyOnClose
					footer={null}
					open={visibleFormPrint}
					onCancel={() => {
						setVisibleFormPrint(false);
						setFixedCurrent(undefined);
					}}
					title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.view.in' })}
				>
					<FormInHoSo
						setFixedCurrent={setFixedCurrent}
						fixedCurrent={fixedCurrent}
						currentStep={currentStep}
						handleCancel={() => setVisibleFormPrint(false)}
					/>
				</Modal>
			</Card>
		</>
	);
};
export default View;
