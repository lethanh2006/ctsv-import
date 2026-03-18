import MyDatePicker from '@/components/MyDatePicker';
import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, InputNumber, Row, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormKetQuaTheChat = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title, getData } = props;
	const { record: recDot } = useModel('tienich.thechat.dot');
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel(
		'tienich.thechat.ketquathechat',
	);
	const maDanhMuc: string = Form.useWatch('maDanhMuc', form);

	const doLuong = recDot?.danhMucTheChat?.find((item) => item?.maDanhMuc === maDanhMuc);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				thoiGianDanhGia: moment(),
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: TheChat.IKetQuaTheChat) => {
		values.dotDanhGiaTheChatId = recDot?._id ?? '';

		if (record?._id) {
			await putModel(record?._id ?? '', values, getData);
		} else {
			await postModel(values, getData);
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item name='ssoIdSinhVien' label='Sinh viên' rules={[...rules.required]}>
							<SelectSinhVienDebounce disabled={edit} />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='maDanhMuc' label='Tiêu chí đánh giá' rules={[...rules.required]}>
							<Select
								placeholder='Chọn tiêu chí đánh giá'
								options={recDot?.danhMucTheChat?.map((item) => ({
									value: item?.maDanhMuc,
									label: item.danhMuc?.ten,
								}))}
								disabled={edit}
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item
							name='giaTri'
							label={`Điểm đánh giá ${doLuong?.danhMuc?._id ? `(${doLuong?.danhMuc?.donViDoLuong})` : ''}`}
							rules={[...rules.required]}
						>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập điểm đánh giá' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='thoiGianDanhGia' label='Thời gian đánh giá' rules={[...rules.required]}>
							<MyDatePicker format={'HH:mm DD/MM/YYYY'} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit
							? intl.formatMessage({ id: 'global.button.themmoi' })
							: intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormKetQuaTheChat;
