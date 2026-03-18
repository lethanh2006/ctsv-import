import UploadFile from '@/components/Upload/UploadFile';
import type { HoatDongChung } from '@/services/HoatDongChung/typings';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { inputFormat } from '@/utils/utils';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDuToanKinhPhi = (props: { onCancel: any; record?: HoatDongChung.IDuToanKinhPhi; edit: boolean }) => {
	const intl = useIntl();
	const [form] = Form.useForm();

	const { setRecord, record } = useModel('hoatdongchung');

	const soLuongNguoi: number = useWatch('soLuongNguoi', form);
	const soLuongNgay: number = useWatch('soLuongNgay', form);
	const soLuongKhac: number = useWatch('soLuongKhac', form);
	const dinhMuc: number = useWatch('dinhMuc', form);

	useEffect(() => {
		form.setFieldsValue(props.edit ? props.record : form);
	}, [props.record, props.edit]);

	const onFinish = async (values: any) => {
		const tepDinhKem = await buildUpLoadMultiFile(values, 'tepDinhKem');
		const payload = {
			...values,
			tepDinhKem,
		};
		const danhSachDuToanKinhPhi = [...(record?.danhSachDuToanKinhPhi ?? [])];
		if (props.edit) danhSachDuToanKinhPhi.splice(props?.record?.index ? props.record.index - 1 : 0, 1, payload);
		else danhSachDuToanKinhPhi.push(payload);
		setRecord({
			...record,
			danhSachDuToanKinhPhi,
		} as any);
		props.onCancel();
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<>
					<Col xs={24}>
						<Form.Item
							name='hoatDong'
							label={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.hd' })}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.hd.place' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='donViTinh' label={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.dvt' })}>
							<Input placeholder={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.dvt.place' })} />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item
							name='soLuongNguoi'
							label={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.sl' })}
						>
							<InputNumber
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.sl.place' })}
								min={0}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item
							name='soLuongNgay'
							label={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.slngay' })}
						>
							<InputNumber
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.slngay.place' })}
								min={0}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item
							name='soLuongKhac'
							label={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.slkhac' })}
						>
							<InputNumber
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.slkhac.place' })}
								min={0}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='dinhMuc'
							label={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.dinhmuc' })}
							rules={[...rules.required]}
						>
							<InputNumber
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.dinhmuc.place' })}
								min={0}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item label={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.thanhtien' })}>
							<Input
								value={
									dinhMuc ? inputFormat((soLuongNguoi ?? 1) * (soLuongNgay ?? 1) * (soLuongKhac ?? 1) * dinhMuc) : 0
								}
								disabled
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							label={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.tiendo' })}
							name='tienDoHoanThanh'
						>
							<Input placeholder={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.tiendo.place' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.chungtu' })}
							name='chungTuYeuCau'
						>
							<Input.TextArea
								placeholder={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.chungtu.place' })}
								rows={3}
							/>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.tepdinhdem' })}
							name='tepDinhKem'
						>
							<UploadFile maxCount={5} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='ghiChu' label={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.ghichu' })}>
							<Input.TextArea
								placeholder={intl.formatMessage({ id: 'tuansinhhoatcongdan.form.dutoan.form.ghichu.place' })}
								rows={3}
							/>
						</Form.Item>
					</Col>
				</>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{!props.edit
						? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
						: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
				</Button>
				<Button onClick={() => props.onCancel()}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormDuToanKinhPhi;
