import JsonEditor from '@/components/JsonEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { ELoaiBoLoc } from '@/services/CheDoSinhVien/constant';
import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';
import {
	ELoaiBieuDoThongKe,
	ELoaiFilterThongKe,
	ELoaiThongKeQuyTrinhDong,
	MapKeyLoaiThongKe,
} from '@/services/QuyTrinhDong/ThongKe/constant';
import type { ThongKeQuyTrinhDong } from '@/services/QuyTrinhDong/ThongKe/typings';
import { buildUpLoadFile } from '@/services/uploadFile';

import rules from '@/utils/rules';
import { renderUrlWithFileId, resetFieldsForm } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popover, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormThongKe = (props: { isQuyTrinh?: boolean; modelName: any }) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(props.modelName);
	const { getAllModel: getAllDanhMucChung, loading: loadingDanhMucChung, danhSach } = useModel('quytrinh.danhmuc');
	const { record: recordQuyTrinh } = useModel('quytrinh.quanlyquytrinh');

	const danhSachFilterThongKe = Form.useWatch('danhSachFilterThongKe', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				aggregationArray: JSON.stringify(record?.aggregationArray ?? {}, undefined, 2),
				fileId: record?.fileId ? renderUrlWithFileId(record.fileId) : undefined,
			});
		} else {
			form.setFieldsValue({
				aggregationArray: undefined,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: ThongKeQuyTrinhDong.IRecord) => {
		const fileId = await buildUpLoadFile(values, 'fileId', undefined, true);

		const payload = {
			...record,
			...values,
			quyTrinhId: props.isQuyTrinh ? recordQuyTrinh?._id : undefined,
			aggregationArray: JSON.parse(values?.aggregationArray),
			danhSachFilterThongKe: values?.danhSachFilterThongKe?.map((item) => ({
				...item,
				loaiFilterThongKe: ELoaiFilterThongKe.TRUONG_THONG_TIN,
			})),
			fileId: fileId ? (typeof fileId === 'string' ? fileId?.split('/')?.pop() : fileId?.data?.data?.file?._id) : null,
		};

		if (edit) {
			putModel(record?._id ?? '', payload);
		} else postModel(payload);
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'mẫu thống kê'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='ma' label='Mã' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Mã' />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='loaiThongKe' label='Loại thống kê' rules={[...rules.required]}>
							<Select
								options={Object.values(ELoaiThongKeQuyTrinhDong).map((item) => ({
									value: item,
									label: MapKeyLoaiThongKe[item],
								}))}
								placeholder='Loại thống kê'
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='ten' label='Tên' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Tên' />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='loaiBieuDoThongKe' label='Loại biểu đồ thống kê' rules={[...rules.required]}>
							<Select
								options={Object.values(ELoaiBieuDoThongKe).map((item) => ({
									value: item,
									label: item,
								}))}
								placeholder='Loại biểu đồ thống kê'
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item label='Cấu hình biểu mẫu' name={'aggregationArray'} rules={[...rules.required, ...rules.json]}>
							<JsonEditor />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={'Mẫu xuất dữ liệu'} name={'fileId'}>
							<UploadFile
								maxCount={1}
								accept='.docx'
								otherProps={{
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div>Danh sách bộ lọc</div>
				<Form.List name='danhSachFilterThongKe'>
					{(fields, { add, remove }, { errors }) => (
						<>
							{fields.map((field, index) => (
								<Card
									style={{ margin: '8px 0px' }}
									key={index}
									size='small'
									title={
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											<div>Bộ lọc {index + 1}</div>
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
												label={'Tên bộ lọc'}
												name={[index, 'tenThongKe']}
											>
												<Input placeholder='Tên bộ lọc' />
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item {...field} rules={[...rules.required]} label='Loại bộ lọc' name={[index, 'loai']}>
												<Select
													placeholder='Loại bộ lọc'
													options={Object.values(ELoaiBoLoc).map((item) => ({ value: item, label: item }))}
												/>
											</Form.Item>
										</Col>
										<Col span={24}>
											<Form.Item
												{...field}
												rules={[...rules.required]}
												label={'Path'}
												name={[index, 'truongThongTinThongKe']}
											>
												<Input placeholder='Path' />
											</Form.Item>
										</Col>
										{danhSachFilterThongKe[index]?.loai === ELoaiBoLoc.MANG && (
											<Col span={24}>
												<Form.Item
													{...field}
													rules={[...rules.required]}
													label='Danh sách giá trị'
													name={[index, 'danhSachGiaTri']}
												>
													<Select placeholder='Danh sách giá trị' mode='tags' />
												</Form.Item>
											</Col>
										)}
										{danhSachFilterThongKe[index]?.loai === ELoaiBoLoc.DANH_MUC && (
											<>
												<Col span={12}>
													<Form.Item
														{...field}
														rules={[...rules.required]}
														label='Mã Module danh mục'
														name={[index, 'maModule']}
													>
														<Select
															placeholder='Mã module'
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
																Danh mục (
																<Button
																	loading={loadingDanhMucChung}
																	onClick={() => {
																		getAllDanhMucChung(false, undefined, {
																			maModule: danhSachFilterThongKe[index]?.maModule,
																		});
																	}}
																	style={{ padding: 0 }}
																	type='link'
																>
																	Làm mới
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
															placeholder='Danh mục'
														/>
													</Form.Item>
												</Col>
											</>
										)}

										{/* <Form.Item
										{...field}
										rules={[...rules.required]}
										label='Loại bộ lọc'
										name={[index, 'loaiFilterThongKe']}
									>
										<Select
											placeholder='Loại bộ lọc'
											options={Object.values(ELoaiFilterThongKe).map((item) => ({ value: item, label: item }))}
										/>
									</Form.Item>
									{danhSachFilterThongKe?.[index]?.loaiFilterThongKe === ELoaiFilterThongKe.TRUONG_THONG_TIN && (
										<Form.Item
											{...field}
											rules={[...rules.required]}
											label={'Trường thông tin thống kê'}
											name={[index, 'truongThongTinThongKe']}
										>
											<Input placeholder='Trường thông tin thống kê' />
										</Form.Item>
									)} */}
									</Row>
								</Card>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
									Thêm bộ lọc
								</Button>
								<Form.ErrorList errors={errors} />
							</Form.Item>
						</>
					)}
				</Form.List>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThongKe;
