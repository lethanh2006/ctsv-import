import SelectHocPhan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/SelectHocPhan';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import { type CongNhanKQHT } from '@/services/DaoTaoV2/KetQuaHocTap/CongNhan/typing';
import { ELoaiDiemChu, ETrangThaiCongNhanKqht } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormCongNhanKQHT = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'daotaov2.ketquahoctap.congnhan',
	);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: CongNhanKQHT.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item name='sinhVienSsoId' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='hocPhanId' label='Học phần' rules={[...rules.required]}>
							<SelectHocPhan />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='diemTongKetQuyDoi'
							label='Điểm tổng kết quy đổi'
							rules={[...rules.required, ...rules.number(100, 0, true)]}
						>
							<InputNumber min={0} max={100} placeholder='Điểm tổng kết quy đổi' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='diemThang4QuyDoi'
							label='Điểm thang 4 quy đổi'
							rules={[...rules.required, ...rules.number(100, 0, true)]}
						>
							<InputNumber min={0} max={100} placeholder='Điểm thang 4 quy đổi' style={{ width: '100%' }} />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item name='diemChuQuyDoi' label='Điểm chữ quy đổi' rules={[...rules.required]}>
							<Select
								options={Object.values(ELoaiDiemChu).map((item) => ({
									key: item,
									value: item,
									label: item,
								}))}
								placeholder='Điểm chữ quy đổi'
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='trangThai' label='Trạng thái công nhận' rules={[...rules.required]}>
							<Select
								options={Object.values(ETrangThaiCongNhanKqht).map((item) => ({
									key: item,
									value: item,
									label: item,
								}))}
								placeholder='Trạng thái công nhận'
							/>
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

export default FormCongNhanKQHT;
