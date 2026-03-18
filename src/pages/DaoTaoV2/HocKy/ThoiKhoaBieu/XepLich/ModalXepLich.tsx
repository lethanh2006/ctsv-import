import { type ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormLichHocTuan from '../LichHocTuan/Form';
import './style.less';

const ModalXepLich = (props: {
	onOk: (item: ThoiKhoaBieu.ILichHocTuan) => void;
	onCancel: () => void;
	visible: boolean;
	lichTuan?: Partial<ThoiKhoaBieu.ILichHocTuan>;
}) => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recLopHp, setRecord: setLopHp, danhSachXepLich } = useModel('daotaov2.hocky.lophocphan');
	const { formSubmiting } = useModel('daotaov2.hocky.thoikhoabieu');
	const { onOk, onCancel, lichTuan, visible } = props;
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visible) resetFieldsForm(form, { maNhomTietHoc: recHocKy?.maNhomTietHoc ?? APP_CONFIG_INIT_MA_NHOM_TIET_HOC });
		else if (lichTuan?.thu) form.setFieldsValue({ ...lichTuan, lopHocPhanId: recLopHp?._id });
	}, [visible]);

	const onFinish = (values: ThoiKhoaBieu.ILichHocTuan) => {
		if (onOk) onOk({ ...lichTuan, ...values });
	};

	return (
		<Modal open={visible} onCancel={onCancel} footer={null} title='Lịch học tuần' width={800} maskClosable={false}>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				{lichTuan?.lopHocPhanId ? (
					<Form.Item label='Lớp tín chỉ'>
						<Input value={`${lichTuan.tenLop} - ${lichTuan.tenHocPhan}`} disabled />
					</Form.Item>
				) : (
					<Form.Item name='lopHocPhanId' label='Lớp tín chỉ' rules={[...rules.required]}>
						<Select
							onChange={(val) => setLopHp(danhSachXepLich.find((item) => item._id === val))}
							options={danhSachXepLich.map((item) => ({
								key: item._id,
								value: item._id,
								label: `${item.ten} - ${item.hocPhan?.ten}`,
							}))}
							placeholder='Chọn lớp tín chỉ'
						/>
					</Form.Item>
				)}

				<FormLichHocTuan thu={lichTuan?.thu} maPhong={lichTuan?.phongHoc} />

				<div className='form-footer'>
					<Button htmlType='submit' type='primary' loading={formSubmiting}>
						{!lichTuan?.id ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button onClick={onCancel}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalXepLich;
