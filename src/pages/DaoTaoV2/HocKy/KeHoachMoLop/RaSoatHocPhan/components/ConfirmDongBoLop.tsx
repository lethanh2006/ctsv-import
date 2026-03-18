import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Form, Modal, notification } from 'antd';
import { useModel } from 'umi';

const ConfirmDongBoLop = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	lopHocPhanList?: LopHocPhan.IRecord[];
}) => {
	const { visible, setVisible, lopHocPhanList } = props;
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { formSubmiting, postExecuteImpotModel } = useModel('daotaov2.hocky.lophocphan');
	const [form] = Form.useForm();

	const onCancel = () => {
		form.resetFields();
		setVisible(false);
	};

	const onFinish = async (values: any) => {
		if (!recHocKy?._id || !lopHocPhanList?.length) return;
		await postExecuteImpotModel(lopHocPhanList)
			.then((res) => {
				if (res.error) {
					const mes = res.validate?.map((item) => item.rowErrors?.join(', '))?.[0];
					notification.error({
						message: 'Có lỗi khi Đồng bộ lớp tín chỉ',
						description: mes,
					});
				}
			})
			.catch((er) => console.log(er))
			.finally(() => setVisible(false));
	};

	return (
		<Modal open={visible} onCancel={onCancel} title='Đồng bộ lớp tín chỉ' footer={null}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<div style={{ color: 'orange', fontSize: 48 }}>
					<ExclamationCircleFilled />
				</div>
				<span>
					Xác nhận đồng bộ <b>{lopHocPhanList?.length} lớp tín chỉ</b>
				</span>
			</div>

			<div className='form-footer'>
				<Button loading={formSubmiting} type='primary' onClick={onFinish}>
					Đồng bộ
				</Button>
				<Button onClick={onCancel}>Hủy</Button>
			</div>
		</Modal>
	);
};

export default ConfirmDongBoLop;
