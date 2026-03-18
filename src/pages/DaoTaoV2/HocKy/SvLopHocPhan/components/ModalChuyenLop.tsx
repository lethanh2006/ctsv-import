import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { Descriptions, Modal } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import DangKyLopHocPhan from './DangKyLopHocPhan';

/**
 * Phiên bản rút gọn của Đăng ký lớp tín chỉ tại VWA Connect
 * @param props
 * @returns
 */
const ModalChuyenLop = (props: { onOk: () => void }) => {
	const { record: recSinhVienLopHp, chuyenLopSinhVienModel } = useModel('daotaov2.hocky.sinhvienlophocphan');
	const { record: recLopHP } = useModel('daotaov2.hocky.lophocphan');
	const { visibleForm, setVisibleForm } = useModel('daotaov2.dangkytinchi.sinhviendotdangky');

	/**
	 * Thực hiện chuyển lớp
	 */
	const onFinish = (lopDangKy: LopHocPhan.IRecord) => {
		if (lopDangKy?.ten && recSinhVienLopHp?._id) {
			chuyenLopSinhVienModel(recSinhVienLopHp._id, lopDangKy.ten)
				.then(() => {
					if (props.onOk) props.onOk(); // Get Data
					setVisibleForm(false);
				})
				.catch((er) => console.log(er));
		}
	};

	return (
		<Modal
			title='Chuyển lớp sinh viên'
			open={visibleForm}
			footer={null}
			width={800}
			onCancel={() => setVisibleForm(false)}
		>
			{recSinhVienLopHp?._id ? (
				<>
					<Descriptions title='Thông tin sinh viên' column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
						<Descriptions.Item label='Họ tên'>{recSinhVienLopHp.sinhVien?.ten}</Descriptions.Item>
						<Descriptions.Item label='Mã sinh viên'>{recSinhVienLopHp.sinhVien?.ma}</Descriptions.Item>
						<Descriptions.Item label='Ngày sinh'>
							{recSinhVienLopHp.sinhVien?.ngaySinh
								? dayjs(recSinhVienLopHp.sinhVien.ngaySinh).format('DD/MM/YYYY')
								: ''}
						</Descriptions.Item>
						<Descriptions.Item label='Số điện thoại'>{recSinhVienLopHp.sinhVien?.soDienThoai}</Descriptions.Item>
					</Descriptions>

					{visibleForm ? (
						<DangKyLopHocPhan
							maHocKy={recLopHP?.maHocKy ?? ''}
							maHocPhan={recLopHP?.maHocPhan ?? ''}
							onCancel={() => setVisibleForm(false)}
							onOk={onFinish}
							sinhVienSsoId={recSinhVienLopHp.sinhVienSsoId}
						/>
					) : null}
				</>
			) : null}
		</Modal>
	);
};

export default ModalChuyenLop;
