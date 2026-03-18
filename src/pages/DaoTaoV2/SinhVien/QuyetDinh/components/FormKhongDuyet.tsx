import type { QuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/QuyetDinh/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Descriptions, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormKhongDuyet = (props: {
	isThoiHoc: boolean;
	visible: boolean;
	setVisible: (val: boolean) => void;
	getData: () => void;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { isThoiHoc, visible, setVisible, getData } = props;
	const { khongDuyetQuyetDinhModel, formSubmiting, record } = useModel(
		isThoiHoc ? 'quyetdinh.thoihoc' : 'quyetdinh.baoluu',
	);

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
	}, [visible]);

	const onFinish = async (values: QuyetDinh.ISinhVienBaoLuuThoiHoc) => {
		khongDuyetQuyetDinhModel(record?._id ?? '', values)
			.then(() => {
				getData();
				setVisible(false);
			})
			.catch((er) => console.log(er));
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2 }}>
				<Descriptions.Item label='Mã sinh viên'>{record?.maSinhVien}</Descriptions.Item>
				<Descriptions.Item label='Họ tên'>{record?.hoTen}</Descriptions.Item>
				<Descriptions.Item label='Khóa'>{record?.khoaSinhVien?.ten}</Descriptions.Item>
				<Descriptions.Item label='Ngành'>{record?.nganh?.ten}</Descriptions.Item>
				<Descriptions.Item label='Thời gian gửi yêu cầu'>
					<></>
				</Descriptions.Item>
			</Descriptions>

			<Form.Item name='lyDo' label='Lý do' rules={[...rules.required, ...rules.text, ...rules.length(5000)]}>
				<Input.TextArea rows={3} placeholder='Nhập lý do' />
			</Form.Item>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					Xác nhận
				</Button>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormKhongDuyet;
