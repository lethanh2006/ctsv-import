import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Button } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ViewHocLieu = (props: {
	visible: boolean;
	setVisible: (vis: boolean) => void;
	hocLieuId: string;
	hasEdit?: boolean;
}) => {
	const { visible, setVisible, hocLieuId: vanBanId, hasEdit } = props;
	const { getByIdModel, record, setEdit, setVisibleForm } = useModel('daotaov2.danhmuc.hoclieu');

	useEffect(() => {
		getByIdModel(vanBanId);
	}, [vanBanId]);

	return (
		<Modal
			open={visible}
			onCancel={() => setVisible(false)}
			title='Chi tiết học liệu'
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
		>
			<Descriptions column={{ xs: 1, sm: 1, md: 1 }}>
				<Descriptions.Item label='Tên học liệu'>{record?.ten}</Descriptions.Item>
				<Descriptions.Item label='Mã học liệu / ISBN'>{record?.ma}</Descriptions.Item>
				<Descriptions.Item label='Loại học liệu'>{record?.loaiHocLieu}</Descriptions.Item>
				<Descriptions.Item label='Tác giả'>{record?.tacGia}</Descriptions.Item>
				<Descriptions.Item label='Tệp đính kèm'>
					<a onClick={() => window.open(record?.url)}>
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

export default ViewHocLieu;
