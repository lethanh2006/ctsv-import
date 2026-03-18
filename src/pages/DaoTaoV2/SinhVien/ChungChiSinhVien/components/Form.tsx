import MyDatePicker from '@/components/MyDatePicker';
import SelectChungChi from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/ChungChi/components/Select';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { EPhuongThucTinhDiem } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormChungChiSinhVien = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, getModel } =
		useModel('daotaov2.sinhvien.chungchi');
	const { danhSach: danhSachChungChi, record: recChungChi, setRecord } = useModel('daotaov2.danhmuc.chungchi');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const { title, fromSinhVien } = props;
	const maChungChi = Form.useWatch('maChungChi', form);

	const getData = () => (fromSinhVien ? getModel({ sinhVienSsoId: recSinhVien?.ssoId }) : getModel());

	useEffect(() => {
		const findChungChi = danhSachChungChi.find((item) => item.ma === maChungChi);
		setRecord(findChungChi);
	}, [maChungChi]);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const data = fromSinhVien ? { ...values, sinhVienSsoId: recSinhVien?.ssoId } : values;
		if (edit) {
			putModel(record?._id ?? '', data, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(data, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card
			title={`${intl.formatMessage({ id: edit ? 'global.title.chinhsua' : 'global.title.themmoi' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					{!fromSinhVien ? (
						<Col xs={24} md={12}>
							<Form.Item
								name='sinhVienSsoId'
								label={intl.formatMessage({ id: 'sinhvien.chungchi.id.sinhvien' })}
								rules={[...rules.required]}
							>
								<SelectSinhVienDebounce disabled={edit} />
							</Form.Item>
						</Col>
					) : null}
					<Col xs={24} md={12}>
						<Form.Item
							name='maChungChi'
							label={intl.formatMessage({ id: 'sinhvien.chungchi.id.chungchi' })}
							rules={[...rules.required]}
						>
							<SelectChungChi selectMa onChange={() => form.setFieldsValue({ diem: undefined })} />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item
							name='ngayCap'
							label={intl.formatMessage({ id: 'sinhvien.chungchi.id.ngaycap' })}
							rules={[...rules.required]}
						>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='donViCap'
							label={intl.formatMessage({ id: 'sinhvien.chungchi.id.donvicap' })}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'sinhvien.chungchi.id.placeholder.nhapdonvicap' })} />
						</Form.Item>
					</Col>

					{recChungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC ? (
						<Col xs={24} md={12}>
							<Form.Item
								name='diem'
								label={intl.formatMessage({ id: 'sinhvien.chungchi.id.bacchungchi' })}
								rules={[...rules.required]}
							>
								<Select
									placeholder={intl.formatMessage({ id: 'sinhvien.chungchi.id.placeholder.chonbacchungchi' })}
									options={recChungChi?.bac?.map((item) => ({
										key: item.order,
										label: item.ten,
										value: item.order,
									}))}
								/>
							</Form.Item>
						</Col>
					) : recChungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM ? (
						<>
							<Col xs={24} md={12}>
								<Form.Item
									name='diem'
									label={intl.formatMessage({ id: 'sinhvien.chungchi.id.mucdiem' })}
									rules={[...rules.required, ...rules.number(recChungChi.max, recChungChi.min)]}
								>
									<InputNumber
										style={{ width: '100%' }}
										min={recChungChi.min}
										max={recChungChi.max}
										step={recChungChi.step}
										placeholder={intl.formatMessage({ id: 'sinhvien.chungchi.id.placeholder.nhapdiemdatduoc' })}
									/>
								</Form.Item>
							</Col>
						</>
					) : null}
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

export default FormChungChiSinhVien;
