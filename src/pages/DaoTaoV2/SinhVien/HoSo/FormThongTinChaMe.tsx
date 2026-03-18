import { ETrangThaiThanhVienGiaDinh } from '@/services/DaoTaoV2/SinhVien/constant';
import rules from '@/utils/rules';
import { Col, Form, type FormInstance, Input, InputNumber, Row, Select } from 'antd';
import dayjs from 'dayjs';

const FormThongTinChaMe = (props: { suffix: 'Me' | 'Cha'; form: FormInstance }) => {
	const { suffix, form } = props;
	const title = suffix === 'Me' ? 'mẹ' : 'cha';
	const trangThai = Form.useWatch(`trangThai${suffix}`, form) ?? ETrangThaiThanhVienGiaDinh.CO_THONG_TIN;

	return (
		<Row gutter={[12, 0]}>
			<Col span={12} md={8}>
				<Form.Item name={`trangThai${suffix}`} label='Trạng thái'>
					<Select
						options={Object.values(ETrangThaiThanhVienGiaDinh).map((item) => ({
							key: item,
							value: item,
							label: item,
						}))}
						placeholder='Chọn trạng thái'
					/>
				</Form.Item>
			</Col>

			{trangThai === ETrangThaiThanhVienGiaDinh.CO_THONG_TIN || trangThai === ETrangThaiThanhVienGiaDinh.DA_MAT ? (
				<>
					<Col span={12} md={8}>
						<Form.Item name={`ten${suffix}`} label='Họ tên' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder={`Nhập họ tên ${title}`} />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item name={`namSinh${suffix}`} label='Năm sinh'>
							<InputNumber min={1990} max={dayjs().year()} placeholder='Nhập năm sinh' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</>
			) : null}

			{trangThai === ETrangThaiThanhVienGiaDinh.CO_THONG_TIN ? (
				<>
					<Col span={12} md={8}>
						<Form.Item name={`soDienThoai${suffix}`} label='SĐT' rules={[...rules.soDienThoai]}>
							<Input placeholder='Nhập số điện thoại' />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item name={`email${suffix}`} label='Email' rules={[...rules.email]}>
							<Input placeholder='Nhập email' />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item name={`ngheNghiep${suffix}`} label='Nghề nghiệp' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập nghề nghiệp' />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item name={`noiCongTac${suffix}`} label='Nơi công tác' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập nơi công tác' />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item name={`nguyenQuan${suffix}`} label='Nguyên quán' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập nguyên quán' />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item name={`diaChi${suffix}`} label='Địa chỉ' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập địa chỉ' />
						</Form.Item>
					</Col>
				</>
			) : null}
		</Row>
	);
};

export default FormThongTinChaMe;
