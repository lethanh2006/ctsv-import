import UploadFile from '@/components/Upload/UploadFile';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import { ELoaiCauHoiPublic } from '@/services/TienIch/constant';
import { Button, Card, Divider } from 'antd';
import { useIntl, useModel } from 'umi';
import GridChoice from './QuestionView/GridChoice';
import MultipleChoice from './QuestionView/MultipleChoice';
import NumericChoice from './QuestionView/NumericChoice';
import RenderInput from './QuestionView/RenderInput';
import SingleChoice from './QuestionView/SingleChoice';
import Text from './QuestionView/Text';
import './block.css';

const ViewDetailKhaoSat = (props: { hideCard?: boolean }) => {
	const intl = useIntl();
	const { hideCard } = props;
	const { loading, record, setVisibleForm } = useModel('tienich.bieumau');

	const renderQuestion = (question: BieuMau.CauHoi, index: number) => {
		let questionEleMent = <div />;
		if (question.loai === ELoaiCauHoiPublic.SINGLE_CHOICE)
			questionEleMent = <SingleChoice luaChon={question.luaChon} question={question} />;
		else if (question.loai === ELoaiCauHoiPublic.MULTIPLE_CHOICE)
			questionEleMent = <MultipleChoice luaChon={question.luaChon} question={question} />;
		else if (question.loai === ELoaiCauHoiPublic.TEXT) questionEleMent = <Text />;
		else if (
			question.loai === ELoaiCauHoiPublic.RENDER_INPUT ||
			question.loai === ELoaiCauHoiPublic.RENDER_INPUT_RATING
		)
			questionEleMent = <RenderInput />;
		else if (
			question.loai === ELoaiCauHoiPublic.GRID_MULTIPLE_CHOICE ||
			question.loai === ELoaiCauHoiPublic.GRID_SINGLE_CHOICE
		)
			questionEleMent = <GridChoice hang={question.luaChonHang} cot={question.luaChonCot} />;
		else if (question.loai === ELoaiCauHoiPublic.NUMERIC_RANGE)
			questionEleMent = (
				<NumericChoice luaChon={{ start: question.gioiHanDuoiTuyenTinh, end: question.gioiHanTrenTuyenTinh }} />
			);
		else if (question.loai === ELoaiCauHoiPublic.UPLOAD_FILE) {
			questionEleMent = (
				<UploadFile
					otherProps={{
						multiple: true,
						accept: 'image/*, .pdf, .doc, .docx',
						showUploadList: { showDownloadIcon: false },
					}}
					maxCount={5}
				/>
			);
		}

		return (
			<div key={question._id} className='question-item'>
				<div className='question-header'>
					<div className='question-title'>
						{intl.formatMessage({ id: 'questionsmanagement.chitiet.cau' })} {index + 1}: {question.noiDungCauHoi}{' '}
						{question.batBuoc && <span className='required'>*</span>}
					</div>
				</div>
				<div className='question-content'>{questionEleMent}</div>
			</div>
		);
	};

	const renderContent = (
		<>
			<h3>{record?.tieuDe}</h3>
			<p>{record?.moTa}</p>

			{record?.danhSachKhoi?.map((item, index) => (
				// eslint-disable-next-line react/no-array-index-key
				<div key={index} className='section-item'>
					<Divider />
					<div className='section-title'>{item.tieuDe}</div>
					<div className='section-description'>{item.moTa}</div>

					{item.danhSachCauHoi?.map((cauHoi, i) => renderQuestion(cauHoi, i))}
				</div>
			))}
		</>
	);

	if (hideCard) return renderContent;

	return (
		<Card loading={loading} title={intl.formatMessage({ id: 'questionsmanagement.form.chitiet' })} className='card'>
			{renderContent}
			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ViewDetailKhaoSat;
