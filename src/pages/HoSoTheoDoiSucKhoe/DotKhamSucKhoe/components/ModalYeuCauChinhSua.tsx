import { ETrangThaiKhamSucKhoe } from '@/services/DotKhamSuKhoe/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Descriptions, Form, Input, Modal, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalYeuCauChinhSua = (props: { visibleForm: boolean; setVisibleForm: (val: boolean) => void }) => {
	const [form] = Form.useForm();
	const { record, putModel, getModel, formSubmiting } = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { visibleForm, setVisibleForm } = props;

	const getData = () => getModel({ maHocKy: recHocKy?.ma });

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		putModel(
			record?._id ?? '',
			{ ...record, ghiChu: values.ghiChu, trangThai: ETrangThaiKhamSucKhoe.YEU_CAU_CHINH_SUA },
			getData,
		)
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			width={600}
			title='Yêu cầu chỉnh sửa'
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24} md={24}>
						<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
							<Descriptions.Item label='Học kỳ'>{record?.tenHocKy}</Descriptions.Item>
							<Descriptions.Item label='Tên đợt khai báo'>{record?.ten}</Descriptions.Item>
							<Descriptions.Item label='Thời gian bắt đầu'>
								{dayjs(record?.thoiGianBatDau).format('DD/MM/YYYY')}
							</Descriptions.Item>
							<Descriptions.Item label='Thời gian kết thúc'>
								{dayjs(record?.thoiGianKetThuc).format('DD/MM/YYYY')}
							</Descriptions.Item>
						</Descriptions>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.required]}>
							<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Gửi yêu cầu
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalYeuCauChinhSua;
