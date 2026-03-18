import MyDatePicker from '@/components/MyDatePicker';
import type { NamHoc } from '@/services/DaoTaoV2/NamHoc/NamHoc/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormXinYKien = (props: { visible: boolean; setVisible?: (val: boolean) => void }) => {
	const [form] = Form.useForm();
	const { record, putModel, formSubmiting, getModel, setRecord } = useModel('daotaov2.namhoc.namhoc');
	const { visible, setVisible } = props;
	const ngayBdLayYKien = Form.useWatch('ngayBdLayYKien', form);

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [visible]);

	const onFinish = async (values: NamHoc.IRecord) => {
		putModel(record?._id ?? '', values)
			.then(() => {
				getModel().then((res) => setRecord(res.find((item) => record?._id === item._id)));
				if (setVisible) setVisible(false);
			})
			.catch((er) => console.log(er));
	};
	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]} style={{ marginBottom: 12, maxWidth: 600, margin: 'auto' }}>
				<Col xs={24} md={12}>
					<Form.Item name='ngayBdLayYKien' label='Thời gian bắt đầu' rules={[...rules.required]}>
						<MyDatePicker
							onChange={(val) => {
								form.validateFields(['ngayKtLayYKien']);
							}}
						/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						name='ngayKtLayYKien'
						label='Thời gian kết thúc'
						rules={[...rules.required, ...rules.sauNgay(ngayBdLayYKien, 'Thời gian bắt đầu')]}
					>
						<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(ngayBdLayYKien)} />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button disabled={record?.daChotKeHoachNamHoc} loading={formSubmiting} htmlType='submit' type='primary'>
					Lưu lại
				</Button>
				{!!setVisible ? <Button onClick={() => setVisible(false)}>Hủy</Button> : null}
			</div>
		</Form>
	);
};

export default FormXinYKien;
