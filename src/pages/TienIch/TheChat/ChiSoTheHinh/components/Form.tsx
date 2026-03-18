import SelectSinhVienDebounce from '@/pages/DaoTaoV2/SinhVien/component/Select';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormChiSoTheHinh = (props: any) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { title, getData } = props;
	const { record: recDot } = useModel('tienich.thechat.dot');
	const { record: recTheChat, setRecord } = useModel('tienich.thechat.ketquathechat');
	const { record, setVisibleForm, postModel, putModel, formSubmiting, visibleForm, getOneModel, loading } =
		useModel('tienich.thechat.chisothehinh');

	useEffect(() => {
		if (visibleForm && recDot?._id && recTheChat?.ssoIdSinhVien)
			getOneModel({ dotDanhGiaTheChatId: recDot?._id, ssoIdSinhVien: recTheChat?.ssoIdSinhVien });
	}, [visibleForm, recDot?._id, recTheChat?.ssoIdSinhVien]);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setRecord({} as TheChat.IKetQuaTheChat);
		} else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: TheChat.IChiSoHinhThe) => {
		values.dotDanhGiaTheChatId = recDot?._id ?? '';

		if (recTheChat?._id || record?._id) {
			values.ssoIdSinhVien = record?._id ? record?.ssoIdSinhVien ?? '' : recTheChat?.ssoIdSinhVien ?? '';
		}

		if (record?._id) {
			await putModel(record?._id ?? '', values, getData);
		} else {
			await postModel(values, getData);
		}
	};

	return (
		<Card title={`${record?._id ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`} loading={loading}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						{recTheChat?._id || record?._id ? (
							<Form.Item label='Sinh viên'>
								<Input value={record?._id ? record?.tenSv : recTheChat?.tenSv} disabled />
							</Form.Item>
						) : (
							<Form.Item name='ssoIdSinhVien' label='Sinh viên' rules={[...rules.required]}>
								<SelectSinhVienDebounce />
							</Form.Item>
						)}
					</Col>
					<Col span={24}>
						<Form.Item name='canNang' label='Cân nặng (kg)'>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập cân nặng' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='chieuCao' label='Chiều cao (cm)'>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập chiều cao' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='vongEo' label='Vòng eo (cm)'>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập òng eo' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='vongMong' label='Vòng mông (cm)'>
							<InputNumber style={{ width: '100%' }} placeholder='Nhập vòng mông' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!record?._id
							? intl.formatMessage({ id: 'global.button.themmoi' })
							: intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormChiSoTheHinh;
