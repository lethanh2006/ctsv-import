import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectCapKyLuat from '@/pages/DanhMuc/CapKyLuat/components/Select';
import SelectHinhThucKyLuat from '@/pages/DanhMuc/HinhThucKyLuat/components/Select';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { type KyLuat } from '@/services/KhenThuongKyLuat/KyLuat/typing';
import { type SinhVien } from '@/services/SinhVien/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, message } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useModel } from 'umi';

export interface FormKyLuatProps {
	onFinishProps: (values: KyLuat.IRecord) => void;
}
export const FormKyLuat = ({ onFinishProps }: FormKyLuatProps) => {
	const [form] = Form.useForm<KyLuat.IRecord>();

	const capKyLuatId = useWatch(['capKyLuatId'], form);

	const { record, setVisibleForm, edit, formSubmiting, visibleForm, setFormSubmiting, setEdit, setIsView, isView } =
		useModel('khenthuongkyluat.kyluat');

	useEffect(() => {
		if (edit || isView) {
			resetFieldsForm(form, record);
		} else {
			resetFieldsForm(form);
		}
		if (!visibleForm) {
			setEdit(false);
			setIsView(false);
		}
	}, [record?._id, visibleForm]);

	useEffect(() => {
		if (!visibleForm) form.resetFields();
	}, [visibleForm]);

	const onFinish = async (values: KyLuat.IRecord) => {
		try {
			setFormSubmiting(true);
			// const url = await buildUpLoadFile(values, 'urlFileUpload');
			// setFormSubmiting(false);
			// const body: any = {
			// 	...values,
			// 	urlFileUpload: url,
			// };
			onFinishProps?.(values);

			setVisibleForm(false);
			if (edit) {
				message.success('Lưu thành công');
			} else {
				message.success('Thêm mới thành công');
			}
			// if (edit) {
			// 	await putModel(record?._id ?? '', body, getModel)
			// 		.then()
			// 		.catch((er) => console.log(er));
			// } else
			// 	await postModel(body, getModel)
			// 		.then(() => form.resetFields())
			// 		.catch((er) => console.log(er));
		} finally {
			setFormSubmiting(false);
		}
	};

	return (
		<Card title={(isView ? 'Chi tiết ' : edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'kỷ luật'}>
			<Form id='FormKyLuat' onFinish={onFinish} form={form} layout='vertical' disabled={isView}>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={12}>
						<Form.Item hidden name='hoTen' />
						<Form.Item name='sinhVienId' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce
								onChange={(_, option) => {
									const rawData = option?.rawData as SinhVien.IRecord | undefined;
									form.setFieldsValue({
										sinhVien: rawData,
										hoTen: rawData?.ten,
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='capKyLuat' hidden />
						<Form.Item name='capKyLuatId' label='Cấp kỷ luật' rules={[...rules.required]}>
							<SelectCapKyLuat
								hasCreate={false}
								onChange={(_, option) => {
									const rawData = option?.rawData;
									form.setFieldsValue({
										capKyLuat: rawData,
										hinhThucKyLuatId: null,
									});
								}}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item name='hinhThucKyLuatId' label='Hình thức kỷ luật' rules={[...rules.required]}>
							<SelectHinhThucKyLuat
								capKyLuatId={capKyLuatId}
								disable={!capKyLuatId}
								hasCreate={false}
								// onChange={(_, option) => {
								// 	const rawData = option?.rawData as HinhThucKyLuat.IRecord | undefined;
								// 	form.setFields([
								// 		{ name: 'anhHuongThoiGianKyLuat', value: rawData?.anhHuongThoiGianKyLuat ?? null },
								// 		{ name: 'thoiGianDieuChinh', value: rawData?.thoiGianDieuChinh ?? null },
								// 		{
								// 			name: 'daXetDieuChinhTangLuong',
								// 			value: typeof rawData?.anhHuongThoiGianKyLuat === 'boolean' ? daXetDieuChinhTangLuong : null,
								// 		},
								// 	]);
								// }}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='soQuyetDinh'
							label='Số quyết định'
							rules={[...rules.text, ...rules.length(20), ...rules.required]}
						>
							<Input placeholder='Số quyết định' />
						</Form.Item>
					</Col>
					{/* <Col span={24} md={12}>
						<Form.Item name='coQuanQuyetDinh' label='Cơ quan quyết định' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Cơ quan quyết định' />
						</Form.Item>
					</Col> */}
					<Col span={24} md={12}>
						<Form.Item name='nguoiKy' label='Người ký' rules={[...rules.text, ...rules.length(250), ...rules.required]}>
							<Input placeholder='Người ký' />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item name='ngayQuyetDinh' label='Ngày quyết định' rules={[...rules.required]}>
							<MyDatePicker placeholder='Ngày quyết định' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='ngayKy' label='Ngày ký' rules={[...rules.nhoHonBangHomNay]}>
							<MyDatePicker placeholder='Ngày ký' />
						</Form.Item>
					</Col>
					<Col span={24} md={24}>
						<Form.Item name='noiDung' label='Nội dung' rules={[...rules.text, ...rules.length(550)]}>
							<Input.TextArea placeholder='Nội dung' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='urlFileUpload' rules={[...rules.fileRequired]} label='File đính kèm'>
							<UploadFile
								otherProps={{
									maxCount: 1,
									multiple: true,
									// showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
				{!isView && (
					<Button form='FormKyLuat' loading={formSubmiting} style={{ marginRight: 8 }} htmlType='submit' type='primary'>
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
		</Card>
	);
};
