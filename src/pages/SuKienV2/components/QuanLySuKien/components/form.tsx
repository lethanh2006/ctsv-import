import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDebounce';
import rules from '@/utils/rules';
import type { FormInstance } from 'antd';
import { Button, Card, Col, Form, Row } from 'antd';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
interface IProps {
	formProps: FormInstance;
	setVisibleForm: (val: boolean) => void;
	edit: boolean;
	isView: boolean;
	record: any;
	fieldName?: string;
	type?: 'nckh' | 'other' | 'tren-lop';
}
const FormThemMoi = (props: IProps) => {
	const { isView, edit, setVisibleForm, formProps, record, fieldName, type } = props;
	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		try {
			const data = formProps.getFieldValue(fieldName ?? 'gioTrucTiepTrenLop') ?? [];
			const payload = {
				...values,
				id: nanoid(),
			};
			if (edit) {
				data?.forEach((val: { id: any }, index: any) => {
					if (val?.id === record?.id) {
						data?.splice(index, 1, { ...payload });
					}
				});
			} else {
				data?.push({ ...payload, isInit: false });
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
			form.setFieldsValue({ ...record, maKyHoc: record?.maKyHoc ? `${record?.maKyHoc}` : undefined });
		}
	}, [edit, record]);

	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Form onFinish={onFinish} layout={'vertical'} form={form}>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name={'fullname'} hidden />
						<Form.Item name={'email'} hidden />
						<Form.Item name={'ssoId'} label={'Chọn nhân sự'} rules={[...rules.required]}>
							<SelectNhanSuDebounce
								onChange={(val, option) => {
									const rawData: ToChucNhanSu.INhanSu = option?.rawData as ToChucNhanSu.INhanSu;
									form.setFieldsValue({
										fullname: rawData?.hoTen,
										email: rawData?.email,
									});
								}}
							/>
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
