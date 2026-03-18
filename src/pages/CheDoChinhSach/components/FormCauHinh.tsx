import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';

import rules from '@/utils/rules';
import { removeVietnameseTones } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Checkbox,
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

import JsonEditor from '@/components/JsonEditor';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';

import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import { EKieuDuLieu, ETextDisplay, MapKeyNameTextDisplay } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { LoaiDefaultValue } from '@/services/QuyTrinhDong/constant';
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
		record,
		setRecord,
	} = useModel('chedochinhsach.chedochinhsach');
	const { getAllModel: getAllDanhMucChung, loading: loadingDanhMucChung, danhSach } = useModel('quytrinh.danhmuc');

	const [kieuDuLieu, setKieuDuLieu] = useState<EKieuDuLieu>(recordCauHinh?.kieuDuLieu ?? EKieuDuLieu.BOOLEAN);
	const [truongThongTinLienQuan, setTruongThongTinLienQuan] = useState<LoaiHinh.TruongThongTin | undefined>(
		record?.danhSachCauHinhThongTin?.find((item: { ma: any }) => item.ma === recordCauHinh?.truongThongTinLienQuan),
	);
	const loaiMacDinh = Form.useWatch('loaiDefaultValue', form);

	const [visibleCot, setVisibleCot] = useState<boolean>(false);
	const [formValues, setFormValues] = useState<any>({});

	useEffect(() => {
		form.setFieldsValue(
			recordCauHinh?.ma && editCauHinh ? recordCauHinh : { ...form, batBuoc: true, laDangMang: false },
		);
	}, [recordCauHinh?.ma]);

	const onFinish = async (values: LoaiHinh.TruongThongTin, isContinue: boolean) => {
		if (!record) return;

		const listMaCauHinh = editCauHinh
			? record.danhSachCauHinhThongTin.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
			: record.danhSachCauHinhThongTin;

		if (listMaCauHinh?.map((item: { ma: any }) => item.ma)?.includes(values?.ma)) {
			message.error(intl.formatMessage({ id: 'chedochinhsach.formcauhinh.eror' }));
			return;
		}

		if (editCauHinh && recordCauHinh) {
			const index = record.danhSachCauHinhThongTin.map((item: { ma: any }) => item.ma).indexOf(recordCauHinh.ma);
			const danhSachCauHinhThongTin = [...record.danhSachCauHinhThongTin];
			danhSachCauHinhThongTin.splice(index, 1, { ...recordCauHinh, ...values });
			setRecord({ ...record, danhSachCauHinhThongTin });
		} else {
			setRecord({
				...record,
				danhSachCauHinhThongTin: [...(record?.danhSachCauHinhThongTin ?? []), { ...recordCauHinh, ...values }],
			});
		}
		message.success(
			intl.formatMessage({
				id: editCauHinh ? 'chedochinhsach.formcauhinh.suasuccess' : 'chedochinhsach.formcauhinh.themmoisuccess',
			}),
		);
		if (isContinue) {
			form.resetFields();
		} else props.onCancel();
	};

	const onCancelFormCot = () => {
		setVisibleCot(false);
	};

	const columns: IColumn<LoaiHinh.Cot>[] = [
		{
			title: intl.formatMessage({ id: 'chedochinhsach.formcauhinh.column.macot' }),
			dataIndex: 'ma',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'chedochinhsach.formcauhinh.column.tencot' }),
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'chedochinhsach.formcauhinh.column.kieudulieu' }),
			align: 'center',
			dataIndex: 'kieuDuLieu',
			width: 60,
		},

		{
			title: intl.formatMessage({ id: 'chedochinhsach.formcauhinh.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec: LoaiHinh.Cot) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.tooltip.chinhsua' })}>
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

					<Tooltip title={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.tooltip.xoa' })}>
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
							title={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.tooltip.confirm.delete' })}
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
			title={intl.formatMessage({
				id: editCauHinh ? 'chedochinhsach.formcauhinh.chinhsua.title' : 'chedochinhsach.formcauhinh.themmoi.title',
			})}
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
					label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.ma' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input placeholder={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.ma' })} />
				</Form.Item>
				<Form.Item
					name='ten'
					label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.ten' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input
						autoFocus
						onChange={(e) => {
							if (!editCauHinh) {
								form.setFieldsValue({ ma: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) });
							}
						}}
						placeholder={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.ten' })}
					/>
				</Form.Item>
				<Form.Item
					name='loaiDefaultValue'
					label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.loaigiatri' })}
				>
					<Select
						showSearch
						allowClear
						placeholder={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.chonloaigiatri' })}
						options={Object?.values(LoaiDefaultValue)?.map((val) => {
							return {
								value: val,
								label: val,
							};
						})}
					/>
				</Form.Item>
				{loaiMacDinh === LoaiDefaultValue.CUSTOM && (
					<Form.Item
						name='customDefaultValue'
						label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.giatrituybien' })}
					>
						<Input placeholder={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.nhapgiatri' })} />
					</Form.Item>
				)}
				{kieuDuLieu === EKieuDuLieu.DOAN_VAN_BAN && (
					<Form.Item
						rules={[...rules.requiredHtml]}
						name='customDefaultValue'
						label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.doanvanban' })}
					>
						<TinyEditor height={350} />
					</Form.Item>
				)}
				{loaiMacDinh === LoaiDefaultValue.THONG_KE_DON_QUY_TRINH && (
					<Form.Item
						label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.cauhinhthongke' })}
						name={'customAggregationArray'}
						rules={[...rules.required, ...rules.json]}
					>
						<JsonEditor />
					</Form.Item>
				)}

				<Form.Item name='readonly' valuePropName='checked'>
					<Checkbox>{intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.chidoc' })}</Checkbox>
				</Form.Item>
				<Form.Item
					name='ghiChu'
					label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.ghichu' })}
					rules={[...rules.text]}
				>
					<Input.TextArea placeholder={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.ghichu' })} />
				</Form.Item>

				<Form.Item
					name='kieuDuLieu'
					label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.kieudulieu' })}
					rules={[...rules.required]}
				>
					<Select
						onChange={(val) => setKieuDuLieu(val)}
						options={Object.values(EKieuDuLieu).map((item) => ({ label: item, value: item }))}
						placeholder={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.kieudulieu' })}
					/>
				</Form.Item>
				<Row gutter={[12, 0]}>
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item
							name='batBuoc'
							label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.batbuoc' })}
							rules={[...rules.required]}
						>
							<Radio.Group
								options={[
									{ value: true, label: intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.co' }) },
									{ value: false, label: intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.khong' }) },
								]}
							/>
						</Form.Item>
					</Col>

					{isAvailableDangMang && (
						<Col span={isAvailableDangMang ? 8 : 12}>
							<Form.Item
								name='laDangMang'
								label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.chophepnhapnhieu' })}
								rules={[...rules.required]}
							>
								<Radio.Group
									options={[
										{ value: true, label: intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.co' }) },
										{ value: false, label: intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.khong' }) },
									]}
								/>
							</Form.Item>
						</Col>
					)}
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item name='colspan' label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.chieurong' })}>
							<InputNumber
								style={{ width: '100%' }}
								min={0}
								max={24}
								placeholder={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.nhapgiatri' })}
							/>
						</Form.Item>
					</Col>
				</Row>
				{kieuDuLieu === EKieuDuLieu.FILE && (
					<>
						<Form.Item
							name='danhSachFileDinhKem'
							label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.filedinhkem' })}
						>
							<UploadFile maxCount={5} />
						</Form.Item>
						<Form.Item
							name='ghiChuFileDinhKem'
							label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.ghichufiledinhkem' })}
						>
							<Input placeholder={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.nhapghichu' })} />
						</Form.Item>
					</>
				)}
				{kieuDuLieu === EKieuDuLieu.TEXT && (
					<Form.Item name='textDisplay' label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.kieuhienthi' })}>
						<Select
							placeholder={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.chonkieuhienthi' })}
							options={Object.values(ETextDisplay).map((item) => ({ value: item, label: MapKeyNameTextDisplay[item] }))}
						/>
					</Form.Item>
				)}
				{kieuDuLieu === EKieuDuLieu.DANHMUC && (
					<Form.Item
						name='maDanhMuc'
						label={
							<span>
								{intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.danhmuc' })} (
								<Button
									loading={loadingDanhMucChung}
									onClick={() => {
										getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.CHE_DO_CHINH_SACH });
									}}
									style={{ padding: 0 }}
									type='link'
								>
									{intl.formatMessage({ id: 'chedochinhsach.formcauhinh.button.lammoi' })}
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
							placeholder={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.danhmuc' })}
						/>
					</Form.Item>
				)}
				{kieuDuLieu === EKieuDuLieu.TABLE && (
					<>
						<div className='ant-descriptions-title' style={{ marginTop: 12, marginBottom: 12 }}>
							{intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.danhsachcot' })}
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
									{intl.formatMessage({ id: 'chedochinhsach.formcauhinh.button.themoi' })}
								</Button>
							</Space>
						</TableStaticData>

						<Form.Item
							extra={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.extra.hienthitatca' })}
							style={{ marginTop: 8 }}
							name='danhSachCotHienThi'
							label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.danhsachcothienthi' })}
							// rules={[...rules.required]}
						>
							<Select
								allowClear
								options={recordCauHinh?.danhSachCot?.map((item: { ten: any; ma: any }) => ({
									label: item.ten,
									value: item.ma,
								}))}
								mode='multiple'
								placeholder={intl.formatMessage({
									id: 'chedochinhsach.formcauhinh.id.danhsachcothienthi',
								})}
							/>
						</Form.Item>
					</>
				)}

				<Form.Item
					name='truongThongTinLienQuan'
					label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.truonglienquan' })}
				>
					<Select
						allowClear
						onChange={(val) => {
							form.setFieldsValue({ giaTriLienQuan: undefined });
							setTruongThongTinLienQuan(record?.danhSachCauHinhThongTin?.find((item: { ma: any }) => item.ma === val));
						}}
						options={record?.danhSachCauHinhThongTin
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({
							id: 'chedochinhsach.formcauhinh.id.truonglienquan',
						})}
					/>
				</Form.Item>
				{truongThongTinLienQuan?.kieuDuLieu ? (
					<FormGiaTriLienQuan truongThongTinLienQuan={truongThongTinLienQuan} />
				) : null}

				<Form.Item name='layDuLieuTu' label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.laydulieutu' })}>
					<Select
						allowClear
						options={record?.danhSachCauHinhThongTin
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({
							id: 'chedochinhsach.formcauhinh.id.laydulieutu',
						})}
					/>
				</Form.Item>

				<Form.Item
					name='truongLayDuLieu'
					label={intl.formatMessage({ id: 'chedochinhsach.formcauhinh.id.truonglaydulieu' })}
					rules={[...rules.text]}
				>
					<Input
						placeholder={intl.formatMessage({
							id: 'chedochinhsach.formcauhinh.id.truonglaydulieu',
						})}
					/>
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: !editCauHinh ? 'global.button.themmoi' : 'global.button.luulai' })}
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
							{intl.formatMessage({ id: 'chedochinhsach.formcauhinh.button.themoi.tieptuc' })}
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
