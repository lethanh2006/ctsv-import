import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row, Select, Switch } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormMiniApp = ({ getData }: { getData: () => void }) => {
	const { record, edit, isView, setVisibleForm, postModel, putModel, formSubmiting } = useModel('danhmuc.miniapp');
	const { danhSach: dsDanhMuc, getAllModel: getAllDanhMuc } = useModel('danhmuc.miniappdanhmuc');
	const [form] = Form.useForm();

	useEffect(() => {
		getAllDanhMuc();
	}, []);

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
			urlBanner: await buildUpLoadFile(values, 'urlBanner'),
		};

		if (edit) {
			await putModel(record?._id as string, newValues, getData);
		} else {
			await postModel(newValues, getData);
		}
	};

	return (
		<Card title={isView ? 'Chi tiết Mini App' : edit ? 'Chỉnh sửa Mini App' : 'Thêm mới Mini App'}>
			<Form onFinish={onFinish} layout='vertical' form={form}>
				<Row gutter={[12, 0]}>
					<Col span={12}>
						<Form.Item name='ten' label='Tên Mini App' rules={[...rules.required]}>
							<Input placeholder='Nhập tên Mini App' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='urlMiniApp' label='Đường dẫn miniapp' rules={[...rules.required, ...rules.httpLink]}>
							<Input placeholder='Nhập đường dẫn VD: https://...' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='danhMucId' label='Danh mục' rules={[...rules.required]}>
							<Select
								placeholder='Chọn danh mục'
								disabled={isView}
								allowClear
								options={dsDanhMuc?.map((item: any) => ({
									value: item._id,
									label: item.ten,
								}))}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='donViTrienKhai' label='Đơn vị triển khai'>
							<Input placeholder='Nhập đơn vị' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='moTa' label='Mô tả'>
							<Input.TextArea rows={1} placeholder='Nhập mô tả' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='tokenKey' label='Token key'>
							<Input placeholder='Nhập key' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='tokenValue' label='Token value'>
							<Input.TextArea rows={2} placeholder='Nhập value' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='icon' label='Icon' rules={[...rules.required]}>
							<UploadFile disabled={isView} accept='.png,.jpg,.jpeg,.svg' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='urlBanner' label='Banner'>
							<UploadFile disabled={isView} accept='.png,.jpg,.jpeg,.svg' />
						</Form.Item>
					</Col>
					<Col span={24}>
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

export default FormMiniApp;
