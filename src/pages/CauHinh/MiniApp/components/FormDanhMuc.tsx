import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDanhMuc = ({ getData }: { getData: () => void }) => {
	const { record, edit, isView, setVisibleForm, postModel, putModel, formSubmiting } =
		useModel('danhmuc.miniappdanhmuc');
	const [form] = Form.useForm();

	useEffect(() => {
		if (record?._id) {
			form.setFieldsValue(record);
		} else {
			form.resetFields();
		}
	}, [record]);

	const onFinish = async (values: any) => {
		const newValues = {
			...values,
			icon: await buildUpLoadFile(values, 'icon'),
		};

		if (edit) {
			await putModel(record?._id as string, newValues, getData);
		} else {
			await postModel(newValues, getData);
		}
	};

	return (
		<Card title={isView ? 'Chi tiết danh mục' : edit ? 'Chỉnh sửa danh mục' : 'Thêm mới danh mục'}>
			<Form onFinish={onFinish} layout='vertical' form={form}>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name='ten' label='Tên danh mục' rules={[...rules.required]}>
							<Input placeholder='Nhập tên danh mục' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='moTa' label='Mô tả'>
							<Input.TextArea rows={1} placeholder='Nhập mô tả' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='icon' label='Icon' rules={[...rules.required]}>
							<UploadFile disabled={isView} accept='.png,.jpg,.jpeg,.svg' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='isActive' label='Trạng thái' valuePropName='checked'>
							<Switch checkedChildren='Kích hoạt' unCheckedChildren='vô hiệu hóa' defaultChecked={false} />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
					{!isView && (
						<Button style={{ marginRight: 8 }} htmlType='submit' type='primary' loading={formSubmiting}>
							{!edit ? 'Thêm mới' : 'Lưu lại'}
						</Button>
					)}
					<Button
						onClick={() => {
							setVisibleForm(false);
							form.resetFields();
						}}
					>
						Đóng
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default FormDanhMuc;
