import MyDatePicker from '@/components/MyDatePicker';
import { type DangKyNhuCau } from '@/services/DaoTaoV2/HocKy/DangKyNhuCau/typing';
import rules from '@/utils/rules';
import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormDotDangKyNhuCau = (props: { afterAddNew: (rec: DangKyNhuCau.IDotDangKy) => void }) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, getModel, formSubmiting, setRecord, setEdit } = useModel(
		'daotaov2.hocky.dotdangkynhucau',
	);
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const [thoiGianBatDau, setThoiGianBatDau] = useState<string>();
	const { afterAddNew } = props;

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	const resetFields = () => {
		form.resetFields();
		setThoiGianBatDau(undefined);
	};

	useEffect(() => {
		if (record?._id) {
			form.setFieldsValue(record);
			setThoiGianBatDau(record.thoiGianBatDau);
		} else resetFields();
	}, [record?._id]);

	const onFinish = async (values: DangKyNhuCau.IDotDangKy) => {
		if (edit) {
			putModel(record?._id ?? '', values, getData, undefined, false)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel({ ...values, maHocKy: recHocKy?.ma ?? '' }, getData, false)
				.then((rec) => {
					setRecord(rec);
					setEdit(true);
					if (afterAddNew) afterAddNew(rec);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col xs={24}>
					<Form.Item label='Kỳ học'>
						<Input disabled value={recHocKy?.ten} />
					</Form.Item>
				</Col>
				<Col xs={24}>
					<Form.Item
						name='ten'
						label='Tên đợt đăng ký'
						rules={[...rules.required, ...rules.text, ...rules.length(250)]}
					>
						<Input placeholder='Nhập tên đợt đăng ký' />
					</Form.Item>
				</Col>

				<Col xs={24} md={12}>
					<Form.Item name='thoiGianBatDau' label='Thời gian bắt đầu' rules={[...rules.required]}>
						<MyDatePicker
							onChange={(val) => {
								setThoiGianBatDau(val as string);
								form.validateFields(['thoiGianKetThuc']);
							}}
							format='DD/MM/YYYY HH:mm:ss'
							showTime
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='thoiGianKetThuc'
						label='Thời gian kết thúc'
						rules={[...rules.required, ...rules.sauNgay(thoiGianBatDau, 'Thời gian bắt đầu')]}
					>
						<MyDatePicker format='DD/MM/YYYY HH:mm:ss' showTime />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{!edit ? 'Thêm mới ' : 'Lưu lại'}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>
		</Form>
	);
};

export default FormDotDangKyNhuCau;
