import { ELoaiCauHoiPublic } from '@/services/TienIch/constant';
import rules from '@/utils/rules';
import { Col, Form, InputNumber, Row, Select } from 'antd';
import { useIntl } from 'umi';

const NumericRange = (props: { index: number; questionType: ELoaiCauHoiPublic }) => {
	const intl = useIntl();
	const { index, questionType } = props;
	const isRating = questionType === ELoaiCauHoiPublic.RENDER_INPUT_RATING;

	const renderInput = (options: number[]) =>
		isRating ? (
			<InputNumber
				placeholder={intl.formatMessage({ id: 'questionsmanagement.cauhinh.numberic.nhapso' })}
				style={{ width: '100%' }}
			/>
		) : (
			<Select placeholder={intl.formatMessage({ id: 'questionsmanagement.cauhinh.numberic.chon' })}>
				{options.map((item) => (
					<Select.Option key={item} value={item}>
						{item}
					</Select.Option>
				))}
			</Select>
		);

	return (
		<Row gutter={[12, 0]}>
			<Col span={12}>
				<Form.Item
					name={[index, 'gioiHanDuoiTuyenTinh']}
					rules={rules.required}
					label={intl.formatMessage({ id: 'questionsmanagement.cauhinh.numberic.tu' })}
				>
					{renderInput([0, 1])}
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item
					name={[index, 'gioiHanTrenTuyenTinh']}
					label={intl.formatMessage({ id: 'questionsmanagement.cauhinh.numberic.den' })}
					rules={[...rules.required]}
				>
					{renderInput([2, 3, 4, 5, 6, 7, 8, 9, 10])}
				</Form.Item>
			</Col>
		</Row>
	);
};

export default NumericRange;
