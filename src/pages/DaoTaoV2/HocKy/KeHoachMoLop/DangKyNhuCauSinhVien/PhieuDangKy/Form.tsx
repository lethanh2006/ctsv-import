import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { type DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormPhieuDangKyNhuCau = (props: { afterAddNew: (rec: DangKyNhuCau.IDangKyNhuCau) => void; getData: any }) => {
	const [form] = Form.useForm();
	const { afterAddNew } = props;
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, setRecord, setEdit, visibleForm } =
		useModel('daotaov2.hocky.dangkynhucau');
	const { record: recDotDangKy } = useModel('daotaov2.hocky.dotdangkynhucau');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const getData = () => props.getData && props.getData();

	const onFinish = async (values: DangKyNhuCau.IDangKyNhuCau) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, dotDkNhuCauId: recDotDangKy?._id ?? '' }, getData, false)
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
				<Col xs={24}>
					<Form.Item label='Đợt đăng ký nhu cầu'>
						<Input disabled value={record?.dotDkNhuCau?.ten ?? recDotDangKy?.ten} />
					</Form.Item>
				</Col>

				<Col xs={24}>
					<Form.Item name='sinhVienSsoId' label='Sinh viên' rules={[...rules.required]}>
						<SelectSinhVienDebounce disabled={edit} />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				{!edit ? (
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Thêm mới
					</Button>
				) : null}
				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormPhieuDangKyNhuCau;
