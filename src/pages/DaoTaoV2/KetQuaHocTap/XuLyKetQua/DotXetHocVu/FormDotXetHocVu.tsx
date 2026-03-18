import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDotXetHocVu = () => {
	const intl = useIntl();
	const { record: recHocKy, putModel, danhSach, setDanhSach, setRecord } = useModel('daotaov2.hocky.hocky');
	const [form] = Form.useForm();
	const tgXetHvuSb = Form.useWatch('tgXetHvuSb', form) ?? recHocKy?.tgXetHvuSb;
	const tgBdLayYKienHvu = Form.useWatch('tgBdLayYKienHvu', form) ?? recHocKy?.tgBdLayYKienHvu;
	const tgKtLayYKienHvu = Form.useWatch('tgKtLayYKienHvu', form) ?? recHocKy?.tgKtLayYKienHvu;
	const tgHopHoiDongHvu = Form.useWatch('tgHopHoiDongHvu', form) ?? recHocKy?.thoiGianBatDau;

	useEffect(() => {
		form.setFieldsValue(recHocKy);
	}, [recHocKy?._id]);

	const onFinish = (values: any) => {
		if (recHocKy?._id)
			putModel(recHocKy?._id ?? '', values, () => {
				const temp = [...danhSach].map((item) => (item._id === recHocKy._id ? { ...item, ...values } : item));
				setDanhSach(temp);
			})
				.then((rec) => setRecord(rec))
				.catch((er) => console.log(er));
	};

	return (
		<>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item label='Kỳ học'>
							<Input value={recHocKy?.ten} disabled />
						</Form.Item>
					</Col>

					<Col span={24} md={8}>
						<Form.Item
							label='Thời gian xét sơ bộ'
							name='tgXetHvuSb'
							rules={[...rules.sauNgay(recHocKy?.thoiGianBatDau, 'Thời gian bắt đầu kỳ học')]}
						>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(recHocKy?.thoiGianBatDau)} />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							label='Thời gian chốt kết quả xét sơ bộ'
							name='tgTbKqXetHvuSb'
							rules={[...rules.required, ...rules.sauNgay(tgXetHvuSb, 'Thời gian xét sơ bộ')]}
						>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(tgXetHvuSb)} />
						</Form.Item>
					</Col>

					<Col span={24} md={8}>
						<Form.Item
							label='Thời gian bắt đầu lấy ý kiến'
							name='tgBdLayYKienHvu'
							rules={[...rules.required, ...rules.sauNgay(tgXetHvuSb, 'Thời gian xét sơ bộ')]}
						>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(tgXetHvuSb)} />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							label='Thời gian kết thúc lấy ý kiến'
							name='tgKtLayYKienHvu'
							rules={[...rules.required, ...rules.sauNgay(tgBdLayYKienHvu, 'Thời gian bắt đầu lấy ý kiến')]}
						>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(tgBdLayYKienHvu)} />
						</Form.Item>
					</Col>

					<Col span={24} md={8}>
						<Form.Item
							label='Thời gian họp hội đồng'
							name='tgHopHoiDongHvu'
							rules={[...rules.sauNgay(tgKtLayYKienHvu, 'Thời gian kết thúc lấy ý kiến')]}
						>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(tgKtLayYKienHvu)} />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							label='Thời gian thông báo kết quả'
							name='tgTbKqHvu'
							rules={[...rules.sauNgay(tgHopHoiDongHvu, 'Thời gian họp hội đồng')]}
						>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(tgHopHoiDongHvu)} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button
						disabled={recHocKy?.daChotKqCanhBao && recHocKy?.daChotKqThoiHoc}
						type='primary'
						htmlType='submit'
						icon={<SaveOutlined />}
					>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
				</div>
			</Form>
		</>
	);
};

export default FormDotXetHocVu;
