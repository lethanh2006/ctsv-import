import FormItemKhoaNganh from '@/pages/DaoTaoV2/KhoaNganhDotDangKy/FormItemKhoaNganh';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormKhoaNganhTheChat = (props: { onOk: (val: TheChat.IDanhSachKhoaNganh) => void }) => {
	const [form] = Form.useForm();
	const { onOk } = props;
	const { danhSach: dsKhoaNganh } = useModel('daotaov2.namhoc.khoanganh');
	const { setVisibleForm, visibleForm, record, edit, isView } = useModel('tienich.thechat.khoanganh');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?.index) form.setFieldsValue(record);
	}, [visibleForm, record?.index]);

	const onFinish = async (values: any) => {
		const selectedMaKhoaNganh = values.danhSachKhoaNganh || [];

		const danhSachKhoaNganh =
			dsKhoaNganh
				?.filter((item) => selectedMaKhoaNganh.includes(item?.ma))
				?.map((i) => ({
					maKhoaNganh: i?.ma,
					tenKhoaNganh: i?.ten,
				})) ?? [];

		danhSachKhoaNganh.forEach((k) => onOk(k as any));
		setVisibleForm(false);
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={24}>
					<Form.Item name='danhSachKhoaNganh' label='Danh sách khóa ngành áp dụng' rules={[...rules.required]}>
						<FormItemKhoaNganh />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				{!isView ? (
					<Button htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
				) : null}
				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormKhoaNganhTheChat;
