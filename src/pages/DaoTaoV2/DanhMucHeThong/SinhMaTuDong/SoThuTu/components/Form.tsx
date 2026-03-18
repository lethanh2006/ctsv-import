import { nguonSinhMa } from '@/services/DaoTaoV2/DanhMucHeThong/SinhMaTuDong/constant';
import type { SinhMaTuDong } from '@/services/DaoTaoV2/DanhMucHeThong/SinhMaTuDong/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Descriptions, Form, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormSoThuTuMa = (props: { title?: string; getData?: () => void; [key: string]: any }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('daotaov2.danhmuc.sothutuma');
	const title = props?.title ?? '';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: SinhMaTuDong.ISoThuTu) => {
		if (edit)
			putModel(record?._id ?? '', values, () => {})
				.then(() => {
					if (props.getData) props.getData();
				})
				.catch((er) => console.log(er));
		else
			postModel(values, () => {})
				.then(() => {
					if (props.getData) props.getData();
				})
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Descriptions column={1}>
				<Descriptions.Item label='Loại sinh mã'>{record?.source ? nguonSinhMa[record?.source] : ''}</Descriptions.Item>
				<Descriptions.Item label='Mã'>{record?.name}</Descriptions.Item>
			</Descriptions>

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item
							name='count'
							label='Số thứ tự hiện tại'
							rules={[...rules.required, ...rules.number(999999, record?.count ?? 1, false)]}
						>
							<InputNumber placeholder='Nhập số thứ tự hiện tại' min={record?.count ?? 1} style={{ width: '100%' }} />
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

export default FormSoThuTuMa;
