import { ELoaiCauHoiPublic } from '@/services/TienIch/constant';
import rules from '@/utils/rules';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, type FormInstance, Input, Row, Select } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import GridChoice from './QuestionType/GridChoice';
import NumericRange from './QuestionType/NumericChoice';
import SingleChoice from './QuestionType/SingleChoice';

const BlockQuestion = (props: { index: number; block: number; initialType?: any; form?: FormInstance }) => {
	const intl = useIntl();
	const { record } = useModel('tienich.bieumau');
	const currenType =
		props.initialType?.find((item: any) => item.index === props.index)?.loai ||
		record?.danhSachKhoi?.[props.block]?.danhSachCauHoi?.[props.index]?.loai;

	const [questionType, setQuestionType] = useState<ELoaiCauHoiPublic>(currenType ?? ELoaiCauHoiPublic.SINGLE_CHOICE);

	return (
		<>
			<Row gutter={[12, 0]}>
				<Col md={12} lg={16}>
					<Form.Item
						name={[props.index, 'noiDungCauHoi']}
						label={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.question.noidung' })}
						rules={[...rules.required]}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.question.noidung.place' })}
						/>
					</Form.Item>
				</Col>
				<Col md={12} lg={8}>
					<Form.Item
						name={[props.index, 'loai']}
						label={intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.question.loai' })}
						rules={[...rules.required]}
						initialValue={questionType}
					>
						<Select
							onChange={(val: ELoaiCauHoiPublic) => setQuestionType(val)}
							placeholder={intl.formatMessage({
								id: 'questionsmanagement.cauhinh.block.question.loai.place',
							})}
							options={Object.values(ELoaiCauHoiPublic).map((value) => ({
								value,
								label: intl.formatMessage({
									id: `question.type.${value}`,
								}),
							}))}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item valuePropName='checked' name={[props.index, 'batBuoc']} initialValue={false}>
				<Checkbox>{intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.question.batbuoc' })}</Checkbox>
			</Form.Item>

			{[ELoaiCauHoiPublic.SINGLE_CHOICE, ELoaiCauHoiPublic.MULTIPLE_CHOICE].includes(questionType) && (
				<Form.List
					name={[props.index, 'luaChon']}
					rules={[
						{
							validator: async (_: unknown, values: { noiDung?: string; dung?: boolean }[]) => {
								if (!values || values.length < 1) {
									return Promise.reject(
										new Error(intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.question.validapan' })),
									);
								}

								const duplicateIndex = values.findIndex(
									(value, index) =>
										value?.noiDung && values.findIndex((v, i) => v?.noiDung === value?.noiDung && i !== index) !== -1,
								);

								if (duplicateIndex !== -1) {
									return Promise.reject(
										new Error(
											intl.formatMessage(
												{
													id: 'questionsmanagement.cauhinh.block.question.error',
												},
												{
													duplicateIndex: duplicateIndex + 1,
												},
											),
										),
									);
								}

								return Promise.resolve();
							},
						},
					]}
				>
					{(fields, { add, remove }, { errors }) => (
						<>
							{fields.map((field, index) => (
								<SingleChoice index={index} remove={remove} fieldName={field.name} key={field.key} form={props.form} />
							))}
							<Form.ErrorList errors={errors} />
							<Button onClick={() => add()} icon={<PlusOutlined />} size='small' type='primary'>
								{intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.question.themdapan' })}
							</Button>
						</>
					)}
				</Form.List>
			)}

			{(questionType === ELoaiCauHoiPublic.SINGLE_CHOICE || questionType === ELoaiCauHoiPublic.MULTIPLE_CHOICE) && (
				<Form.Item valuePropName='checked' name={[props.index, 'cauTraLoiKhac']} style={{ marginTop: 12 }}>
					<Checkbox>{intl.formatMessage({ id: 'questionsmanagement.cauhinh.block.question.cautlkhac' })}</Checkbox>
				</Form.Item>
			)}

			{[ELoaiCauHoiPublic.GRID_SINGLE_CHOICE, ELoaiCauHoiPublic.GRID_MULTIPLE_CHOICE].includes(questionType) && (
				<GridChoice name={props.index} />
			)}
			{[ELoaiCauHoiPublic.NUMERIC_RANGE, ELoaiCauHoiPublic.RENDER_INPUT_RATING].includes(questionType) && (
				<NumericRange index={props.index} questionType={questionType} />
			)}
		</>
	);
};

export default BlockQuestion;
