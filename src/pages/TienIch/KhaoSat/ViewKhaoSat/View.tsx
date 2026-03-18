import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import { ELoaiCauHoiPublic } from '@/services/TienIch/constant';
import { Divider } from 'antd';
import '../components/block.css';
import FileChoice from './Question/FileChoice';
import GridChoice from './Question/GridChoice';
import MultipleChoice from './Question/MultipleChoice';
import NumericChoice from './Question/NumericChoice';
import SingleChoice from './Question/SingleChoice';
import Text from './Question/Text';

const ViewTraLoiKhaoSat = (prosp: { khaoSat?: BieuMau.Record; cauTraLoi?: any }) => {
	const { khaoSat, cauTraLoi } = prosp;

	const renderQuestion = (question: BieuMau.CauHoi, indexKhoi: number, indexCauHoi: number) => {
		let questionEleMent = <div />;
		if (question.loai === ELoaiCauHoiPublic.SINGLE_CHOICE)
			questionEleMent = (
				<SingleChoice
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.danhSachTraLoi?.find((item: any) => item?.idCauHoi === question?._id)}
				/>
			);
		else if (question.loai === ELoaiCauHoiPublic.MULTIPLE_CHOICE)
			questionEleMent = (
				<MultipleChoice
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.danhSachTraLoi?.find((item: any) => item?.idCauHoi === question?._id)}
				/>
			);
		else if (
			question.loai === ELoaiCauHoiPublic.TEXT ||
			question.loai === ELoaiCauHoiPublic.RENDER_INPUT ||
			question.loai === ELoaiCauHoiPublic.RENDER_INPUT_RATING
		)
			questionEleMent = (
				<Text
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.danhSachTraLoi?.find((item: any) => item?.idCauHoi === question?._id)}
				/>
			);
		else if (
			question.loai === ELoaiCauHoiPublic.GRID_MULTIPLE_CHOICE ||
			question.loai === ELoaiCauHoiPublic.GRID_SINGLE_CHOICE
		)
			questionEleMent = (
				<GridChoice
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.danhSachTraLoi?.find((item: any) => item?.idCauHoi === question?._id)}
				/>
			);
		else if (question.loai === ELoaiCauHoiPublic.NUMERIC_RANGE)
			questionEleMent = (
				<NumericChoice
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.danhSachTraLoi?.find((item: any) => item?.idCauHoi === question?._id)}
				/>
			);
		else if (question.loai === ELoaiCauHoiPublic.UPLOAD_FILE) {
			questionEleMent = (
				<FileChoice
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.danhSachTraLoi?.find((item: any) => item?.idCauHoi === question?._id)}
				/>
			);
		}

		return (
			<div key={question._id} className='question-item'>
				<div className='question-header'>
					<div className='question-title'>
						Câu {indexCauHoi + 1}: {question?.noiDungCauHoi} {question?.batBuoc && <span className='required'>*</span>}
					</div>
				</div>
				<div className='question-content'>{questionEleMent}</div>
			</div>
		);
	};

	return (
		<>
			{/* <h3>{khaoSat?.tieuDe}</h3>
			<p>{khaoSat?.moTa}</p> */}

			{khaoSat?.danhSachKhoi?.map((item, indexKhoi) => (
				// eslint-disable-next-line react/no-array-index-key
				<div key={indexKhoi} className='section-item'>
					{indexKhoi > 0 && <Divider />}
					<div className='section-title'>{item?.tieuDe}</div>
					<div className='section-description'>{item?.moTa}</div>

					{item.danhSachCauHoi?.map((cauHoi, indexCauHoi) => renderQuestion(cauHoi, indexKhoi, indexCauHoi))}
				</div>
			))}
		</>
	);
};

export default ViewTraLoiKhaoSat;
