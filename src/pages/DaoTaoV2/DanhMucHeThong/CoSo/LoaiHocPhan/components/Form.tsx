import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormLoaiHocPhan = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('daotaov2.danhmuc.loaihocphan');
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: HocPhan.ILoaiHocPhan) => {
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
				<Form.Item
					name='ma'
					label='Mã tính chất học phần'
					rules={[...rules.required, ...rules.text, ...rules.length(20)]}
				>
					<Input placeholder='Nhập mã tính chất học phần' disabled={edit} />
				</Form.Item>
				<Form.Item
					name='ten'
					label='Tính chất học phần'
					rules={[...rules.required, ...rules.text, ...rules.length(250)]}
				>
					<Input placeholder='Nhập tính chất học phần' />
				</Form.Item>
				<Form.Item name='isTinhDiem' valuePropName='checked'>
					<Checkbox>Là học phần tính điểm</Checkbox>
				</Form.Item>
				<Form.Item name='isTinhSoTinChiDangKy' valuePropName='checked'>
					<Checkbox>Học phần tính số tín chỉ khi đăng ký tín chỉ</Checkbox>
				</Form.Item>
				<Form.Item name='isTinhSoTinChiTichLuy' valuePropName='checked'>
					<Checkbox>Học phần tính số tín chỉ tích lũy</Checkbox>
				</Form.Item>

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

export default FormLoaiHocPhan;
