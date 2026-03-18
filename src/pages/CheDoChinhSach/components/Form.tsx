import { ELoaiBoLoc, ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popover, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import TableCauHinh from './TableCauHinh';

const FormCheDoChinhSach = (props: { getData: any }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { visibleForm, record, formSubmiting, edit, setVisibleForm, putModel, postModel } = useModel(
		'chedochinhsach.chedochinhsach',
	);
	const [formValues, setFormValues] = useState<any>(record);
	const { getAllModel: getAllDanhMucChung, loading: loadingDanhMucChung, danhSach } = useModel('quytrinh.danhmuc');
	const danhSachBoLoc = Form.useWatch('danhSachBoLoc', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else form.setFieldsValue({ ...record });
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...record,
			...values,
		};

		if (edit) {
			putModel(record?._id ?? '', payload, props.getData);
		} else {
			postModel(payload, props.getData);
		}
	};

	return (
		<Card title={intl.formatMessage({ id: edit ? 'chedochinhsach.form.title.sua' : 'chedochinhsach.form.title.them' })}>
			<Form
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				onFinish={onFinish}
				form={form}
				layout='vertical'
			>
				<Form.Item
					name='ten'
					label={intl.formatMessage({ id: 'chedochinhsach.form.ten' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input placeholder={intl.formatMessage({ id: 'chedochinhsach.form.ten' })} />
				</Form.Item>
				<Form.Item
					name='loaiCheDoSinhVien'
					label={intl.formatMessage({ id: 'chedochinhsach.form.loai' })}
					rules={[...rules.required]}
				>
					<Select
						placeholder={intl.formatMessage({ id: 'chedochinhsach.form.loai' })}
						options={Object.values(ELoaiCheDoSinhVien).map((item) => ({ value: item, label: item }))}
					/>
				</Form.Item>

				<div>{intl.formatMessage({ id: 'chedochinhsach.form.danhsachboloc.title' })}</div>
				<Form.List name='danhSachBoLoc'>
					{(fields, { add, remove }, { errors }) => (
						<>
							{fields.map((field, index) => (
								<Card
									style={{ margin: '8px 0px' }}
									key={index}
									size='small'
									title={
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											<div>
												{intl.formatMessage({ id: 'chedochinhsach.form.boloc.title' })} {index + 1}
											</div>
											<div>
												<CloseOutlined className='dynamic-delete-button' onClick={() => remove(field.name)} />
											</div>{' '}
										</div>
									}
								>
									<Row gutter={[8, 0]}>
										<Col span={16}>
											<Form.Item
												{...field}
												rules={[...rules.required]}
												label={intl.formatMessage({ id: 'chedochinhsach.form.boloc.ten' })}
												name={[index, 'ten']}
											>
												<Input placeholder={intl.formatMessage({ id: 'chedochinhsach.form.boloc.ten' })} />
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item
												{...field}
												rules={[...rules.required]}
												label={intl.formatMessage({ id: 'chedochinhsach.form.boloc.loai' })}
												name={[index, 'loai']}
											>
												<Select
													placeholder={intl.formatMessage({ id: 'chedochinhsach.form.boloc.loai' })}
													options={Object.values(ELoaiBoLoc).map((item) => ({ value: item, label: item }))}
												/>
											</Form.Item>
										</Col>
										<Col span={24}>
											<Form.Item
												{...field}
												rules={[...rules.required]}
												label={intl.formatMessage({ id: 'chedochinhsach.form.boloc.path' })}
												name={[index, 'path']}
											>
												<Input placeholder={intl.formatMessage({ id: 'chedochinhsach.form.boloc.path' })} />
											</Form.Item>
										</Col>
										{danhSachBoLoc[index]?.loai === ELoaiBoLoc.MANG && (
											<Col span={24}>
												<Form.Item
													{...field}
													rules={[...rules.required]}
													label={intl.formatMessage({ id: 'chedochinhsach.form.boloc.danhsachgiatri' })}
													name={[index, 'danhSachGiaTri']}
												>
													<Select
														placeholder={intl.formatMessage({ id: 'chedochinhsach.form.boloc.danhsachgiatri' })}
														mode='tags'
													/>
												</Form.Item>
											</Col>
										)}
										{danhSachBoLoc[index]?.loai === ELoaiBoLoc.DANH_MUC && (
											<>
												<Col span={12}>
													<Form.Item
														{...field}
														rules={[...rules.required]}
														label={intl.formatMessage({ id: 'chedochinhsach.form.boloc.mamoduledanhmuc' })}
														name={[index, 'maModule']}
													>
														<Select
															placeholder={intl.formatMessage({
																id: 'chedochinhsach.form.boloc.mamoduledanhmuc.placeholder',
															})}
															options={Object.values(ELoaiDanhMucChung).map((item) => ({ value: item, label: item }))}
														/>
													</Form.Item>
												</Col>
												<Col span={12}>
													<Form.Item
														{...field}
														style={{ marginTop: -10 }}
														rules={[...rules.required]}
														label={
															<span>
																{intl.formatMessage({ id: 'chedochinhsach.form.boloc.danhmuc' })} (
																<Button
																	loading={loadingDanhMucChung}
																	onClick={() => {
																		getAllDanhMucChung(false, undefined, { maModule: danhSachBoLoc[index]?.maModule });
																	}}
																	style={{ padding: 0 }}
																	type='link'
																>
																	{intl.formatMessage({ id: 'chedochinhsach.form.boloc.danhmuc.lammoi' })}
																</Button>
																)
															</span>
														}
														name={[index, 'maDanhMuc']}
													>
														<Select
															showSearch
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
															placeholder={intl.formatMessage({ id: 'chedochinhsach.form.boloc.danhmuc' })}
														/>
													</Form.Item>
												</Col>
											</>
										)}
									</Row>
								</Card>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
									{intl.formatMessage({ id: 'chedochinhsach.form.boloc.them' })}
								</Button>
								<Form.ErrorList errors={errors} />
							</Form.Item>
						</>
					)}
				</Form.List>

				<TableCauHinh form={form} formValues={formValues} />
				{/* <Form.Item
					extra={<div>Để trống nếu muốn hiển thị tất cả các trường thông tin</div>}
					style={{ marginTop: 8 }}
					name='danhSachCotHienThi'
					label='Danh sách cột hiển thị'
				>
					<Select
						allowClear
						options={record?.danhSachCauHinhThongTin?.map((item) => ({ label: item.ten, value: item.ma }))}
						mode='multiple'
						placeholder='Danh sách trường thông tin hiển thị'
					/>
				</Form.Item> */}
				<div className='form-footer' style={{ marginTop: 16 }}>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: !edit ? 'global.button.themmoi' : 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};
export default FormCheDoChinhSach;
