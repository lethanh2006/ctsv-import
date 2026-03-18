import MyDatePicker from '@/components/MyDatePicker';
import type { QuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/QuyetDinh/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row, message } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectSinhVienDebounce from '../../component/Select';

const FormQuyetDinhSV = (props: {
	isThoiHoc?: boolean;
	danhSachSinhVienQuyetDinh?: QuyetDinh.ISinhVienBaoLuuThoiHoc[];
	onOk: (val: QuyetDinh.ISinhVienBaoLuuThoiHoc) => void;
}) => {
	const { danhSach: danhSachSinhVien, visibleForm, setVisibleForm } = useModel('daotaov2.sinhvien.sinhvien');
	const { isThoiHoc, danhSachSinhVienQuyetDinh, onOk } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	// const thoiGianBatDau = Form.useWatch('thoiGianBatDau', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
	}, [visibleForm]);

	const onFinish = async (values: any) => {
		const checkSinhVien = danhSachSinhVienQuyetDinh?.find((item) => item.sinhVienSsoId === values.sinhVienSsoId);

		if (checkSinhVien?.sinhVienSsoId) return message.error('Sinh viên đã có trong danh sách');
		else {
			const sinhVien = danhSachSinhVien.find((item) => item.ssoId === values.sinhVienSsoId);
			const data = {
				...values,
				maSinhVien: sinhVien?.ma,
				hoTen: sinhVien?.ten,
				maKhoaSinhVien: sinhVien?.maKhoaSinhVien,
				khoaSinhVien: sinhVien?.khoaSinhVien,
				maNganh: sinhVien?.maNganh,
				nganh: sinhVien?.nganh,
			};
			onOk(data);
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24} md={24}>
					<Form.Item name='sinhVienSsoId' label='Sinh viên' rules={[...rules.required]}>
						<SelectSinhVienDebounce />
					</Form.Item>
				</Col>

				{isThoiHoc ? (
					<Col xs={24} md={24}>
						<Form.Item name='thoiGianHieuLuc' label='Thời gian thôi học' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
				) : (
					<>
						<Col xs={24} md={12}>
							<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
								<MyDatePicker />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='thoiGianKetThuc'
								label='Thời gian kết thúc'
								rules={[...rules.required]}
								// rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'Thời gian có hiệu lực')]}
							>
								<MyDatePicker
								// disabledDate={(cur) => dayjs(cur).isBefore(thoiGianBatDau)}
								/>
							</Form.Item>
						</Col>
					</>
				)}

				<Col xs={24} md={24}>
					<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text, ...rules.length(1000)]}>
						<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					Thêm mới
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormQuyetDinhSV;
