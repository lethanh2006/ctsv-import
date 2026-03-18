import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ViewVanBanQuyDinh = (props: {
	visible: boolean;
	setVisible: (vis: boolean) => void;
	condition: Partial<Pick<VanBanQuyDinh.IRecord, '_id' | 'ma'>>;
	hasEdit?: boolean;
}) => {
	const { visible, setVisible, condition, hasEdit } = props;
	const { record, setEdit, setVisibleForm, getOneModel } = useModel('daotaov2.danhmuc.vanbanquydinh');

	useEffect(() => {
		getOneModel(condition);
	}, [JSON.stringify(condition)]);

	return (
		<Modal
			open={visible}
			onCancel={() => setVisible(false)}
			title='Chi tiết căn cứ pháp lý'
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			width={600}
		>
			<Descriptions column={1}>
				<Descriptions.Item label='Tên căn cứ'>{record?.ten}</Descriptions.Item>
				<Descriptions.Item label='Mã'>{record?.ma}</Descriptions.Item>
				<Descriptions.Item label='Nội dung'>{record?.noiDung}</Descriptions.Item>
				<Descriptions.Item label='Tệp đính kèm'>
					<a onClick={() => window.open(record?.url || '')}>
						<EyeOutlined /> Xem tệp tin
					</a>
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian cập nhật'>
					{dayjs(record?.updatedAt).format('HH:mm DD/MM/YYYY')}
				</Descriptions.Item>
			</Descriptions>

			{hasEdit ? (
				<div style={{ textAlign: 'center' }}>
					<Button
						icon={<EditOutlined />}
						type='primary'
						onClick={() => {
							setEdit(true);
							setVisibleForm(true);
							setVisible(false);
						}}
					>
						Chỉnh sửa
					</Button>
				</div>
			) : null}
		</Modal>
	);
};

export default ViewVanBanQuyDinh;
