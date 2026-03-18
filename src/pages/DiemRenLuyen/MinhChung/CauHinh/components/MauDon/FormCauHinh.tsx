import JsonEditor from '@/components/JsonEditor';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { ELoaiDanhMucChung } from '@/services/FormDong/DanhMuc/constants';
import { EKieuDuLieu, ETextDisplay, MapKeyNameTextDisplay } from '@/services/FormDong/LoaiHinh/constants';
import { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import { LoaiDefaultValue } from '@/services/FormDong/QuyTrinh/constants';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { removeVietnameseTones } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Popover,
	Radio,
	Row,
	Select,
	Space,
	Tooltip,
	message,
} from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormCot from './FormCot';
import FormGiaTriLienQuan from './FormGiaTriLienQuan';

const FormCauHinh = (props: { onCancel: any; dataState?: string; dataSetState?: string }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		setRecordCauHinh,
		formSubmiting,
		loading,
		editCauHinh,
		recordCauHinh,
		setEditCot,
		setRecordCot,
		record: recordQuyTrinh,
	} = useModel('formdong.formdong');
	const { getAllModel: getAllDanhMucChung, loading: loadingDanhMucChung, danhSach } = useModel('quytrinh.danhmuc');
	const model = useModel('formdong.formdong');

	// @ts-ignore
	const recordMauDon = model?.[`${props?.dataState ?? 'recordMauDon'}`];
	// @ts-ignore
	const setRecordMauDon = model?.[`${props?.dataSetState ?? 'setRecordMauDon'}`];
	const [kieuDuLieu, setKieuDuLieu] = useState<EKieuDuLieu>(recordCauHinh?.kieuDuLieu ?? EKieuDuLieu.BOOLEAN);
	const [truongThongTinLienQuan, setTruongThongTinLienQuan] = useState<LoaiHinh.TruongThongTin | undefined>(
		recordMauDon?.cauHinhLoaiHinh?.find((item: { ma: any }) => item.ma === recordCauHinh?.truongThongTinLienQuan),
	);
	const loaiMacDinh = Form.useWatch('loaiDefaultValue', form);
	const maFormLayDefaultValue = Form.useWatch('maFormLayDefaultValue', form);
	const [visibleCot, setVisibleCot] = useState<boolean>(false);
	const [formValues, setFormValues] = useState<any>({});

	useEffect(() => {
		form.setFieldsValue(
			recordCauHinh?.ma && editCauHinh ? recordCauHinh : { ...form, batBuoc: true, laDangMang: false },
		);
	}, [recordCauHinh?.ma]);

	const onFinish = async (values: LoaiHinh.TruongThongTin, isContinue: boolean) => {
		if (!recordMauDon) return;

		const listMaCauHinh = editCauHinh
			? recordMauDon.cauHinhLoaiHinh.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
			: recordMauDon.cauHinhLoaiHinh;

		if (listMaCauHinh?.map((item: { ma: any }) => item.ma)?.includes(values?.ma)) {
			message.error(intl.formatMessage({ id: 'minhchung.error.matontai' }));
			return;
		}

		const danhSachFileDinhKem = (await buildUpLoadMultiFile(values, 'danhSachFileDinhKem')) || [];

		if (editCauHinh && recordCauHinh) {
			const index = recordMauDon.cauHinhLoaiHinh.map((item: { ma: any }) => item.ma).indexOf(recordCauHinh.ma);
			const cauHinhLoaiHinh = [...recordMauDon.cauHinhLoaiHinh];
			cauHinhLoaiHinh.splice(index, 1, { ...recordCauHinh, ...values, danhSachFileDinhKem });
			setRecordMauDon({ ...recordMauDon, cauHinhLoaiHinh });
		} else {
			setRecordMauDon({
				...recordMauDon,
				cauHinhLoaiHinh: [
					...(recordMauDon?.cauHinhLoaiHinh ?? []),
					{ ...recordCauHinh, ...values, danhSachFileDinhKem },
				],
			});
		}
		message.success(
			editCauHinh
				? intl.formatMessage({ id: 'minhchung.message.suathanhcong' })
				: intl.formatMessage({ id: 'minhchung.message.themthanhcong' }),
		);
		if (isContinue) {
			form.resetFields();
			setTruongThongTinLienQuan(undefined);
		} else props.onCancel();
	};

	const onCancelFormCot = () => {
		setVisibleCot(false);
	};

	const columns: IColumn<LoaiHinh.Cot>[] = [
		{
			title: intl.formatMessage({ id: 'minhchung.form.cauhinh.form.macot' }),
			dataIndex: 'ma',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'minhchung.form.cauhinh.form.tencot' }),
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'minhchung.form.cauhinh.form.kieudulieu' }),
			align: 'center',
			dataIndex: 'kieuDuLieu',
			width: 60,
		},

		{
			title: intl.formatMessage({ id: 'minhchung.form.cauhinh.form.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec: LoaiHinh.Cot) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'global.button.chinhsua' })}>
						<Button
							onClick={() => {
								setVisibleCot(true);
								setRecordCot(rec);
								setEditCot(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title={intl.formatMessage({ id: 'global.button.xoa' })}>
						<Popconfirm
							onConfirm={() => {
								if (recordCauHinh) {
									setRecordCauHinh({
										...recordCauHinh,
										danhSachCot: recordCauHinh?.danhSachCot?.filter((item: { ma: string }) => item.ma !== rec.ma),
									});
									form.setFieldsValue({
										danhSachCotHienThi: formValues?.danhSachCotHienThi?.filter((item: string) => item !== rec.ma),
									});
								}
							}}
							title={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.confirm.xoa' })}
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const onSortEnd = (recordTemp: LoaiHinh.Cot, newIndex: number): void => {
		if (!recordCauHinh) return;
		const danhSachCot = recordCauHinh?.danhSachCot?.filter((item: { ma: string }) => item.ma !== recordTemp.ma) ?? [];
		danhSachCot?.splice(newIndex, 0, recordTemp);
		setRecordCauHinh({ ...recordCauHinh, danhSachCot });
	};

	const isAvailableDangMang = [
		EKieuDuLieu.DANHMUC,
		EKieuDuLieu.DECIMAL,
		EKieuDuLieu.NUMBER,
		EKieuDuLieu.TEXT,
		EKieuDuLieu.FILE,
	].includes(kieuDuLieu);

	return (
		<Card
			title={
				editCauHinh
					? intl.formatMessage({ id: 'minhchung.form.cauhinh.form.chinhsua' })
					: intl.formatMessage({ id: 'minhchung.form.cauhinh.form.themmoi' })
			}
		>
			<Form
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				onFinish={(values) => onFinish(values, false)}
				form={form}
				layout='vertical'
			>
				<Form.Item
					name='ma'
					label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.ma' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.ma.place' })} />
				</Form.Item>
				<Form.Item
					name='ten'
					label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.ten' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input
						autoFocus
						onChange={(e) => {
							if (!editCauHinh) {
								form.setFieldsValue({ ma: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) });
							}
						}}
						placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.ten.place' })}
					/>
				</Form.Item>
				{/*<Form.Item name='loaiDefaultValue' label='Loại giá trị mặc định'>*/}
				{/*	<Select*/}
				{/*		showSearch*/}
				{/*		allowClear*/}
				{/*		placeholder={'Chọn loại giá trị'}*/}
				{/*		options={Object?.values(LoaiDefaultValue)?.map((val) => {*/}
				{/*			return {*/}
				{/*				value: val,*/}
				{/*				label: val,*/}
				{/*			};*/}
				{/*		})}*/}
				{/*	/>*/}
				{/*</Form.Item>*/}
				{loaiMacDinh === LoaiDefaultValue.CUSTOM && (
					<Form.Item name='customDefaultValue' label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.giatri' })}>
						<Input placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.giatri.place' })} />
					</Form.Item>
				)}
				{kieuDuLieu === EKieuDuLieu.DOAN_VAN_BAN && (
					<Form.Item
						rules={[...rules.requiredHtml]}
						name='customDefaultValue'
						label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.vanban' })}
					>
						<TinyEditor height={350} />
					</Form.Item>
				)}
				{loaiMacDinh === LoaiDefaultValue.THONG_KE_DON_QUY_TRINH && (
					<Form.Item
						label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.cauhinh' })}
						name={'customAggregationArray'}
						rules={[...rules.required, ...rules.json]}
					>
						<JsonEditor />
					</Form.Item>
				)}
				{loaiMacDinh === LoaiDefaultValue.LAY_TU_KHAI_BAO && (
					<Row gutter={[12, 0]}>
						<Col span={12}>
							<Form.Item
								name='maFormLayDefaultValue'
								label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.laydulieu' })}
								rules={[...rules.required]}
							>
								<Select
									onChange={() => {
										form.setFieldsValue({
											maFieldLayDefaultValue: undefined,
										});
									}}
									placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.laydulieu.place' })}
									options={recordQuyTrinh?.danhSachFormKhaiBao?.map((item) => ({ value: item.ma, label: item.ten }))}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='maFieldLayDefaultValue'
								label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.laytruong' })}
								rules={[...rules.required]}
							>
								<Select
									onChange={(val) => {
										const kieuDuLieuTemp = recordQuyTrinh?.danhSachFormKhaiBao
											?.find((item) => item.ma === maFormLayDefaultValue)
											?.cauHinhLoaiHinh?.find((ele) => ele.ma === val)?.kieuDuLieu;
										form.setFieldsValue({
											kieuDuLieu: kieuDuLieuTemp,
										});
										setKieuDuLieu(kieuDuLieuTemp);
									}}
									placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.laytruong.place' })}
									options={recordQuyTrinh?.danhSachFormKhaiBao
										?.find((item) => item.ma === maFormLayDefaultValue)
										?.cauHinhLoaiHinh?.map((item) => ({ value: item.ma, label: item.ten }))}
								/>
							</Form.Item>
						</Col>
					</Row>
				)}

				{/*<Form.Item name='readonly' valuePropName='checked'>*/}
				{/*	<Checkbox>Chỉ đọc</Checkbox>*/}
				{/*</Form.Item>*/}
				<Form.Item
					name='ghiChu'
					label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.ghichu' })}
					rules={[...rules.text]}
				>
					<Input.TextArea placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.ghichu.place' })} />
				</Form.Item>

				<Form.Item
					name='kieuDuLieu'
					label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.kieudulieu' })}
					rules={[...rules.required]}
				>
					<Select
						onChange={(val) => setKieuDuLieu(val)}
						options={Object.values(EKieuDuLieu).map((item) => ({ label: item, value: item }))}
						placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.kieudulieu.place' })}
					/>
				</Form.Item>
				<Row gutter={[12, 0]}>
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item
							name='batBuoc'
							label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.batbuoc' })}
							rules={[...rules.required]}
						>
							<Radio.Group
								options={[
									{ value: true, label: intl.formatMessage({ id: 'minhchung.value.co' }) },
									{ value: false, label: intl.formatMessage({ id: 'minhchung.value.khong' }) },
								]}
							/>
						</Form.Item>
					</Col>

					{isAvailableDangMang && (
						<Col span={isAvailableDangMang ? 8 : 12}>
							<Form.Item
								name='laDangMang'
								label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.nhieugiatri' })}
								rules={[...rules.required]}
							>
								<Radio.Group
									options={[
										{ value: true, label: intl.formatMessage({ id: 'minhchung.value.co' }) },
										{ value: false, label: intl.formatMessage({ id: 'minhchung.value.khong' }) },
									]}
								/>
							</Form.Item>
						</Col>
					)}
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item name='colspan' label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.chieurong' })}>
							<InputNumber
								style={{ width: '100%' }}
								min={0}
								max={24}
								placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.chieurong.place' })}
							/>
						</Form.Item>
					</Col>
				</Row>
				{kieuDuLieu === EKieuDuLieu.FILE && (
					<>
						<Form.Item
							name='danhSachFileDinhKem'
							label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.file.label' })}
						>
							<UploadFile maxCount={5} />
						</Form.Item>
						<Form.Item
							name='ghiChuFileDinhKem'
							label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.file.ghichu' })}
						>
							<Input placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.file.ghichu.place' })} />
						</Form.Item>
					</>
				)}
				{kieuDuLieu === EKieuDuLieu.TEXT && (
					<Form.Item
						name='textDisplay'
						label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.textdisplay.label' })}
					>
						<Select
							placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.textdisplay.place' })}
							options={Object.values(ETextDisplay).map((item) => ({ value: item, label: MapKeyNameTextDisplay[item] }))}
						/>
					</Form.Item>
				)}
				{kieuDuLieu === EKieuDuLieu.DANHMUC && (
					<Form.Item
						name='maDanhMuc'
						label={
							<span>
								{intl.formatMessage({ id: 'minhchung.form.cauhinh.form.danhmuc.label' })} (
								<Button
									loading={loadingDanhMucChung}
									onClick={() => {
										getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.QUY_TRINH });
									}}
									style={{ padding: 0 }}
									type='link'
								>
									{intl.formatMessage({ id: 'minhchung.form.cauhinh.form.lammoi' })}
								</Button>
								)
							</span>
						}
						rules={[...rules.required]}
					>
						<Select
							options={danhSach.map((item) => ({
								label: (
									<Popover
										placement='left'
										content={() => {
											return (
												<div>
													{item.danhSachGiaTri.map((giaTri: { value: string }) => (
														<div key={giaTri.value}>- {giaTri.value}</div>
													))}
												</div>
											);
										}}
									>
										{item.maDanhMuc}
									</Popover>
								),
								value: item.maDanhMuc,
							}))}
							placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.danhmuc.place' })}
						/>
					</Form.Item>
				)}
				{kieuDuLieu === EKieuDuLieu.TABLE && (
					<>
						<div className='ant-descriptions-title' style={{ marginTop: 12, marginBottom: 12 }}>
							{intl.formatMessage({ id: 'minhchung.form.cauhinh.form.danhsachcot' })}
						</div>
						<TableStaticData
							onSortEnd={onSortEnd}
							rowSortable
							size='small'
							columns={columns}
							data={recordCauHinh?.danhSachCot ?? []}
							addStt
							hasTotal
							loading={loading}
						>
							<Space wrap>
								<Button
									size='small'
									type='primary'
									icon={<PlusCircleOutlined />}
									onClick={() => {
										setEditCot(false);
										setVisibleCot(true);
										setRecordCot(undefined);
									}}
								>
									{intl.formatMessage({ id: 'global.button.themmoi' })}
								</Button>
							</Space>
						</TableStaticData>

						<Form.Item
							extra={intl.formatMessage({ id: 'minhchung.form.extra.tronghienthitatca' })}
							style={{ marginTop: 8 }}
							name='danhSachCotHienThi'
							label={intl.formatMessage({ id: 'minhchung.form.danhsachcothienthi' })}
							// rules={[...rules.required]}
						>
							<Select
								allowClear
								options={recordCauHinh?.danhSachCot?.map((item: { ten: any; ma: any }) => ({
									label: item.ten,
									value: item.ma,
								}))}
								mode='multiple'
								placeholder={intl.formatMessage({ id: 'minhchung.form.placeholder.danhsachtruonghienthi' })}
							/>
						</Form.Item>
					</>
				)}
				{/* {kieuDuLieu === EKieuDuLieu.DANHSACH && (
					<Form.Item name='LoaiHinhId' label='Loại hình NCKH'>
						{/*<SelectLoaiHinh />
					</Form.Item>
				)} */}

				<Form.Item
					name='truongThongTinLienQuan'
					label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.truonglienquan.label' })}
				>
					<Select
						allowClear
						onChange={(val) => {
							form.setFieldsValue({ giaTriLienQuan: undefined });
							setTruongThongTinLienQuan(recordMauDon?.cauHinhLoaiHinh?.find((item: { ma: any }) => item.ma === val));
						}}
						options={recordMauDon?.cauHinhLoaiHinh
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.truonglienquan.place' })}
					/>
				</Form.Item>
				{truongThongTinLienQuan?.kieuDuLieu ? (
					<FormGiaTriLienQuan truongThongTinLienQuan={truongThongTinLienQuan} />
				) : null}

				<Form.Item
					name='layDuLieuTu'
					label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.laydulieutu.label' })}
				>
					<Select
						allowClear
						options={recordMauDon?.cauHinhLoaiHinh
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.laydulieutu.place' })}
					/>
				</Form.Item>

				<Form.Item
					name='truongLayDuLieu'
					label={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.truonglaydulieu.label' })}
					rules={[...rules.text]}
				>
					<Input placeholder={intl.formatMessage({ id: 'minhchung.form.cauhinh.form.truonglaydulieu.place' })} />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!editCauHinh
							? intl.formatMessage({ id: 'global.button.themmoi' })
							: intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					{!editCauHinh && (
						<Button
							loading={formSubmiting}
							onClick={() => {
								form.validateFields();
								const values = form.getFieldsValue();
								onFinish(values, true);
							}}
							type='primary'
						>
							{intl.formatMessage({ id: 'minhchung.form.cauhinh.form.themmoi.tieptuc' })}
						</Button>
					)}
					<Button onClick={() => props.onCancel()}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
			<Modal
				width={700}
				open={visibleCot}
				destroyOnClose
				footer={null}
				styles={{ padding: 0 }}
				onCancel={onCancelFormCot}
			>
				<FormCot onCancel={onCancelFormCot} />
			</Modal>
		</Card>
	);
};

export default FormCauHinh;
