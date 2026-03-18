import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { Button, Col, Divider, Form, Modal, Row } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';

const ModalXinYKien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { record: recHocKy, formSubmiting, putModel } = useModel('daotaov2.hocky.hocky');
	const [form] = Form.useForm();
	const tgBdLayYKienKhgd = Form.useWatch('tgBdLayYKienKhgd', form);

	const onCancel = () => {
		form.resetFields();
		setVisible(false);
	};

	const onFinish = async (values: any) => {
		if (recHocKy?._id)
			putModel(recHocKy._id, values)
				.then(() => onCancel())
				.catch((er) => console.log(er));
	};

	return (
		<Modal open={visible} onCancel={onCancel} title='Xin ý kiến kế hoạch giảng dạy' width={600} footer={null}>
			<span>
				Gửi thông tin để xin ý kiến các phòng ban về kế hoạch giảng dạy <b>{recHocKy?.ten}</b>
			</span>

			<Divider>Thời gian xin ý kiến</Divider>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]} align='bottom'>
					<Col span={12}>
						<Form.Item
							name='tgBdLayYKienKhgd'
							label='Thời gian bắt đầu'
							rules={[...rules.required]}
							initialValue={recHocKy?.tgBdLayYKienKhgd}
						>
							<MyDatePicker onChange={() => form.validateFields(['tgKtLayYKienKhgd'])} allowClear />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='tgKtLayYKienKhgd'
							label='Thời gian kết thúc'
							rules={[...rules.required, ...rules.sauNgay(tgBdLayYKienKhgd, 'Thời gian bắt đầu')]}
							initialValue={recHocKy?.tgKtLayYKienKhgd}
						>
							<MyDatePicker disabledDate={(cur) => dayjs(cur).isBefore(tgBdLayYKienKhgd)} allowClear />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Lưu lại
					</Button>
					<Button onClick={() => onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalXinYKien;
