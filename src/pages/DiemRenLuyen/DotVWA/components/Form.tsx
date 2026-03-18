import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import { ELoaiDoiTuongChamDiem, MapKeyNameLoaiDoiTuongChamDiem } from '@/services/DiemRenLuyen/constants';
import rules from '@/utils/rules';
import { toISOString } from '@/utils/utils';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectBieuMau from '../../BieuMau/components/SelectVWA';

const FormDot = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('diemrenluyen.dotvwa');

	useEffect(() => {
		if (record?._id)
			form.setFieldsValue({
				...record,
				thoiGianDot: [dayjs(record.thoiGianBatDau), dayjs(record.thoiGianKetThuc)],
				danhSachDoiTuongChamDiem: record?.danhSachDoiTuongChamDiem?.map((item) => ({
					...item,
					thoiGian: [dayjs(item.thoiGianBatDauCham), dayjs(item.thoiGianKetThucCham)],
				})),
			});
		else form.resetFields();
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...record,
			...values,
			thoiGianBatDau: toISOString(values.thoiGianDot[0]),
			thoiGianKetThuc: toISOString(values.thoiGianDot[1]),
			thoiGianDot: undefined,
			danhSachDoiTuongChamDiem: values?.danhSachDoiTuongChamDiem?.map((item: { thoiGian: any[] }) => ({
				...item,
				thoiGianBatDauCham: item.thoiGian[0],
				thoiGianKetThucCham: item.thoiGian[1],
				thoiGian: undefined,
			})),
		};

		if (edit) {
			putModel(
				record?._id ?? '',
				payload,
				undefined,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(payload, undefined, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then(() => form.resetFields())
				.catch((er) => console.log(er));
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'dotdanhgia.form.chinhsua' })
					: intl.formatMessage({ id: 'dotdanhgia.form.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={24}>
						<Form.Item
							name='maHocKy'
							label={intl.formatMessage({ id: 'dotdanhgia.form.hocky' })}
							rules={[...rules.required]}
						>
							<SelectHocKy selectMa />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='mauDrlId'
							label={intl.formatMessage({ id: 'dotdanhgia.form.maudanhgia' })}
							rules={[...rules.required]}
						>
							<SelectBieuMau />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='thoiGianDot'
							label={intl.formatMessage({ id: 'dotdanhgia.form.thoigian' })}
							rules={[...rules.required]}
						>
							<MyDateRangePicker placeholder={['Từ', 'đến']} format={'DD/MM/YYYY'} />
						</Form.Item>
					</Col>
				</Row>
				<>
					<div style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
						<div style={{ marginRight: 4, color: '#ff4d4f' }}>*</div>
						<div>{intl.formatMessage({ id: 'dotdanhgia.form.danhsach' })}</div>
					</div>
					<Form.List
						name='danhSachDoiTuongChamDiem'
						rules={[
							{
								validator: async (_, danhSachDoiTuongChamDiem) => {
									if (!danhSachDoiTuongChamDiem || danhSachDoiTuongChamDiem.length < 1) {
										return Promise.reject(new Error(intl.formatMessage({ id: 'dotdanhgia.form.danhsach.vali' })));
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
											<Row gutter={[10, 0]}>
												<Col span={8}>
													<Form.Item
														{...field}
														name={[index, 'loaiDoiTuongChamDiem']}
														validateTrigger={['onChange', 'onBlur']}
														rules={[...rules.required, ...rules.text]}
														label={intl.formatMessage({ id: 'dotdanhgia.form.danhsach.loaidoituong' })}
													>
														<Select
															placeholder={intl.formatMessage({ id: 'dotdanhgia.form.danhsach.loaidoituong.place' })}
															options={Object.values(ELoaiDoiTuongChamDiem).map((item) => ({
																value: item,
																label: MapKeyNameLoaiDoiTuongChamDiem[item],
															}))}
														/>
													</Form.Item>
												</Col>
												<Col span={15}>
													<Form.Item
														{...field}
														name={[index, 'thoiGian']}
														validateTrigger={['onChange', 'onBlur']}
														rules={[...rules.required]}
														label={intl.formatMessage({ id: 'dotdanhgia.form.danhsach.thoigianchamdiem' })}
													>
														<MyDateRangePicker format={'HH:mm DD/MM/YYYY'} showTime placeholder={['Từ', 'đến']} />
													</Form.Item>
												</Col>
												<Col span={1}>
													<Form.Item label={' '}>
														<Button
															style={{ marginTop: 8 }}
															icon={<CloseOutlined />}
															type='link'
															danger
															onClick={() => remove(field.name)}
														/>
													</Form.Item>
												</Col>
											</Row>

											<Divider style={{ margin: 4 }} />
										</Form.Item>
									</div>
								))}
								<Form.Item>
									<Button type='dashed' onClick={() => add()} style={{ width: '100%' }} icon={<PlusOutlined />}>
										{intl.formatMessage({ id: 'dotdanhgia.form.danhsach.them' })}
									</Button>

									<Form.ErrorList errors={errors} />
								</Form.Item>
							</>
						)}
					</Form.List>
				</>

				<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
					<Button loading={formSubmiting} style={{ marginRight: 8 }} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button
						onClick={() => {
							setVisibleForm(false);
							form.resetFields();
						}}
					>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default FormDot;
