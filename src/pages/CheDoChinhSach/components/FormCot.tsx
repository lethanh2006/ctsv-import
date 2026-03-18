import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, message, Popover, Radio, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
// import FormGiaTriLienQuan from '@/pages/QuanLyKhoaHocV2/LoaiHinh/components/FormGiaTriLienQuan';
import { EKieuDuLieu, ETextDisplay, MapKeyNameTextDisplay } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import type { LoaiHinh } from '@/services/QuyTrinhDong/LoaiHinh/typing';
import { removeVietnameseTones } from '@/utils/utils';
import _ from 'lodash';
import FormGiaTriLienQuan from './FormGiaTriLienQuan';

const FormCot = (props: { onCancel: any }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { formSubmiting, recordCauHinh, setRecordCauHinh, editCot, recordCot } = useModel(
		'chedochinhsach.chedochinhsach',
	);
	const [truongThongTinLienQuan, setTruongThongTinLienQuan] = useState<LoaiHinh.Cot | undefined>(
		recordCauHinh?.danhSachCot?.find((item: { ma: any }) => item.ma === recordCot?.truongThongTinLienQuan),
	);
	const { getAllModel: getAllDanhMucChung, loading: loadingDanhMucChung, danhSach } = useModel('quytrinh.danhmuc');
	const [kieuDuLieu, setKieuDuLieu] = useState<EKieuDuLieu>(recordCot?.kieuDuLieu ?? EKieuDuLieu.BOOLEAN);

	useEffect(() => {
		if (recordCot?.ma && editCot) form.setFieldsValue(recordCot);
	}, [recordCot?.ma]);

	const onFinish = async (values: LoaiHinh.Cot, isContinue: boolean) => {
		if (editCot && recordCauHinh && recordCot) {
			const index = recordCauHinh.danhSachCot.map((item: { ma: any }) => item.ma).indexOf(recordCot.ma);
			const danhSachCot = [...recordCauHinh.danhSachCot];
			danhSachCot.splice(index, 1, { ...recordCot, ...values });
			setRecordCauHinh({ ...recordCauHinh, danhSachCot });
		} else {
			setRecordCauHinh({
				...(recordCauHinh || {}),
				danhSachCot: [...(recordCauHinh?.danhSachCot ?? []), values],
			} as LoaiHinh.TruongThongTin);
		}
		message.success(
			intl.formatMessage({
				id: editCot ? 'chedochinhsach.formcot.message.suasuccess' : 'chedochinhsach.formcot.message.themmoisuccess',
			}),
		);
		if (isContinue) {
			form.resetFields();
		} else props.onCancel();
	};

	const isAvailableDangMang = [EKieuDuLieu.DANHMUC, EKieuDuLieu.DECIMAL, EKieuDuLieu.NUMBER, EKieuDuLieu.TEXT].includes(
		kieuDuLieu,
	);

	return (
		<Card
			title={intl.formatMessage({
				id: editCot ? 'chedochinhsach.formcot.title.sua' : 'chedochinhsach.formcot.title.them',
			})}
		>
			<Form onFinish={(values) => onFinish(values, false)} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item
							name='ma'
							label={intl.formatMessage({ id: 'chedochinhsach.formcot.ma' })}
							rules={[...rules.required, ...rules.text]}
						>
							<Input placeholder={intl.formatMessage({ id: 'chedochinhsach.formcot.ma' })} />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item
							name='ten'
							label={intl.formatMessage({ id: 'chedochinhsach.formcot.ten' })}
							rules={[...rules.required, ...rules.text]}
						>
							<Input
								onChange={(e) => {
									if (!editCot) form.setFieldsValue({ ma: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) });
								}}
								autoFocus
								placeholder={intl.formatMessage({ id: 'chedochinhsach.formcot.ten' })}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					name='kieuDuLieu'
					label={intl.formatMessage({ id: 'chedochinhsach.formcot.kieudulieu' })}
					rules={[...rules.required]}
				>
					<Select
						onChange={(val) => setKieuDuLieu(val)}
						options={Object.values(EKieuDuLieu)
							.filter((item) => item !== EKieuDuLieu.TABLE)
							.map((item) => ({ label: item, value: item }))}
						placeholder={intl.formatMessage({ id: 'chedochinhsach.formcot.kieudulieu' })}
					/>
				</Form.Item>
				{kieuDuLieu === EKieuDuLieu.DANHMUC && (
					<Form.Item
						name='maDanhMuc'
						label={
							<span>
								{intl.formatMessage({ id: 'chedochinhsach.formcot.danhmuc' })} (
								<Button
									loading={loadingDanhMucChung}
									onClick={() => {
										getAllDanhMucChung(false);
									}}
									style={{ padding: 0 }}
									type='link'
								>
									{intl.formatMessage({ id: 'chedochinhsach.formcot.danhmuc.lammoi' })}
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
										content={
											<div>
												{item.danhSachGiaTri.map((giaTri: { value: string }) => (
													<div key={giaTri.value}>- {giaTri.value}</div>
												))}
											</div>
										}
									>
										{item.maDanhMuc}
									</Popover>
								),
								value: item.maDanhMuc,
							}))}
							placeholder={intl.formatMessage({ id: 'chedochinhsach.formcot.danhmuc' })}
						/>
					</Form.Item>
				)}

				{kieuDuLieu === EKieuDuLieu.TEXT && (
					<Form.Item name='textDisplay' label={intl.formatMessage({ id: 'chedochinhsach.formcot.textdisplay' })}>
						<Select
							placeholder={intl.formatMessage({ id: 'chedochinhsach.formcot.textdisplay.placeholder' })}
							options={Object.values(ETextDisplay).map((item) => ({ value: item, label: MapKeyNameTextDisplay[item] }))}
						/>
					</Form.Item>
				)}

				<Form.Item
					name='truongThongTinLienQuan'
					label={intl.formatMessage({ id: 'chedochinhsach.formcot.truonglienquan' })}
				>
					<Select
						allowClear
						onChange={(val) => {
							form.setFieldsValue({ giaTriLienQuan: undefined });
							setTruongThongTinLienQuan(recordCauHinh?.danhSachCot?.find((item: { ma: any }) => item.ma === val));
						}}
						options={recordCauHinh?.danhSachCot
							?.filter((item: { ma: any }) => item.ma !== recordCot?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({ id: 'chedochinhsach.formcot.truonglienquan' })}
					/>
				</Form.Item>
				{truongThongTinLienQuan?.kieuDuLieu ? (
					<FormGiaTriLienQuan truongThongTinLienQuan={truongThongTinLienQuan} />
				) : null}

				<Form.Item name='layDuLieuTu' label={intl.formatMessage({ id: 'chedochinhsach.formcot.laydulieutu' })}>
					<Select
						allowClear
						options={recordCauHinh?.danhSachCot
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({ id: 'chedochinhsach.formcot.laydulieutu' })}
					/>
				</Form.Item>

				<Form.Item
					name='truongLayDuLieu'
					label={intl.formatMessage({ id: 'chedochinhsach.formcot.truonglaydulieu' })}
					rules={[...rules.text]}
				>
					<Input placeholder={intl.formatMessage({ id: 'chedochinhsach.formcot.truonglaydulieu' })} />
				</Form.Item>

				<Row gutter={[12, 0]}>
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item
							name='batBuoc'
							label={intl.formatMessage({ id: 'chedochinhsach.formcot.batbuoc' })}
							rules={[...rules.required]}
						>
							<Radio.Group
								options={[
									{ value: true, label: intl.formatMessage({ id: 'chedochinhsach.formcot.codk' }) },
									{ value: false, label: intl.formatMessage({ id: 'chedochinhsach.formcot.khongdk' }) },
								]}
							/>
						</Form.Item>
					</Col>
					{isAvailableDangMang && (
						<Col span={8}>
							<Form.Item
								name='laDangMang'
								label={intl.formatMessage({ id: 'chedochinhsach.formcot.dangmang' })}
								rules={[...rules.required]}
							>
								<Radio.Group
									options={[
										{ value: true, label: intl.formatMessage({ id: 'chedochinhsach.formcot.codk' }) },
										{ value: false, label: intl.formatMessage({ id: 'chedochinhsach.formcot.khongdk' }) },
									]}
								/>
							</Form.Item>
						</Col>
					)}
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item name='colspan' label={intl.formatMessage({ id: 'chedochinhsach.formcot.colspan' })}>
							<InputNumber
								style={{ width: '100%' }}
								min={0}
								max={24}
								placeholder={intl.formatMessage({ id: 'chedochinhsach.formcot.colspan.placeholder' })}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: !editCot ? 'global.button.themmoi' : 'global.button.luulai' })}
					</Button>
					{!editCot && (
						<Button
							loading={formSubmiting}
							onClick={() => {
								form.validateFields();
								const values = form.getFieldsValue();
								onFinish(values, true);
							}}
							type='primary'
						>
							{intl.formatMessage({ id: 'chedochinhsach.formcot.button.themvatuchiep' })}
						</Button>
					)}
					<Button onClick={() => props.onCancel()}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCot;
