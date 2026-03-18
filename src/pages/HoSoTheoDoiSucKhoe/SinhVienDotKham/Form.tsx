import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { EPhanLoaiSucKhoe, ETinhTrangSucKhoe, MapKeyNameTinhTrangSuckhoe } from '@/services/DotKhamSuKhoe/constant';
import type { DotKhamSucKhoe } from '@/services/DotKhamSuKhoe/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormSinhVienDotKham = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'hosotheodoisuckhoe.suckhoesinhvien',
	);
	const { record: recDotKhaiBao } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
	const { getData } = props;
	const { danhSach: danhSachSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DotKhamSucKhoe.ISucKhoeSinhVien) => {
		const recSinhVien = danhSachSinhVien.find((item) => item.ssoId === values?.sinhVienSsoId);
		const data = {
			...record,
			...values,
			dotKhamSucKhoeId: recDotKhaiBao?._id ?? '',
			hoTen: recSinhVien?.ten,
			maSinhVien: recSinhVien?.ma,
		};
		if (edit) {
			putModel(
				record?._id ?? '',
				data,
				getData,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(data, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card
			title={
				edit
					? intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.chinhsua' })
					: intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.themmoi' })
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					{/* <Col xs={24}>
						<Form.Item label='Đợt khám sức khỏe'>
							<Input value={recDotKhaiBao?.ten} disabled />
						</Form.Item>
					</Col> */}
					<Col xs={24}>
						<Form.Item
							name='sinhVienSsoId'
							label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.sinhvien' })}
							rules={[...rules.required]}
						>
							<SelectSinhVienDebounce disabled={edit} />
						</Form.Item>
					</Col>

					<Col xs={12}>
						<Form.Item
							rules={[...rules.required, ...rules.text]}
							label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.maxetnghiem' })}
							name='maXetNghiem'
						>
							<Input placeholder={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.maxetnghiem.place' })} />
						</Form.Item>
					</Col>
					<Col xs={12}>
						<Form.Item
							rules={[...rules.required]}
							label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.phanloaisuckhoe' })}
							name='phanLoaiSucKhoe'
						>
							<Select
								options={Object.values(EPhanLoaiSucKhoe).map((item) => ({ value: item, label: item }))}
								placeholder={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.phanloaisuckhoe.place' })}
							/>
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.benhvatat' })} name='benhTat'>
							<Input.TextArea
								placeholder={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.benhvatat.place' })}
							/>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.tuvan' })} name='tuVan'>
							<Input.TextArea placeholder={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.tuvan.place' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.ghichu' })} name='ghiChu'>
							<Input.TextArea placeholder={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.ghichu.place' })} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='tinhTrangSucKhoe'
							label={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.tinhtrangsuckhoe' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'dotkhamsuckhoe.step.dssv.form.tinhtrangsuckhoe.place' })}
								options={Object.values(ETinhTrangSucKhoe).map((item) => ({
									key: item,
									label: MapKeyNameTinhTrangSuckhoe[item],
									value: item,
								}))}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormSinhVienDotKham;
