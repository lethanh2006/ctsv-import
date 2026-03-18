import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { Button, Descriptions, Divider, Modal } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ViewDiemLopHocPhan = (props: {
	visible: boolean;
	setVisible: (vis: boolean) => void;
	sinhVienLopHocPhanId?: string;
}) => {
	const intl = useIntl();
	const { visible, setVisible, sinhVienLopHocPhanId } = props;
	const { record, getByIdModel } = useModel('daotaov2.hocky.sinhvienlophocphan');
	// const { record: recordLopHP, getByIdModel: getLopHocPhan } = useModel('daotaov2.hocky.lophocphan');
	const { danhSach: danhSachDauDiem, getModel: getDauDiem } = useModel('daotaov2.danhmuc.daudiemhocphan');

	useEffect(() => {
		getDauDiem();
	}, []);

	useEffect(() => {
		if (visible && sinhVienLopHocPhanId) getByIdModel(sinhVienLopHocPhanId); //.then((diemLHP) => getLopHocPhan(diemLHP.lopHocPhanId));
	}, [visible, sinhVienLopHocPhanId]);

	return (
		<>
			<Modal
				open={visible}
				onCancel={() => setVisible(false)}
				title={intl.formatMessage({ id: 'loptinchi.viewdiem.title' })}
				width={600}
				footer={<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>}
			>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.masv' })}>
						{record?.sinhVien?.ma}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.hoten' })}>
						{record?.sinhVien?.ten}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.loptinchi' })}>
						{record?.lopHocPhan?.ten}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.hocphan' })} span={2}>
						{record?.lopHocPhan?.hocPhan?.ma ?? ''} - {record?.lopHocPhan?.hocPhan?.soTinChi ?? ''}{' '}
						{intl.formatMessage({ id: 'loptinchi.viewdiem.tc' })}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.tenhocphan' })} span={2}>
						{record?.lopHocPhan?.hocPhan?.ten}
					</Descriptions.Item>
				</Descriptions>

				<Divider>{intl.formatMessage({ id: 'loptinchi.viewdiem.diemthanhphan.title' })}</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
					{danhSachDauDiem?.map((item) => (
						<Descriptions.Item label={item.ten} key={item._id}>
							{record?.[`diemThanhPhan${item.field}` as keyof LopHocPhan.IRecordSinhVienLopHP] ?? '--'}
						</Descriptions.Item>
					))}
				</Descriptions>

				<Divider>{intl.formatMessage({ id: 'loptinchi.viewdiem.diemketthuc.title' })}</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.diemlan1' })}>
						{record?.diemThi1 ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.diemthamdinh' })}>
						{record?.diemThamDinh ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.diemphuckhao' })}>
						{record?.diemPhucKhao ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.diemlan2' })}>
						{record?.diemThi2 ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.diemcuoi' })}>
						{record?.diemKthp ?? '--'}
					</Descriptions.Item>
				</Descriptions>

				<Divider>{intl.formatMessage({ id: 'loptinchi.viewdiem.diemtongket.title' })}</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.diem10' })}>
						{record?.diemTongKet ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.diem4' })}>
						{record?.diemThang4 ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.viewdiem.diemchu' })}>
						{record?.diemChu ?? '--'}
					</Descriptions.Item>
				</Descriptions>
			</Modal>
		</>
	);
};

export default ViewDiemLopHocPhan;
