import type { CauLacBo } from '@/services/CauLacBo/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormPhongBan = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, getModel } =
		useModel('caulacbo.phongban');
	const { record: recordCLB } = useModel('caulacbo.caulacbo');
	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue({
				...record,
			});
		}
	}, [record?._id, visibleForm]);

	const getData = () => {
		getModel({ cauLacBoId: recordCLB?._id });
	};

	const onFinish = async (values: CauLacBo.PhongBan) => {
		if (!recordCLB?._id) return;
		const payload = {
			...record,
			...values,
			cauLacBoId: recordCLB._id,
		};
		if (edit) {
			putModel(record?._id ?? '', payload, getData);
		} else {
			postModel(payload, getData);
		}
	};

	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={24}>
						<Form.Item name='ten' label='Tên ban/bộ phận' rules={[...rules.required, ...rules.text]}>
							<Input.TextArea placeholder='Tên ban/bộ phận' />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='moTa' label='Mô tả' rules={[...rules.text]}>
							<Input.TextArea placeholder='Mô tả' />
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

export default FormPhongBan;
