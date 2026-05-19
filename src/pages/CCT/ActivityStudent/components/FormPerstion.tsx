import background from '@/assets/cct/background.png';
import AuthImage from '@/components/Image/AuthImage';
import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectActivitiesTypeDomain from '@/pages/DanhMuc/CCD/components/Select';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EApprovalStatus,
	EparticipantRole,
	EParticipantScope,
	EScopeAward,
	mapNameScopeAward,
} from '@/services/CCT/constant';
import { buildUpLoadFile, handleSingleFile } from '@/services/uploadFile';
import { ipCCT } from '@/utils/ip';
import rules from '@/utils/rules';
import { buildDisabledDateTime, resetFieldsForm } from '@/utils/utils';
import { Col, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import CardNoteActivity from './CardNote';

const uploadFilesOfCompetency = async (files: any[] = []) => {
	if (!files.length) return [];
	const urls = await Promise.all(files?.map((f) => handleSingleFile(f, undefined, undefined, ipCCT).catch(() => null)));
	return urls.filter(Boolean) as string[];
};

const FormPerstionActivityOutCome = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();

	const { record, edit, isView, postModel, putModel, visibleForm, setFormSubmiting } = useModel('cct.activityoutcome');

	const startDate: Date = Form.useWatch('startDate', form);
	const endDate: Date = Form.useWatch('endDate', form);
	const activitiesTypeDomainId: string = Form.useWatch('activitiesTypeDomainId', form);

	const [isSubmit, setIsSubmit] = useState<boolean>(false);
	const isAward = activitiesTypeDomainId === 'award-recognition';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);

		if (record?._id) {
			form.setFieldsValue({
				...record,
				activitiesTypeDomainId: record?.isAwardRecognition
					? 'award-recognition'
					: record?.activitiesType?.activitiesTypeDomainId,
				listAchievedCompetencies: record?.listAchievedCompetencies?.map((item) => item?.competencyId),
				onUni: record?.supervisorSsoId ? true : false,
				banner: record?.banner ?? background,
			});
		}

		if (!record?._id) {
			form.setFieldsValue({
				participantScope: EParticipantScope.UNIVERSITY,
				participantRole: EparticipantRole.ALL,
				cct: true,
				allowPostEventResultsUpdate: false,
				onCampus: true,
				checkbox: false,
				listAchievedCompetencies: null,
				onUni: true,
				banner: background,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: ActivityOutCome.IRecord, submitted: boolean) => {
		setFormSubmiting(true);
		let banner = await buildUpLoadFile(values, 'banner', undefined, undefined, ipCCT);
		if (!banner || !banner.includes('http')) {
			banner = null;
		}
		values.banner = banner;
		setFormSubmiting(false);

		const evidenceFile = await Promise.all(
			(values.evidenceFile || []).map(async (item: any) => ({
				name: item.name,
				file: await uploadFilesOfCompetency(item?.file?.fileList),
			})),
		);

		values.evidenceFile = evidenceFile;

		values.listAchievedCompetencies = values.listAchievedCompetencies?.map((id) => ({
			competencyId: id,
		})) as any;

		values.workflow = submitted ? EApprovalStatus.SUBMITTED : EApprovalStatus.DRAFT;
		values.isAwardRecognition = isAward ? true : false;

		if (edit) {
			putModel(
				`me/${record?._id}`,
				values,
				getData,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			);
		} else {
			postModel(values, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }));
		}
	};

	return (
		<>
			<Form form={form} layout='vertical' onFinish={(values) => onFinish(values, isSubmit)}>
				{!!record?.revisionNote && <CardNoteActivity />}
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Row gutter={[12, 0]}>
							{isView ? (
								<Col span={24} md={9}>
									<AuthImage
										src={record?.banner ?? background}
										fallback={background}
										className='activity-image'
										isDetail
									/>
								</Col>
							) : (
								<Col span={24} md={9}>
									<Form.Item name='banner' label='Banner'>
										<UploadFile
											isPrivate
											isWidescreen
											accept='.png,.jpg,.jpeg'
											buttonDescription='Add Banner'
											extra='Only .png, .jpeg, and .jpg files are allowed'
										/>
									</Form.Item>
								</Col>
							)}

							<Col span={24} md={15}>
								<Row gutter={[12, 0]}>
									<Col span={24} md={12}>
										<Form.Item name='activitiesTypeDomainId' label='Activity Group' rules={[...rules.required]}>
											<SelectActivitiesTypeDomain
												disabled={isView}
												onChange={() => form.resetFields(['activitiesTypeId'])}
											/>
										</Form.Item>
									</Col>
									<Col span={24} md={12}>
										<Form.Item name='scope' label='Scope' rules={[...rules.required]}>
											<Select
												placeholder='Select Scope'
												options={Object.values(EScopeAward).map((value) => ({
													value,
													label: mapNameScopeAward[value],
												}))}
												allowClear
												disabled={isView}
											/>
										</Form.Item>
									</Col>
									<Col span={24} md={24}>
										<Form.Item name='competition' label='Competition' rules={[...rules.required]}>
											<Input placeholder='Enter Competition' disabled={isView} />
										</Form.Item>
									</Col>
									<Col span={24} md={12}>
										<Form.Item
											name='startDate'
											label={intl.formatMessage({ id: 'activity.perstion.startDate' })}
											rules={[...rules.required]}
										>
											<MyDatePicker
												showTime={{ showHour: true, showMinute: true }}
												format='HH:mm DD/MM/YYYY'
												disabled={isView}
												placeholder={intl.formatMessage({ id: 'activity.perstion.startDate.place' })}
												onChange={() => form.resetFields(['endDate'])}
											/>
										</Form.Item>
									</Col>
									<Col span={24} md={12}>
										<Form.Item
											name='endDate'
											label={intl.formatMessage({ id: 'activity.perstion.endDate' })}
											rules={[
												...rules.required,
												...rules.sauThoiDiem(
													dayjs(startDate),
													intl.formatMessage({ id: 'activity.perstion.startDate' }),
												),
											]}
										>
											<MyDatePicker
												showTime={{ showHour: true, showMinute: true }}
												format='HH:mm DD/MM/YYYY'
												disabled={isView}
												{...buildDisabledDateTime({
													min: startDate ? dayjs(startDate) : undefined,
												})}
												placeholder={intl.formatMessage({ id: 'activity.perstion.endDate.place' })}
											/>
										</Form.Item>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>

					<Col span={24} md={8}>
						<Form.Item
							name='dateOfAchievement'
							label='Date Of Achievement'
							rules={[
								...rules.required,
								...rules.sauThoiDiem(dayjs(startDate), intl.formatMessage({ id: 'activity.perstion.startDate' })),
								...rules.truocThoiDiem(dayjs(endDate), intl.formatMessage({ id: 'activity.perstion.endDate' })),
							]}
						>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								disabled={isView}
								placeholder='Choice Date Of Achievement'
								{...buildDisabledDateTime({
									min: startDate ? dayjs(startDate) : undefined,
									max: endDate ? dayjs(endDate) : undefined,
								})}
								allowClear
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item name='rank' label='Rank' rules={[...rules.required]}>
							<Input disabled={isView} placeholder='Enter rank' />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item name='link' label='Link' rules={[...rules.required, ...rules.httpLink]}>
							<Input disabled={isView} placeholder='Enter link' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Row gutter={[12, 0]}>
							<Col span={24} md={12}>
								<Form.Item label='File Name' name={['evidenceFile', 0, 'name']} rules={[...rules.required]}>
									<Input placeholder='Enter Name' disabled={isView} />
								</Form.Item>
							</Col>

							<Col span={22} md={12}>
								<Form.Item label='File' name={['evidenceFile', 0, 'file']} rules={[...rules.required]}>
									<UploadFile
										maxCount={1}
										disabled={isView}
										isPrivate
										accept='.pdf, .doc, .docx, .xls, .xlsx, .png, .jpg, .jpeg'
									/>
								</Form.Item>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Form.Item name='description' label='Description'>
							<Input.TextArea rows={3} disabled={isView} placeholder='Enter Description' />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</>
	);
};

export default FormPerstionActivityOutCome;
