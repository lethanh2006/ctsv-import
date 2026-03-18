import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';
import { ETrangThaiDot } from '@/services/DaoTaoV2/constant';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Descriptions, Form, Input, Modal, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalYeuCauChinhSua = (props: {
	visibleForm: boolean;
	setVisibleForm: (val: boolean) => void;
	getData: () => void;
}) => {
	const [form] = Form.useForm();
	const { record, putModel, formSubmiting } = useModel('daotaov2.ketquahoctap.quydoidiem.dotquydoidiem');
	const { visibleForm, setVisibleForm, getData } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DotQuyDoiDiem.IRecord) => {
		putModel(
			record?._id ?? '',
			{
				...record,
				ghiChu: values.ghiChu,
				trangThai: ETrangThaiDot.YEU_CAU_CHINH_SUA,
			},
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
					<Col span={24}>
						<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
							<Descriptions.Item label='Tên đợt'>{record?.hocKy?.ten}</Descriptions.Item>
							<Descriptions.Item label='Tên đợt'>{record?.tenDot}</Descriptions.Item>
							<Descriptions.Item label='Thời gian bắt đầu'>
								{dayjs(record?.thoiGianBatDau).format('DD/MM/YYYY')}
							</Descriptions.Item>
							<Descriptions.Item label='Thời gian kết thúc'>
								{dayjs(record?.thoiGianKetThuc).format('DD/MM/YYYY')}
							</Descriptions.Item>
							<Descriptions.Item label='Thời gian xin ý kiến'>
								{dayjs(record?.thoiGianBatDauLayYKien).format('DD/MM/YYYY')}
							</Descriptions.Item>
							<Descriptions.Item label='Thời gian kết thúc xin ý kiến'>
								{dayjs(record?.thoiGianKetThucLayYKien).format('DD/MM/YYYY')}
							</Descriptions.Item>
						</Descriptions>
					</Col>

					<Col span={24}>
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
