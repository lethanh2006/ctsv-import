import UploadFile from '@/components/Upload/UploadFile';
import { BieuMau } from '@/services/TienIch/BieuMau/typings';
import rules from '@/utils/rules';
import { Form } from 'antd';

const FileChoice = (props: { question: BieuMau.CauHoi, disabled?: boolean }) => {
	return (
		<Form.Item
			rules={props.question.batBuoc ? [...rules.fileRequired] : []}
			name={[props.question._id, 'listUrlFile']}
			extra={
				<i>
					<small>Định dạng cho phép: file ảnh, file PDF, file Word</small>
				</i>
			}
		>
			<UploadFile
        disabled={props?.disabled}
				otherProps={{
					multiple: true,
					accept: 'image/*, .pdf, .doc, .docx, .png, .jpg',
					showUploadList: { showDownloadIcon: false },
				}}
				maxCount={5}
			/>
		</Form.Item>
	);
};

export default FileChoice;
