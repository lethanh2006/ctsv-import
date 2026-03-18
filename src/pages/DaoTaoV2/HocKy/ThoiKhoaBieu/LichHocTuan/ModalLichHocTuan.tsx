import { type ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormLichHocTuan from './Form';
import './style.less';

const ModalLichHocTuan = (props: {
	onOk: (item: ThoiKhoaBieu.ILichHocTuan) => void;
	onCancel: () => void;
	visible: boolean;
	lichTuan?: ThoiKhoaBieu.ILichHocTuan;
	fromPhanCong?: boolean;
}) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { danhSach: danhSachNhanSu } = useModel('daotaov2.hocky.nhansulophocphan');
	const { onOk, fromPhanCong, onCancel, lichTuan, visible } = props;
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visible) resetFieldsForm(form, { maNhomTietHoc: recHocKy?.maNhomTietHoc ?? APP_CONFIG_INIT_MA_NHOM_TIET_HOC });
		else if (lichTuan?.thu) form.setFieldsValue(lichTuan);
	}, [visible]);

	const onFinish = (values: ThoiKhoaBieu.ILichHocTuan) => {
		const ns = danhSachNhanSu.find((item) => item.nhanSuSsoId === values.nhanSuSsoId);
		if (onOk) onOk({ ...values, nhanSu: ns?.nhanSu }); // Gán vào để hiện tên giảng viên ở ngoài table
	};

	return (
		<Modal open={visible} onCancel={onCancel} footer={null} title='Lịch học tuần' width={800} maskClosable={false}>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<FormLichHocTuan fromPhanCong={fromPhanCong} thu={lichTuan?.thu} />

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{!lichTuan?.thu ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button onClick={onCancel}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalLichHocTuan;
