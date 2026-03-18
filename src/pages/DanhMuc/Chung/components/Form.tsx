import type { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import { ELoaiDanhMucNCKH } from '@/services/QuyTrinhDong/DanhMuc/constants';
import type { DanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/typings';
import { EPhanHe, MapKeyPhanHe } from '@/services/QuyTrinhDong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ArrowDownOutlined, ArrowUpOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Radio, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDanhMucChung = (props: { getData: any; maModule: ELoaiDanhMucChung }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('quytrinh.danhmuc');

	const loaiDanhMucNckh = Form.useWatch('loaiDanhMucNckh', form) || ELoaiDanhMucNCKH.TUY_BIEN;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id)
			form.setFieldsValue({
				...record,
				loaiDanhMucNckh: record?.loaiDanhMucNckh ?? ELoaiDanhMucNCKH.TUY_BIEN,
			});
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DanhMucChung.IRecord) => {
		const payload = {
			...values,
			maModule: props.maModule,
		};

		if (edit) {
			putModel(record?._id ?? '', payload, props.getData);
		} else postModel(payload, props.getData);
	};

	return (
		<Card
			title={intl.formatMessage({
				id: edit ? 'chinhsach.formdanhmucchung.chinhsua' : 'chinhsach.formdanhmucchung.themmoi',
			})}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					name='maDanhMuc'
					label={intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.ma' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input autoFocus placeholder={intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.ma' })} />
				</Form.Item>

				<Form.Item
					name='loaiDanhMucNckh'
					label={intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.loaidanhmuc' })}
					rules={[...rules.required]}
				>
					<Select
						options={Object.values(ELoaiDanhMucNCKH).map((item) => ({ value: item, label: item }))}
						style={{ width: '100%' }}
						placeholder={intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.loaidanhmuc' })}
					/>
				</Form.Item>
				{loaiDanhMucNckh === ELoaiDanhMucNCKH.NOI_BO && (
					<>
						<Form.Item
							name={'internalPath'}
							rules={[...rules.required, ...rules.text]}
							label={intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.internalpath' })}
						>
							<Input placeholder={intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.giatri.placeholder' })} />
						</Form.Item>
						<Form.Item
							label={intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.phanhe' })}
							name={'phanHe'}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.chonphanhe' })}
								options={Object.values(EPhanHe)?.map((val) => {
									return {
										value: val,
										label: MapKeyPhanHe?.[val],
									};
								})}
							/>
						</Form.Item>
						<Form.Item name={'sendSsoId'} rules={[...rules.required]} label='Lấy thông tin cá nhân'>
							<Radio.Group
								options={[
									{ label: intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.co' }), value: true },
									{ label: intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.khong' }), value: false },
								]}
							/>
						</Form.Item>
					</>
				)}
				{loaiDanhMucNckh === ELoaiDanhMucNCKH.TUY_BIEN && (
					<>
						<div style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
							<div style={{ marginRight: 4, color: '#ff4d4f' }}>*</div>
							<div>{intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.danhsachgiatri' })}</div>
						</div>
						<Form.List
							name='danhSachGiaTri'
							rules={[
								{
									validator: async (_, danhSachGiaTri) => {
										if (!danhSachGiaTri || danhSachGiaTri.length < 1) {
											return Promise.reject(
												new Error(intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.error' })),
											);
										}
									},
								},
							]}
						>
							{(fields, { add, remove, move }, { errors }) => (
								<>
									{fields.map((field, index) => (
										<div key={field.key}>
											<Form.Item label={''} required={false} key={field.key}>
												<Form.Item
													{...field}
													name={[index, 'value']}
													validateTrigger={['onChange', 'onBlur']}
													rules={[...rules.required, ...rules.text]}
													noStyle
												>
													<Input
														placeholder={intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.giatri.placeholder' })}
														style={{ width: '80%' }}
													/>
												</Form.Item>

												<Button icon={<CloseOutlined />} type='link' danger onClick={() => remove(field.name)} />

												<Button
													disabled={index === 0}
													icon={<ArrowUpOutlined />}
													type='link'
													onClick={() => move(index, index - 1)}
												/>

												<Button
													disabled={index === fields.length - 1}
													icon={<ArrowDownOutlined />}
													type='link'
													onClick={() => move(index, index + 1)}
												/>
											</Form.Item>
										</div>
									))}
									<Form.Item>
										<Button type='dashed' onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
											{intl.formatMessage({ id: 'chinhsach.formdanhmucchung.id.themgiatri' })}
										</Button>

										<Form.ErrorList errors={errors} />
									</Form.Item>
								</>
							)}
						</Form.List>
					</>
				)}

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: !edit ? 'global.button.themmoi' : 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDanhMucChung;
