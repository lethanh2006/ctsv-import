import { useModel } from 'umi';
import { Button, Descriptions, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const ViewChiTiet = (props: { setVisible?: any; hasEdit?: boolean }) => {
	const { record, setEdit, setVisibleForm } = useModel('daotaov2.namhoc.khoasinhvien');

	const handleEdit = () => {
		setEdit(true);
		setVisibleForm(true);
		props?.setVisible(false);
	};

	return (
		<>
			<Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} bordered>
				<Descriptions.Item label='Tên khóa sinh viên'>{record?.ten ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Năm học'>{record?.namHoc?.ten ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Hình thức đào tạo'>{record?.hinhThucDaoTao?.ten ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Trình độ đào tạo'>{record?.trinhDoDaoTao?.dmTrinhDo?.ten ?? '--'}</Descriptions.Item>
			</Descriptions>

			{props.hasEdit !== false ? (
				<Form.Item style={{ margin: '20px 0', textAlign: 'center' }}>
					<Button type='primary' icon={<EditOutlined />} onClick={() => handleEdit()}>
						Chỉnh sửa
					</Button>
				</Form.Item>
			) : null}
		</>
	);
};

export default ViewChiTiet;
