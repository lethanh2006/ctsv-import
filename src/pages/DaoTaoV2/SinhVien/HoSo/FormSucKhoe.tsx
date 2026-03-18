import rules from '@/utils/rules';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { useIntl } from 'umi';

const FormSucKhoe = () => {
	const intl = useIntl();
	return (
		<Row gutter={[12, 0]}>
			<Col span={12} md={8}>
				<Form.Item
					name='chieuCao'
					label={intl.formatMessage({ id: 'sinhvien.suckhoe.id.chieucao' })}
					rules={[...rules.number(300, 0)]}
				>
					<InputNumber
						placeholder={intl.formatMessage({ id: 'sinhvien.suckhoe.id.nhapchieucao' })}
						style={{ width: '100%' }}
					/>
				</Form.Item>
			</Col>
			<Col span={12} md={8}>
				<Form.Item
					name='canNang'
					label={intl.formatMessage({ id: 'sinhvien.suckhoe.id.cannang' })}
					rules={[...rules.number(300, 0)]}
				>
					<InputNumber
						placeholder={intl.formatMessage({ id: 'sinhvien.suckhoe.id.nhapcannang' })}
						style={{ width: '100%' }}
					/>
				</Form.Item>
			</Col>
			<Col span={12} md={8}>
				<Form.Item
					name='loaiKhuyetTat'
					label={intl.formatMessage({ id: 'sinhvien.suckhoe.id.loaikhuyettat' })}
					rules={[...rules.text, ...rules.length(250)]}
				>
					<Input placeholder={intl.formatMessage({ id: 'sinhvien.suckhoe.id.nhaploaikhuyettat' })} />
				</Form.Item>
			</Col>

			<Col span={12} md={12}>
				<Form.Item
					name='soBaoHiemSinhVien'
					label={intl.formatMessage({ id: 'sinhvien.suckhoe.id.sobhyt' })}
					rules={[...rules.text, ...rules.length(20)]}
				>
					<Input placeholder={intl.formatMessage({ id: 'sinhvien.suckhoe.id.nhapsobhyt' })} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name='maBenhVienKhamChuaBenh'
					label={intl.formatMessage({ id: 'sinhvien.suckhoe.id.mabenhvienkham' })}
					rules={[...rules.text, ...rules.length(20)]}
				>
					<Input placeholder={intl.formatMessage({ id: 'sinhvien.suckhoe.id.nhapmabenhvienkham' })} />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormSucKhoe;
