import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormLopThucHanh = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('daotaov2.hocky.lopthuchanh');
	const { record: recLopHocPhan, setRecord: setLopHp } = useModel('daotaov2.hocky.lophocphan');

	const getData = () => getModel({ tenCha: recLopHocPhan?.ten });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: LopHocPhan.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			const valuesFinal = { ...values, tenCha: recLopHocPhan?.ten };
			postModel(valuesFinal, getData)
				.then((res) => {
					form.resetFields();
					setLopHp(res); // Chuyển đến edit lớp thực hành này cùng view với lớp tín chỉ
				})
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} lớp thực hành`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label='Lớp tín chỉ'>
							<Input value={recLopHocPhan?.ten} disabled />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item
							name='ten'
							label='Tên lớp thực hành'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập tên lớp thực hành' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='siSoToiDa'
							label='Sĩ số tối đa'
							rules={[...rules.required, ...rules.number(200, 1, false)]}
						>
							<InputNumber placeholder='Sĩ số tối đa' min={1} max={200} style={{ width: '100%' }} />
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

export default FormLopThucHanh;
