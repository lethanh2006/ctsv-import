import { useModel } from 'umi';

const TitlePrintKQHT = () => {
	const { record } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');
	const { record: recSinhVien } = useModel('daotaov2.sinhvien.sinhvien');

	return (
		<div className='to-print'>
			<div className='title'>KẾT QUẢ HỌC TẬP SINH VIÊN</div>
			<div className='sub-title'>
				Họ tên: <b>{record?.sinhVien?.ten ?? recSinhVien?.ten}</b>
				<br />
				Mã sinh viên: <b>{record?.sinhVien?.ma ?? recSinhVien?.ma}</b>
				<br />
				Lớp hành chính: <b>{record?.lopHanhChinh?.ten ?? recSinhVien?.lopHanhChinhList?.[0]?.ten}</b>
			</div>
		</div>
	);
};

export default TitlePrintKQHT;
