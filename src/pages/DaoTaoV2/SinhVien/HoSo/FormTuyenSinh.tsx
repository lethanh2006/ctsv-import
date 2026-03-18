import MyDatePicker from '@/components/MyDatePicker';
import { Col, Form, Input, Row } from 'antd';
import { useIntl } from 'umi';

const FormTuyenSinh = () => {
	const intl = useIntl();
	return (
		<Row gutter={[12, 0]}>
			<Col span={12} md={12}>
				<Form.Item
					name='doiTuongDauVao'
					label={intl.formatMessage({ id: 'sinhvien.tuyensinhdauvao.id.doituongdauvao' })}
				>
					<Input disabled />
				</Form.Item>
			</Col>
			<Col span={12} md={12}>
				<Form.Item
					name='diemTrungTuyen'
					label={intl.formatMessage({ id: 'sinhvien.tuyensinhdauvao.id.ketquatuyensinh' })}
				>
					<Input disabled />
				</Form.Item>
			</Col>
			<Col span={24} md={8}>
				<Form.Item
					name='soQuyetDinhTrungTuyen'
					label={intl.formatMessage({ id: 'sinhvien.tuyensinhdauvao.id.soquyetdinhtrungtuyen' })}
				>
					<Input disabled />
				</Form.Item>
			</Col>
			<Col span={24} md={8}>
				<Form.Item
					name='ngayKyQuyetDinhTrungTuyen'
					label={intl.formatMessage({ id: 'sinhvien.tuyensinhdauvao.id.ngaykyquyetdinhtrungtuyen' })}
				>
					<MyDatePicker disabled />
				</Form.Item>
			</Col>
			<Col span={24} md={8}>
				<Form.Item name='ngayNhapHoc' label={intl.formatMessage({ id: 'sinhvien.tuyensinhdauvao.id.ngaynhaphoc' })}>
					<MyDatePicker disabled />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormTuyenSinh;
