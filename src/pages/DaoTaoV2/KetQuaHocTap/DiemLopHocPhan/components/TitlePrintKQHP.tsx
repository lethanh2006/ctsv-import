import { useModel } from 'umi';

const TitlePrintKQHP = () => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan } = useModel('daotaov2.hocphan.decuonghphk');

	return (
		<div className='to-print'>
			<div className='title'>KẾT QUẢ HỌC TẬP HỌC PHẦN</div>
			<div className='sub-title'>
				Học kỳ: <b>{recHocKy?.ten}</b>
				<br />
				Tên học phần: <b>{recHocPhan?.tenHocPhan}</b>
				<br />
				Tên học phần: <b>{recHocPhan?.maHocPhan}</b>
			</div>
		</div>
	);
};

export default TitlePrintKQHP;
