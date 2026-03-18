import MyDatePicker from '@/components/MyDatePicker';
import SelectLoaiHocBong from '@/pages/DaoTaoV2/DanhMucHeThong/LoaiHocBong/components/Select';
import { type SinhVien } from '@/services/DaoTaoV2/SinhVien/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormHocBongSinhVien = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm } =
		useModel('daotaov2.sinhvien.hocbong');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const getData = () => getModel({ sinhVienSsoId: recSinhVien?.ssoId });

	const onFinish = async (values: SinhVien.IHocBongSinhVien) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel({ ...values, sinhVienSsoId: recSinhVien?.ssoId ?? '' }, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item name='ten' label='Tên học bổng' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập tên học bổng' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='donViTaiTro' label='Đơn vị tài trợ' rules={[...rules.text, ...rules.length(250)]}>
							<Input placeholder='Nhập đơn vị tài trợ' />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item name='thoiGianTraoTangHocBong' label='Thời gian trao tặng học bổng' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='loaiHocBongId' label='Loại học bổng'>
							<SelectLoaiHocBong />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='giaTriHocBong' label='Giá trị học bổng'>
							<InputNumber placeholder='Nhập số tiền học bổng trao tặng' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormHocBongSinhVien;
