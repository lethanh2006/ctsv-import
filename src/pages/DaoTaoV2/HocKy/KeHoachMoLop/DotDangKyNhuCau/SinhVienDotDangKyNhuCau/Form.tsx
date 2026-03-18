import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import type { DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormSinhVienDotDangKy = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('daotaov2.hocky.dangkynhucau');
	const { record: recDotDangKy } = useModel('daotaov2.hocky.dotdangkynhucau');

	const getData = () => getModel({ dotDkNhuCauId: recDotDangKy?._id });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DangKyNhuCau.IDangKyNhuCau) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			const valuesFinal = { ...values, dotDkNhuCauId: recDotDangKy?._id ?? '' };
			postModel(valuesFinal, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} Sinh viên - Đợt đăng ký`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label='Đợt đăng ký nhu cầu'>
							<Input value={recDotDangKy?.ten} disabled />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item name='sinhVienSsoId' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormSinhVienDotDangKy;
