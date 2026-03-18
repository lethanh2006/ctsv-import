import rules from '@/utils/rules';
import { Button, Card, Col, Form, FormInstance, Row, Select, Switch } from 'antd';
import { useEffect } from 'react';
import { EDanhSachChucNang, MapTitleEDanhSachChucNang } from '@/pages/CauHinh/constants';
interface IProps {
	formProps: FormInstance;
	setVisibleForm: (val: boolean) => void;
	edit: boolean;
	isView: boolean;
	record: any;
	fieldName?: string;
}
const FormThemMoi = (props: IProps) => {
	const { isView, edit, setVisibleForm, formProps, record, fieldName } = props;
	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		try {
			const data = formProps.getFieldValue(fieldName ?? 'gioTrucTiepTrenLop') ?? [];
			const payload = {
				...values,
				title:MapTitleEDanhSachChucNang?.[values?.ma as EDanhSachChucNang]
			};
			if (edit) {
				data?.forEach((val: { key: any }, index: any) => {
					if (val?.key === record?.key) {
						data?.splice(index, 1, { ...payload });
					}
				});
			} else {
				data?.push({ ...payload });
			}
			formProps.setFieldsValue({
				[fieldName ?? 'gioTrucTiepTrenLop']: data,
			});
			setVisibleForm(false);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (edit) {
			form.setFieldsValue({ ...record });
		}
	}, [edit, record]);

	return (
		<Card title={edit ? `Chỉnh sửa` : `Thêm mới`}>
			<Form onFinish={onFinish} layout={'vertical'} form={form}>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name={'ma'} label={'Tên chức năng'} rules={[...rules.required, ...rules.text]}>
							<Select
								placeholder={'Chọn chức năng'}
								options={Object.values(EDanhSachChucNang).map((val) => ({
									value: val,
									label: `${MapTitleEDanhSachChucNang?.[val as EDanhSachChucNang] ?? val}(${val})`,
								}))}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name={'trangThai'} label={'Trạng thái'}>
							<Switch />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
					{!isView && (
						<Button style={{ marginRight: 8 }} htmlType='submit' type='primary'>
							{!edit ? 'Thêm mới ' : 'Lưu lại'}
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
export default FormThemMoi;
