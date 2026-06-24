import MyDatePicker from '@/components/MyDatePicker';
import { getDateFormat } from '@/utils/formatDate';
import { Col, Form, Input, Row, type FormInstance } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormTuyenSinh = (props: { form: FormInstance }) => {
	const intl = useIntl();
	const { form } = props;
	const { record } = useModel('sinhvien.sinhvien');
	const { getOneModel } = useModel('daotaov2.namhoc.sinhviendotnhaphoc');

	useEffect(() => {
		if (record?._id)
			getOneModel({ sinhVienSsoId: record?.ssoId })
				.then((rec) =>
					form.setFieldsValue({
						...rec,
						soQuyetDinhTrungTuyen: rec?.quyetDinh?.soQuyetDinh,
						ngayKyQuyetDinhTrungTuyen: rec?.quyetDinh?.ngayBanHanh,
					}),
				)
				.catch((err) => console.log(err));
	}, [record?._id]);

	return (
		<Row gutter={[12, 0]}>
			<Col span={12} md={12}>
				<Form.Item name='doiTuongDauVao' label={intl.formatMessage({ id: 'sinhvien.form.tuyensinh.doituong' })}>
					<Input
						disabled={!!record?._id}
						placeholder={intl.formatMessage({ id: 'sinhvien.form.tuyensinh.doituong.place' })}
					/>
				</Form.Item>
			</Col>
			<Col span={12} md={12}>
				<Form.Item name='diemTrungTuyen' label={intl.formatMessage({ id: 'sinhvien.form.tuyensinh.ketqua' })}>
					<Input
						disabled={!!record?._id}
						placeholder={intl.formatMessage({ id: 'sinhvien.form.tuyensinh.ketqua.place' })}
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={8}>
				<Form.Item
					name='soQuyetDinhTrungTuyen'
					label={intl.formatMessage({ id: 'sinhvien.form.tuyensinh.soquyetdinh' })}
				>
					<Input
						disabled={!!record?._id}
						placeholder={intl.formatMessage({ id: 'sinhvien.form.tuyensinh.soquyetdinh.place' })}
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={8}>
				<Form.Item
					name='ngayKyQuyetDinhTrungTuyen'
					label={intl.formatMessage({ id: 'sinhvien.form.tuyensinh.ngaykyquyetdinh' })}
				>
					<MyDatePicker disabled={!!record?._id} format={getDateFormat()} />
				</Form.Item>
			</Col>
			<Col span={24} md={8}>
				<Form.Item name='ngayNhapHoc' label={intl.formatMessage({ id: 'sinhvien.form.tuyensinh.ngaynhaphoc' })}>
					<MyDatePicker disabled={!!record?._id} format={getDateFormat()} />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormTuyenSinh;
