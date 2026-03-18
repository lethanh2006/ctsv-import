import { Button, Divider, Form, Modal } from 'antd';
import { useModel } from 'umi';
import FormItemSiSo from './FormItemSiSo';

const ModalCapNhatDeCuongHPHK = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	getData: () => void;
}) => {
	const { visible, setVisible, getData } = props;
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { formSubmiting, khoiTaoNhuCauHocPhanModel } = useModel('daotaov2.hocphan.decuonghphk');
	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		if (recHocKy?.ma)
			khoiTaoNhuCauHocPhanModel({ ...values, maHocKy: recHocKy?.ma })
				.then(() => {
					if (getData) getData();
					setVisible(false);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Modal
			open={visible}
			onCancel={() => setVisible(false)}
			title='Rà soát nhu cầu học phần'
			footer={null}
			width={800}
		>
			<Divider>Thông số mở lớp</Divider>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<FormItemSiSo />

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Lưu lại
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalCapNhatDeCuongHPHK;
