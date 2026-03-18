import { useModel } from 'umi';

const TitlePrintKTHP = () => {
	const { record: recHocPhan } = useModel('daotaov2.hocphan.decuonghphk');

	return (
		<div className='to-print'>
			<div className='title'>DANH SÁCH ĐIỂM KẾT THÚC HỌC PHẦN</div>
			<div className='sub-title'>
				Mã học phần: <b>{recHocPhan?.maHocPhan}</b>
				<br />
				Tên học phần: <b>{recHocPhan?.tenHocPhan}</b>
			</div>
		</div>
	);
};

export default TitlePrintKTHP;
