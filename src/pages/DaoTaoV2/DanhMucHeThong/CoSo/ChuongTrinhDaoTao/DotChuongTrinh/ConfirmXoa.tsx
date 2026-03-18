import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ConfirmXoaKhoiHocPhan = (props: {
	visible: boolean;
	onCancel: () => void;
	onOk: () => void;
	selectedMas: string[];
}) => {
	const { visible, onCancel, onOk, selectedMas } = props;
	const { combineChuongTrinh, record } = useModel('daotaov2.chuongtrinhdaotao.dotchuongtrinh');
	const { deleteKhoiHocPhanModel, formSubmiting } = useModel('daotaov2.chuongtrinhdaotao.thaotacrasoat');
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
	}, [visible]);

	const onFinish = (values: any) => {
		const listKhoiHpCtGoc = selectedMas.map((index) => combineChuongTrinh.at(+index) ?? {});
		const khoiHocPhanIds = listKhoiHpCtGoc.map((item) => item.listKhoiHpCtGoc?.[0]?.idKhoiHpCt ?? '');

		if (khoiHocPhanIds.length && record?.ma)
			deleteKhoiHocPhanModel(khoiHocPhanIds, record.ma, values.ghiChu).then(() => {
				if (onOk) onOk();
			});
	};

	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			width={600}
			footer={null}
			title='Xóa khối học phần'
			maskClosable={false}
		>
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
				<div>
					Xác nhận xóa {selectedMas.length} khối học phần khỏi chương trình {record?.ma}?
				</div>
			</div>

			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='ghiChu' label='Ghi chú' rules={[...rules.text, ...rules.length(200)]}>
					<Input.TextArea rows={2} placeholder='Nhập ghi chú lý do' />
				</Form.Item>

				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						Xác nhận
					</Button>
					<Button onClick={onCancel}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ConfirmXoaKhoiHocPhan;
