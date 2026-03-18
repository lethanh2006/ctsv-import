import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, InputNumber, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import _ from 'lodash';

const FormDauDiemHocPhan = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'daotaov2.danhmuc.daudiemhocphan',
	);
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item name='ten' label='Tên đầu điểm' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập tên đầu điểm' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='field' label='Trường dữ liệu' rules={[...rules.required]}>
							<Select
								placeholder='Chọn trường dữ liệu'
								options={_.range(1, 11).map((item) => ({
									key: item,
									value: item,
									label: `Trọng số ${item}`,
								}))}
							/>
						</Form.Item>
					</Col>
					{/* <Col xs={24}>
            <Form.Item name="order" label="Thứ tự sắp xếp" rules={[...rules.required]}>
              <InputNumber placeholder="Nhập thứ tự sắp xếp" style={{ width: '100%' }} />
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
		</Card>
	);
};

export default FormDauDiemHocPhan;
