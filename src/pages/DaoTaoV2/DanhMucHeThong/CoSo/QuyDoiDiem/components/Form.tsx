import { type QuyDoiDiem } from '@/services/DaoTaoV2/DanhMucHeThong/QuyDoiDiem/typing';
import { ELoaiDiemChu } from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormQuyDoiDiem = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('daotaov2.danhmuc.quydoidiem');
	const [diemFrom, setDiemFrom] = useState<number>(0);
	const { title } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
		setDiemFrom(record?.diemFrom ?? 0);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: QuyDoiDiem.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(values)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24} md={12}>
						<Form.Item name='diemFrom' label='Điểm cận dưới' rules={[...rules.required, ...rules.number(10, 0, true)]}>
							<InputNumber
								placeholder='Nhập điểm cận dưới'
								min={0}
								max={10}
								onChange={(val) => {
									setDiemFrom(val as number);
									form.validateFields(['diemTo']);
								}}
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='diemTo'
							label='Điểm cận trên'
							rules={[...rules.required, ...rules.number(10, diemFrom, true)]}
						>
							<InputNumber placeholder='Nhập điểm cận trên' min={diemFrom} max={10} style={{ width: '100%' }} />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='diemThang4'
							label='Điểm thang 4 quy đổi'
							rules={[...rules.required, ...rules.number(4, 0, true)]}
						>
							<InputNumber placeholder='Nhập điểm thang 4 quy đổi' min={0} max={4} style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='diemChu' label='Điểm chữ quy đổi' rules={[...rules.required]}>
							<Select
								options={Object.values(ELoaiDiemChu).map((item) => ({
									key: item,
									value: item,
									label: item,
								}))}
								placeholder='Chọn điểm chữ quy đổi'
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

export default FormQuyDoiDiem;
