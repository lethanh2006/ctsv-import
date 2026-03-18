import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import { type LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { EDoiTuongLopHanhChinh, doiTuongLopHanhChinh } from '@/services/DaoTaoV2/NamHoc/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectKhoaSinhVien from '../../KhoaSinhVien/components/Select';

const FormLopHanhChinh = (props: { afterAddNew?: (rec: LopHanhChinh.IRecord) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		formSubmiting,
		setRecord,
		setEdit,
		visibleForm,
		getModel,
	} = useModel('daotaov2.namhoc.lophanhchinh');
	const { record: recKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const maKhoaSinhVien = Form.useWatch('maKhoaSinhVien', form);
	const { afterAddNew } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue({ ...record });
	}, [record?._id, visibleForm]);

	const getData = () => getModel({ maKhoaSinhVien: recKhoa?.ma, maNganh: recNganh?.ma });

	const onFinish = async (values: LopHanhChinh.IRecord) => {
		const payload: any = {
			...values,
			// nhanSuSsoId: values?.nhanSuSsoId ?? null,
		};

		if (edit) {
			putModel(
				record?._id ?? '',
				payload,
				getData,
				undefined,
				false,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(payload, getData, false, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24} md={12}>
					<Form.Item
						name='maKhoaSinhVien'
						label={intl.formatMessage({ id: 'lophanhchinh.step.thongtinchung.khoasv' })}
						rules={[...rules.required]}
					>
						<SelectKhoaSinhVien selectMa disabled={edit} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='maNganh'
						label={intl.formatMessage({ id: 'lophanhchinh.step.thongtinchung.nganhdaotao' })}
						rules={[...rules.required]}
					>
						<SelectNganhCoSo selectMa hasDefault={!edit} maKhoaSinhVien={maKhoaSinhVien} disabled={edit} />
					</Form.Item>
				</Col>

				<Col xs={24} md={12}>
					<Form.Item
						name='ten'
						label={intl.formatMessage({ id: 'lophanhchinh.step.thongtinchung.malop' })}
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder={intl.formatMessage({ id: 'lophanhchinh.step.thongtinchung.malop.place' })} />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item name='doiTuong' label={intl.formatMessage({ id: 'lophanhchinh.step.thongtinchung.doituong' })}>
						<Select
							placeholder={intl.formatMessage({ id: 'lophanhchinh.step.thongtinchung.doituong.place' })}
							options={Object.values(EDoiTuongLopHanhChinh).map((item) => ({
								value: item,
								key: item,
								label: doiTuongLopHanhChinh[item],
							}))}
							allowClear
						/>
					</Form.Item>
				</Col>
				{/* <Col xs={24} md={12}>
					<Form.Item name='nhanSuSsoId' label='Cố vấn học tập'>
						<SelectNhanSuDebounce />
					</Form.Item>
				</Col> */}
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
	);
};

export default FormLopHanhChinh;
