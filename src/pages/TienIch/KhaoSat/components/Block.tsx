import { ELoaiCauHoiPublic, mapLoaiCauHoi } from '@/services/TienIch/constant';
import rules from '@/utils/rules';
import { ArrowDownOutlined, ArrowUpOutlined, CloseOutlined, CopyOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Tooltip, message, type FormInstance } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import BlockQuestion from './BlockQuestion';
import SingleChoice from './QuestionType/SingleChoice';

const Block = (props: { field: { name: number; key: number; isListField?: boolean }; form: FormInstance }) => {
	const intl = useIntl();
	const [data, setData] = useState<any[]>([]);
	const danhGia: boolean = Form.useWatch(['danhSachKhoi', props.field.name, 'isDanhGiaChuanDauRa'], props.form);
	const loai: ELoaiCauHoiPublic = Form.useWatch(['danhSachKhoi', props.field.name, 'cauHinh', 'loai'], props.form);

	const renderInput = (options: number[]) =>
		loai === ELoaiCauHoiPublic.RENDER_INPUT_RATING ? (
			<InputNumber
				placeholder={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.nhapso' })}
				style={{ width: '100%' }}
			/>
		) : (
			<Select placeholder={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.chon' })}>
				{options.map((item) => (
					<Select.Option key={item} value={item}>
						{item}
					</Select.Option>
				))}
			</Select>
		);

	return (
		<>
			<Form.Item
				name={[props.field.name, 'tieuDe']}
				label={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.tieude' })}
			>
				<Input placeholder={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.tieude.place' })} />
			</Form.Item>
			<Form.Item
				name={[props.field.name, 'moTa']}
				label={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.mota' })}
			>
				<Input.TextArea
					rows={2}
					placeholder={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.mota.place' })}
				/>
			</Form.Item>

			{danhGia ? (
				<>
					<Form.Item
						name={[props.field.name, 'cauHinh', 'loai']}
						label={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.loai' })}
						rules={[...rules.required]}
					>
						<Select
							placeholder={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.loai.place' })}
							options={Object.values([
								ELoaiCauHoiPublic.SINGLE_CHOICE,
								ELoaiCauHoiPublic.MULTIPLE_CHOICE,
								ELoaiCauHoiPublic.TEXT,
								ELoaiCauHoiPublic.NUMERIC_RANGE,
								ELoaiCauHoiPublic.RENDER_INPUT_RATING,
							]).map((item) => ({
								value: item,
								label: mapLoaiCauHoi[item],
							}))}
						/>
					</Form.Item>

					{[ELoaiCauHoiPublic.NUMERIC_RANGE, ELoaiCauHoiPublic.RENDER_INPUT_RATING].includes(loai) && (
						<Row gutter={[12, 0]}>
							<Col span={12}>
								<Form.Item
									name={[props.field.name, 'cauHinh', 'gioiHanDuoiTuyenTinh']}
									rules={rules.required}
									label={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.tu' })}
								>
									{renderInput([0, 1])}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name={[props.field.name, 'cauHinh', 'gioiHanTrenTuyenTinh']}
									label={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.den' })}
									rules={[...rules.required]}
								>
									{renderInput([2, 3, 4, 5, 6, 7, 8, 9, 10])}
								</Form.Item>
							</Col>
						</Row>
					)}

					{[ELoaiCauHoiPublic.SINGLE_CHOICE, ELoaiCauHoiPublic.MULTIPLE_CHOICE].includes(loai) && (
						<Form.List
							name={[props.field.name, 'cauHinh', 'luaChon']}
							rules={[
								{
									validator: async (_: unknown, values: { noiDung?: string; dung?: boolean }[]) => {
										if (!values || values.length < 1) {
											return Promise.reject(
												new Error(intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.validapan' })),
											);
										}

										return Promise.resolve();
									},
								},
							]}
						>
							{(fields, { add, remove }, { errors }) => (
								<>
									{fields.map((field, index) => (
										<SingleChoice
											index={index}
											remove={remove}
											fieldName={field.name}
											key={field.key}
											form={props.form}
										/>
									))}
									<Form.ErrorList errors={errors} />
									<Button onClick={() => add()} icon={<PlusOutlined />} size='small' type='primary'>
										{intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.themdapan' })}
									</Button>
								</>
							)}
						</Form.List>
					)}
				</>
			) : (
				<Form.List
					name={[props.field.name, 'danhSachCauHoi']}
					rules={[
						{
							validator: async (_, names) => {
								if (!names || names.length < 1) {
									return Promise.reject(
										new Error(intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.valicauhoi' })),
									);
								}
								return '';
							},
						},
					]}
				>
					{(fields, { add, remove, move }, { errors }) => {
						const onCopy = (blockIndex: number, questionIndex: number, fieldName: number) => {
							const fieldsValue = props.form.getFieldsValue();
							const copiedField = fieldsValue.danhSachKhoi?.[blockIndex]?.danhSachCauHoi?.[questionIndex];

							if (copiedField) {
								// Sao chép sâu copiedField để tránh làm thay đổi đối tượng gốc
								const deepCopy = JSON.parse(JSON.stringify(copiedField));

								// Chức năng xóa tất cả các trường _id khỏi bản sao
								const removeIdRecursive = (obj: any) => {
									for (const key in obj) {
										if (key === '_id') {
											delete obj[key];
										} else if (typeof obj[key] === 'object') {
											removeIdRecursive(obj[key]);
										}
									}
								};

								removeIdRecursive(deepCopy);

								add(deepCopy, fieldName + 1);
								message.success(intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.saochepnoti' }));
								setData([
									{
										...deepCopy,
										index: fieldName + 1,
									},
								]);
							}
						};

						return (
							<>
								{fields.map((field, index) => (
									<div key={field.key}>
										<Card
											size='small'
											styles={{ body: { padding: '8px 12px' } }}
											key={field.key}
											title={
												<>
													<div style={{ float: 'left' }}>
														{intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.cauhoi' })} {index + 1}
													</div>
													<Tooltip title={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.xoa' })}>
														<CloseOutlined
															style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
															onClick={() => remove(field.name)}
														/>
													</Tooltip>
													<Tooltip title={intl.formatMessage({ id: 'questionsmanagement.cauhinh.dichuyenlen' })}>
														<ArrowUpOutlined
															style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
															onClick={() => move(field.name, field.name - 1)}
														/>
													</Tooltip>
													<Tooltip title={intl.formatMessage({ id: 'questionsmanagement.cauhinh.dichuyenxuong' })}>
														<ArrowDownOutlined
															style={{ float: 'right', marginTop: 4, marginLeft: 8 }}
															onClick={() => move(field.name, field.name + 1)}
														/>
													</Tooltip>
													<Tooltip title={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.saochep' })}>
														<CopyOutlined
															style={{ float: 'right', marginTop: 4 }}
															onClick={() => onCopy(props.field.name, index, field.name)}
														/>
													</Tooltip>
												</>
											}
										>
											<BlockQuestion index={index} block={props.field.name} initialType={data} form={props.form} />
										</Card>
										<br />
									</div>
								))}

								<Form.Item>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<Button
											type='dashed'
											onClick={() => add()}
											style={{ width: '100%', marginRight: 12 }}
											icon={<PlusOutlined />}
											size='small'
										>
											{intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.themcauhoi' })}
										</Button>
									</div>

									<Form.ErrorList errors={errors} />
								</Form.Item>
							</>
						);
					}}
				</Form.List>
			)}
		</>
	);
};

export default Block;
