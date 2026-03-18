import { useModel } from 'umi';

const TitlePrintDiemThanhPhan = () => {
	const { record: recHocPhan } = useModel('daotaov2.hocky.lophocphan');

	return (
		<div className='to-print'>
			<div className='title'>DANH SÁCH ĐIỂM THÀNH PHẦN</div>
			<div className='sub-title'>
				Mã Lớp: <b>{recHocPhan?.ten}</b>
				<br />
				Tên học phần: <b>{recHocPhan?.hocPhan?.ten}</b>
			</div>
		</div>
	);
};

export default TitlePrintDiemThanhPhan;
