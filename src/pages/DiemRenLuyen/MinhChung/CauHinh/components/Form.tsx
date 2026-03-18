import TableDanhMucDiemQuyDoi from '@/pages/DiemRenLuyen/MinhChung/CauHinh/components/TableDanhMucDiemQuyDoi';
import {
	EDoiTuongNhap,
	ELoaiMinhChung,
	MapEDoiTuongNhap,
	MapELoaiMinhChung,
} from '@/services/DiemRenLuyen/MinhChung/MauDon/constants';
import type { QuyTrinh } from '@/services/FormDong/QuyTrinh/typing';
import rules from '@/utils/rules';
import { removeVietnameseTones } from '@/utils/utils';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import TableCauHinh from './MauDon/TableCauHinh';

const FormThemMoiBieuMau = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { recordMauDon, setRecordMauDon } = useModel('formdong.formdong');
	const { edit, formSubmiting, setVisibleForm, setFormValues, formValues, postModel, putModel, record } = useModel(
		'diemrenluyen.minhchung.cauhinh',
	);
	const isDanhMucDiemQuyDoi = Form.useWatch('isDanhMucDiemQuyDoi', form);
	const dungChoSuKien = Form.useWatch('dungChoSuKien', form);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			danhSachCauHinhMinhChung: recordMauDon?.cauHinhLoaiHinh ?? [],
		};

		if (edit) {
			putModel(
				record?._id ?? '',
				{ ...payload },
				undefined,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			);
		} else {
			postModel({ ...payload }, undefined, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }));
		}
	};

	useEffect(() => {
		if (edit && record) {
			form.setFieldsValue({
				...record,
				isDuyetMacDinh: record?.isDuyetMacDinh ?? false,
				choPhepNhieuMinhChung: record?.choPhepNhieuMinhChung ?? false,
			});
			setRecordMauDon({ cauHinhLoaiHinh: record?.danhSachCauHinhMinhChung ?? [] } as QuyTrinh.IMauDon);
		} else {
			form.setFieldsValue({
				isDanhMucDiemQuyDoi: false,
				dungChoSuKien: false,
				isDuyetMacDinh: false,
				choPhepNhieuMinhChung: false,
			});
			setRecordMauDon({} as QuyTrinh.IMauDon);
		}
	}, [edit, record]);

	return (
		<>
			<Card
				title={
					edit
						? intl.formatMessage({ id: 'minhchung.form.chinhsua' })
						: intl.formatMessage({ id: 'minhchung.form.themmoi' })
				}
			>
				<Form
					onValuesChange={(changedValues, values) => {
						setFormValues(values);
					}}
					onFinish={onFinish}
					form={form}
					layout='vertical'
				>
					<Row gutter={[12, 0]}>
						<Col span={12}>
							<Form.Item
								name='tenMinhChung'
								label={intl.formatMessage({ id: 'minhchung.form.tenminhchung' })}
								rules={[...rules.required, ...rules.text]}
							>
								<Input
									onChange={(e) => {
										if (!edit)
											form.setFieldsValue({ maMinhChung: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) });
									}}
									placeholder={intl.formatMessage({ id: 'minhchung.form.tenminhchung.place' })}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='maMinhChung'
								label={intl.formatMessage({ id: 'minhchung.form.maminhchung' })}
								rules={[...rules.required, ...rules.text]}
							>
								<Input placeholder={intl.formatMessage({ id: 'minhchung.form.maminhchung.place' })} disabled={edit} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='doiTuongNhap'
								label={intl.formatMessage({ id: 'minhchung.form.doituong' })}
								rules={[...rules.required]}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'minhchung.form.doituong.place' })}
									mode={'multiple'}
									options={Object.values(EDoiTuongNhap)?.map((val) => ({
										value: val,
										label: MapEDoiTuongNhap?.[val as EDoiTuongNhap],
									}))}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='loaiMinhChung'
								label={intl.formatMessage({ id: 'minhchung.form.loai' })}
								rules={[...rules.required]}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'minhchung.form.loai.place' })}
									options={Object.values(ELoaiMinhChung)?.map((val) => ({
										value: val,
										label: MapELoaiMinhChung?.[val as ELoaiMinhChung],
									}))}
								/>
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item name='dungChoSuKien' label={intl.formatMessage({ id: 'minhchung.form.dungsk' })}>
								<Select
									onChange={(val) => {
										if (val === true) {
											form.setFieldsValue({
												isDanhMucDiemQuyDoi: false,
											});
										}
									}}
									options={[
										{
											value: true,
											label: intl.formatMessage({ id: 'minhchung.form.dungsk.option1' }),
										},
										{
											value: false,
											label: intl.formatMessage({ id: 'minhchung.form.dungsk.option2' }),
										},
									]}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='isDanhMucDiemQuyDoi' label={intl.formatMessage({ id: 'minhchung.form.danhmuc' })}>
								<Select
									disabled={dungChoSuKien}
									options={[
										{
											value: true,
											label: intl.formatMessage({ id: 'minhchung.form.danhmuc.option1' }),
										},
										{
											value: false,
											label: intl.formatMessage({ id: 'minhchung.form.danhmuc.option2' }),
										},
									]}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='isDuyetMacDinh' label={intl.formatMessage({ id: 'minhchung.form.tudongduyet' })}>
								<Select
									options={[
										{
											value: true,
											label: intl.formatMessage({ id: 'minhchung.form.tudongduyet.option1' }),
										},
										{
											value: false,
											label: intl.formatMessage({ id: 'minhchung.form.tudongduyet.option2' }),
										},
									]}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='choPhepNhieuMinhChung'
								label={intl.formatMessage({ id: 'minhchung.form.chophepnhiemchung' })}
							>
								<Select
									options={[
										{
											value: true,
											label: intl.formatMessage({ id: 'minhchung.form.chophepnhiemchung.option1' }),
										},
										{
											value: false,
											label: intl.formatMessage({ id: 'minhchung.form.chophepnhiemchung.option2' }),
										},
									]}
								/>
							</Form.Item>
						</Col>
						{isDanhMucDiemQuyDoi && !dungChoSuKien && (
							<>
								<Col span={24}>
									<Form.Item
										name={'tenDanhMucQuyDoi'}
										label={intl.formatMessage({ id: 'minhchung.form.tendanhmucquydoi' })}
										rules={[...rules.required, ...rules.text]}
									>
										<Input placeholder={intl.formatMessage({ id: 'minhchung.form.tendanhmucquydoi.place' })} />
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item
										name={'danhMucDiemQuyDoi'}
										label={intl.formatMessage({ id: 'minhchung.form.danhmucquydoi' })}
									>
										<TableDanhMucDiemQuyDoi formProps={form} />
									</Form.Item>
								</Col>
							</>
						)}
						{!isDanhMucDiemQuyDoi && (
							<Col span={12}>
								<Form.Item
									name='diemQuyDoi'
									label={intl.formatMessage({ id: 'minhchung.form.diemquydoi' })}
									rules={[...rules.required]}
								>
									<InputNumber
										style={{ width: '100%' }}
										placeholder={intl.formatMessage({ id: 'minhchung.form.diemquydoi.place' })}
									/>
								</Form.Item>
							</Col>
						)}
						<Col span={24} md={12}>
							<Form.Item name='dungChoBanCanSuLop' valuePropName='checked'>
								<Checkbox>{intl.formatMessage({ id: 'minhchung.form.bcs' })}</Checkbox>
							</Form.Item>
						</Col>
					</Row>

					<TableCauHinh form={form} formValues={formValues} />

					<div className='form-footer' style={{ marginTop: 16 }}>
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit
								? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
								: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
						</Button>
						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			</Card>
		</>
	);
};

export default FormThemMoiBieuMau;
