import { type HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import { ELoaiHocLuc } from '@/services/DaoTaoV2/HocKy/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormQuyDinhSoTinChi = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, visibleForm, danhSach } =
		useModel('daotaov2.hocky.quydinhsotinchi');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const soTinToiThieu = Form.useWatch('soTinChiToiThieu', form);
	const soTinToiDa = Form.useWatch('soTinChiToiDa', form);
	const { title } = props;

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: HocKy.IQuyDinhSoTinChiDangKy) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, maHocKy: recHocKy?.ma ?? '' }, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label='Kỳ học'>
							<Input disabled value={recHocKy?.ten} />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item name='loaiHocLuc' label='Học lực' rules={[...rules.required]}>
							<Select
								options={Object.values(ELoaiHocLuc)
									.filter((item) => !danhSach?.map((items) => items.loaiHocLuc)?.includes(item))
									.map((item) => ({
										key: item,
										value: item,
										label: item,
									}))}
								placeholder='Chọn học lực'
								disabled={edit}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item
							name='soTinChiToiThieu'
							label='Số tín chỉ tối thiểu'
							rules={[...rules.required, ...rules.number(100, 1, false)]}
						>
							<InputNumber
								style={{ width: '100%' }}
								min={1}
								max={100}
								step={1}
								onChange={(val) => {
									form.validateFields(['soTinChiToiDa']);
								}}
								placeholder='Số tín chỉ tối thiểu'
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='soTinChiToiDa'
							label='Số tín chỉ tối đa'
							rules={[...rules.required, ...rules.number(100, soTinToiThieu, false)]}
						>
							<InputNumber
								style={{ width: '100%' }}
								min={soTinToiThieu}
								max={100}
								step={1}
								placeholder='Số tín chỉ tối đa'
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='soTinChiToiDaSongNganh'
							label='Số tín chỉ tối đa song ngành'
							rules={[...rules.required, ...rules.number(100, soTinToiDa, false)]}
						>
							<InputNumber
								style={{ width: '100%' }}
								min={soTinToiDa}
								max={100}
								step={1}
								placeholder='Số tín chỉ tối đa song ngành'
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

export default FormQuyDinhSoTinChi;
