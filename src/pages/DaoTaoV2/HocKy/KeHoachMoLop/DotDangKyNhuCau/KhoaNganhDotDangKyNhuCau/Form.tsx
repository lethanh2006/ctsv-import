import SelectKhoaNganh from '@/pages/DaoTaoV2/NamHoc/KhoaNganh/components/Select';
import { type DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormKhoaNganhDotDangKy = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } = useModel(
		'hocky.dotdangkynhucaukhoanganh',
	);
	const { record: recDotDangKy } = useModel('daotaov2.hocky.dotdangkynhucau');
	const title = props?.title ?? '';

	const getData = () => getModel({ dotDangKyNhuCauId: recDotDangKy?._id });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DangKyNhuCau.IDotDangKyKhoaNganh) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			const valuesFinal = { ...values, dotDangKyNhuCauId: recDotDangKy?._id ?? '' };
			postModel(valuesFinal, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label='Đợt đăng ký nhu cầu'>
							<Input value={recDotDangKy?.ten} disabled />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item name='maKhoaNganh' label='Khóa ngành' rules={[...rules.required]}>
							<SelectKhoaNganh />
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

export default FormKhoaNganhDotDangKy;
