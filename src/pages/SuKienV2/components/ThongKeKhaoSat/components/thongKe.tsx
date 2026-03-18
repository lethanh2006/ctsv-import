import { ELoaiCauHoiPublic } from '@/services/TienIch/constant';
import { useModel } from 'umi';
import NumericChoice from '../../ViewKhaoSat/Question/NumericChoice';
import ThongKeGrid from '../ThongKeType/GridChoice';
import ThongKeSelectChoice from '../ThongKeType/SelectChoice';

const ThongKe = () => {
	const { dataThongKeKhaoSat: thongKe } = useModel('sukienv2');

	const renderThongKe = (question: any, index: number) => {
		let questionEleMent = <div />;
		if (question.loai === ELoaiCauHoiPublic.SINGLE_CHOICE || question.loai === ELoaiCauHoiPublic.MULTIPLE_CHOICE)
			questionEleMent = <ThongKeSelectChoice ketQua={question.ketQua} />;
		else if (
			question.loai === ELoaiCauHoiPublic.GRID_MULTIPLE_CHOICE ||
			question.loai === ELoaiCauHoiPublic.GRID_SINGLE_CHOICE
		)
			questionEleMent = <ThongKeGrid ketQua={question.ketQua} />;
		else if (question.loai === ELoaiCauHoiPublic.NUMERIC_RANGE)
			questionEleMent = <NumericChoice ketQua={question.ketQua} />;
		return (
			<div key={question._id} className='question-item'>
				<div className='question-header'>
					<div className='question-title'>
						Câu {index + 1}: {question.noiDungCauHoi} {question.batBuoc && <span className='required'>*</span>}
					</div>
				</div>
				<br />

				{question.soLuongTraLoi ? questionEleMent : null}
			</div>
		);
	};

	return (
		<>
			<h3>{thongKe?.tieuDe}</h3>
			<p>{thongKe?.moTa}</p>

			{thongKe?.thongKeKhoi?.map((item, index) => {
				return (
					<div key={index} style={{ marginBottom: 24 }}>
						<div className='fw500'>{item?.tieuDe}</div>
						<div>{item?.moTa}</div>

						{item?.thongKeCauHoi?.map((cauHoi, i) => renderThongKe(cauHoi, i))}
					</div>
				);
			})}
		</>
	);
};
export default ThongKe;
