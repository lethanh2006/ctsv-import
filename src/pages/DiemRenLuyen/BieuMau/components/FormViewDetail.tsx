import UploadFile from '@/components/Upload/UploadFile';
import { type BieuMau } from '@/services/TienIch/BieuMau/typings';
import { Button, Card, Divider } from 'antd';
import { useIntl, useModel } from 'umi';
import GridChoice from './QuestionView/GridChoice';
import MultipleChoice from './QuestionView/MultipleChoice';
import NumericChoice from './QuestionView/NumericChoice';
import SingleChoice from './QuestionView/SingleChoice';
import Text from './QuestionView/Text';

const ViewDetailKhaoSat = () => {
	const { loading, record, setVisibleForm } = useModel('tienich.bieumau');
	const intl = useIntl();

	const renderQuestion = (question: BieuMau.CauHoi, index: number) => {
		let questionEleMent = <div />;
		if (question.loai === 'SingleChoice') questionEleMent = <SingleChoice luaChon={question.luaChon} />;
		else if (question.loai === 'MultipleChoice') questionEleMent = <MultipleChoice luaChon={question.luaChon} />;
		else if (question.loai === 'Text') questionEleMent = <Text />;
		else if (question.loai === 'GridMultipleChoice' || question.loai === 'GridSingleChoice')
			questionEleMent = <GridChoice hang={question.luaChonHang} cot={question.luaChonCot} />;
		else if (question.loai === 'NumericRange')
			questionEleMent = (
				<NumericChoice luaChon={{ start: question.gioiHanDuoiTuyenTinh, end: question.gioiHanTrenTuyenTinh }} />
			);
		else if (question.loai === 'UploadFile') {
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
			<div key={question._id}>
				<div className='fw500'>
					{intl.formatMessage({ id: 'bieumau.cau' })} {index + 1}: {question.noiDungCauHoi}{' '}
					{question.batBuoc ? <span style={{ color: 'red' }}>*</span> : null}
				</div>
				{questionEleMent}
			</div>
		);
	};

	return (
		<Card loading={loading} title={intl.formatMessage({ id: 'bieumau.view.chitietkhaosat' })}>
			<h3>{record?.tieuDe}</h3>
			<p>{record?.moTa}</p>

			{record?.danhSachKhoi?.map((item, index) => (
				// eslint-disable-next-line react/no-array-index-key
				<div key={index} style={{ marginBottom: 24 }}>
					<Divider />
					<div className='fw500'>{item.tieuDe}</div>
					<div style={{ marginBottom: 8 }}>{item.moTa}</div>

					{item.danhSachCauHoi?.map((cauHoi, i) => renderQuestion(cauHoi, i))}
				</div>
			))}

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ViewDetailKhaoSat;
