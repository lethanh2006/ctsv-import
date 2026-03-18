import StepDotChamDiemRenLuyen from '@/pages/DiemRenLuyen/Dot/Step';
import DanhSachSinhVien from '@/pages/DiemRenLuyen/PhieuDiem/components/DanhSachSinhVien';
import { Card } from 'antd';
import { useIntl } from 'umi';

const PhieuDiemRenLuyen = (props: { idLop?: string }) => {
	const intl = useIntl();

	const MainContent = (
		<>
			<div style={{ marginBottom: 12 }}>
				<StepDotChamDiemRenLuyen />
			</div>

			<DanhSachSinhVien idLop={props?.idLop} />
		</>
	);

	return (
		<>
			{props?.idLop ? (
				MainContent
			) : (
				<Card title={intl.formatMessage({ id: 'lophanhchinh.phieudiem.title' })}>{MainContent}</Card>
			)}
		</>
	);
};
export default PhieuDiemRenLuyen;
