import { primaryColor } from '@/services/base/constant';
import { EChiSoSoSanh, EDoiTuongTheChat, EMucDanhGiaTheChat } from '@/services/TienIch/TheChat/constant';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Row, Select, Space, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDanhMucTheChat = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title } = props;
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('tienich.thechat.danhmuc');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				batBuoc: false,
				suDungThietBiNgoaiVi: false,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: TheChat.IDanhMucTheChat) => {
		if (edit) {
			await putModel(record?._id ?? '', values);
		} else {
			await postModel(values);
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item name='ma' label='Mã tiêu chí' rules={[...rules.required]}>
							<Input placeholder='Nhập mã tiêu chí' />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item name='ten' label='Tên tiêu chí' rules={[...rules.required]}>
							<Input placeholder='Nhập tên tiêu chí' />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item name='donViDoLuong' label='Đơn vị đo' rules={[...rules.required]}>
							<Input placeholder='Nhập đơn vị đo' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='soSanh' label='So sánh' rules={[...rules.required]}>
							<Select
								placeholder='Chọn so sánh'
								options={Object.values(EChiSoSoSanh).map((item) => ({
									label: item,
									value: item,
								}))}
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='moTa' label='Ghi chú' rules={[...rules.text]}>
							<Input placeholder='Ghi chú bổ sung (nếu có)...' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='batBuoc' valuePropName='checked'>
							<Checkbox>Bắt buộc thực hiện tiêu chí</Checkbox>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='suDungThietBiNgoaiVi' valuePropName='checked'>
							<Checkbox>Sử dụng thiết thị ngoại vi</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<Card type='inner' title='Danh sách tiêu chuẩn' style={{ backgroundColor: '#fafafa', marginTop: 8 }}>
					<Form.List
						name='tieuChiTheChat'
						rules={[
							{
								validator: async (_, value) => {
									if (!value || value.length < 1) {
										return Promise.reject(new Error('Cần ít nhất 1 tiêu chuẩn thể chất'));
									}
								},
							},
						]}
					>
						{(fields, { add, remove }, { errors }) => (
							<>
								<Space direction='vertical' style={{ width: '100%', marginBottom: 12 }} size='middle'>
									{fields.map((field, index) => (
										<Card
											key={field.key}
											size='small'
											style={{
												backgroundColor: '#ffffff',
												border: '1px solid #e8e8e8',
												borderRadius: 6,
												position: 'relative',
											}}
											extra={
												<Tooltip title='Xóa tiêu chuẩn'>
													<Button
														danger
														type='text'
														icon={<DeleteOutlined />}
														onClick={() => remove(field.name)}
														size='small'
													/>
												</Tooltip>
											}
											title={
												<Space>
													<span style={{ color: '#1890ff', fontWeight: 600 }}>Tiêu chuẩn #{index + 1}</span>
												</Space>
											}
										>
											<Row gutter={[12, 0]}>
												<Col span={24} md={12} lg={6}>
													<Form.Item label='Độ tuổi' name={[field.name, 'doTuoi']} rules={[...rules.required]}>
														<InputNumber style={{ width: '100%' }} placeholder='Nhập độ tuổi' />
													</Form.Item>
												</Col>
												<Col span={24} md={12} lg={6}>
													<Form.Item label='Đối tượng' name={[field.name, 'doiTuong']} rules={[...rules.required]}>
														<Select
															placeholder='Chọn đối tượng'
															options={Object.values(EDoiTuongTheChat).map((item) => ({
																label: item,
																value: item,
															}))}
														/>
													</Form.Item>
												</Col>
												<Col span={24} md={12} lg={6}>
													<Form.Item label='Mức đánh giá' name={[field.name, 'mucDanhGia']} rules={[...rules.required]}>
														<Select
															placeholder='Chọn mức'
															options={Object.values(EMucDanhGiaTheChat).map((item) => ({
																label: item,
																value: item,
															}))}
														/>
													</Form.Item>
												</Col>
												<Col span={24} md={12} lg={6}>
													<Form.Item label='Giá trị' name={[field.name, 'giaTri']} rules={[...rules.required]}>
														<InputNumber style={{ width: '100%' }} placeholder='Nhập giá trị' step={0.1} />
													</Form.Item>
												</Col>
											</Row>
										</Card>
									))}
								</Space>

								<Form.ErrorList errors={errors} />

								<Button
									onClick={() => add()}
									icon={<PlusOutlined />}
									type='dashed'
									block
									style={{
										borderColor: primaryColor,
										color: primaryColor,
									}}
								>
									Thêm tiêu chuẩn
								</Button>
							</>
						)}
					</Form.List>
				</Card>

				<div className='form-footer'>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? intl.formatMessage({ id: 'global.button.themmoi' })
							: intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDanhMucTheChat;
