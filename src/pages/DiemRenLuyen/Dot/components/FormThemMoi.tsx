import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import SelectHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/SelectHocKy';
import SelectMauDiemRenLuyen from '@/pages/DiemRenLuyen/BieuMau/components/Select';
import { ELoaiBieuMau } from '@/services/KhaoSat/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormThemMoi = () => {
	const intl = useIntl();
	const { edit, setVisibleForm, formSubmiting, postModel, putModel, record, visibleForm } =
		useModel('diemrenluyen.dot');
	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		try {
			const payload = {
				...values,
				thoiGianTiepNhanMinhChung: {
					thoiGianBatDau: values?.thoiGianTiepNhanMinhChung?.[0],
					thoiGianKetThuc: values?.thoiGianTiepNhanMinhChung?.[1],
				},
				thoiGianSVChamDiem: {
					thoiGianBatDau: values?.thoiGianSVChamDiem?.[0],
					thoiGianKetThuc: values?.thoiGianSVChamDiem?.[1],
				},
				thoiGianCoVanChamDiem: {
					thoiGianBatDau: values?.thoiGianCoVanChamDiem?.[0],
					thoiGianKetThuc: values?.thoiGianCoVanChamDiem?.[1],
				},
				thoiGianBCSChamDiem: {
					thoiGianBatDau: values?.thoiGianBCSChamDiem?.[0],
					thoiGianKetThuc: values?.thoiGianBCSChamDiem?.[1],
				},
				thoiGianPhongCTSVChamDiem: {
					thoiGianBatDau: values?.thoiGianPhongCTSVChamDiem?.[0],
					thoiGianKetThuc: values?.thoiGianPhongCTSVChamDiem?.[1],
				},
				thoiGianKhieuNai: {
					thoiGianBatDau: values?.thoiGianKhieuNai?.[0],
					thoiGianKetThuc: values?.thoiGianKhieuNai?.[1],
				},
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
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id)
			form.setFieldsValue({
				...record,
				thoiGianTiepNhanMinhChung: [
					record?.thoiGianTiepNhanMinhChung?.thoiGianBatDau,
					record?.thoiGianTiepNhanMinhChung?.thoiGianKetThuc,
				],
				thoiGianSVChamDiem: [record?.thoiGianSVChamDiem?.thoiGianBatDau, record?.thoiGianSVChamDiem?.thoiGianKetThuc],
				thoiGianCoVanChamDiem: [
					record?.thoiGianCoVanChamDiem?.thoiGianBatDau,
					record?.thoiGianCoVanChamDiem?.thoiGianKetThuc,
				],
				thoiGianBCSChamDiem: [
					record?.thoiGianBCSChamDiem?.thoiGianBatDau,
					record?.thoiGianBCSChamDiem?.thoiGianKetThuc,
				],
				thoiGianPhongCTSVChamDiem: [
					record?.thoiGianPhongCTSVChamDiem?.thoiGianBatDau,
					record?.thoiGianPhongCTSVChamDiem?.thoiGianKetThuc,
				],
				thoiGianKhieuNai: [record?.thoiGianKhieuNai?.thoiGianBatDau, record?.thoiGianKhieuNai?.thoiGianKetThuc],
			});
	}, [record?._id, visibleForm]);

	return (
		<>
			<Card
				title={
					edit
						? intl.formatMessage({ id: 'diemrenluyen.dot.form.chinhsua' })
						: intl.formatMessage({ id: 'diemrenluyen.dot.form.themmoi' })
				}
			>
				<Form onFinish={onFinish} form={form} layout='vertical'>
					<Row gutter={[12, 0]}>
						<Col span={12}>
							<Form.Item
								name='tenDot'
								label={intl.formatMessage({ id: 'diemrenluyen.dot.form.tendot' })}
								rules={[...rules.required, ...rules.text]}
							>
								<Input placeholder={intl.formatMessage({ id: 'diemrenluyen.dot.form.tendot.place' })} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='kyHoc'
								label={intl.formatMessage({ id: 'diemrenluyen.dot.form.kyhoc' })}
								rules={[...rules.required]}
							>
								<SelectHocKy selectMa />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='thoiGianTiepNhanMinhChung'
								label={intl.formatMessage({ id: 'diemrenluyen.dot.form.tgtiepnhan' })}
								rules={[...rules.required]}
							>
								<MyDateRangePicker
									showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
									format={'HH:mm DD/MM/YYYY'}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='thoiGianSVChamDiem'
								label={intl.formatMessage({ id: 'diemrenluyen.dot.form.tgsvcham' })}
								rules={[...rules.required]}
							>
								<MyDateRangePicker
									showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
									format={'HH:mm DD/MM/YYYY'}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='thoiGianBCSChamDiem'
								label={intl.formatMessage({ id: 'diemrenluyen.dot.form.tgbcscham' })}
								rules={[...rules.required]}
							>
								<MyDateRangePicker
									showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
									format={'HH:mm DD/MM/YYYY'}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name='thoiGianCoVanChamDiem'
								label={intl.formatMessage({ id: 'diemrenluyen.dot.form.tgchunhiem' })}
								rules={[...rules.required]}
							>
								<MyDateRangePicker
									showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
									format={'HH:mm DD/MM/YYYY'}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								name='thoiGianKhieuNai'
								label={intl.formatMessage({ id: 'diemrenluyen.dot.form.tgkhieunai' })}
								rules={[...rules.required]}
							>
								<MyDateRangePicker
									showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}
									format={'HH:mm DD/MM/YYYY'}
								/>
							</Form.Item>
						</Col>

						{/*<Col span={12}>*/}
						{/*	<Form.Item*/}
						{/*		name='thoiGianPhongCTSVChamDiem'*/}
						{/*		label='Thời gian phòng CTSV chấm điểm'*/}
						{/*		rules={[...rules.required]}*/}
						{/*	>*/}
						{/*		<MyDateRangePicker*/}
						{/*			showTime={{ showHour: true, showMinute: true, minuteStep: 15 }}*/}
						{/*			format={'HH:mm DD/MM/YYYY'}*/}
						{/*		/>*/}
						{/*	</Form.Item>*/}
						{/*</Col>*/}
						<Col span={24}>
							<Form.Item
								name='idBieuMau'
								label={intl.formatMessage({ id: 'diemrenluyen.dot.form.bieumau' })}
								rules={[...rules.required]}
							>
								<SelectMauDiemRenLuyen loai={ELoaiBieuMau.CHAM_DIEM_REN_LUYEN} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								name='ghiChu'
								label={intl.formatMessage({ id: 'diemrenluyen.dot.form.ghichu' })}
								rules={[...rules.text]}
							>
								<Input.TextArea
									placeholder={intl.formatMessage({ id: 'diemrenluyen.dot.form.ghichu.place' })}
									rows={3}
								/>
							</Form.Item>
						</Col>
					</Row>

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
export default FormThemMoi;
