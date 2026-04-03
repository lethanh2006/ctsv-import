import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import SelectPhongCSVC from '@/pages/CoSoVatChat/Phong/Select';
import SelectActivitiesManagement from '@/pages/DanhMuc/Activities/components/Select';
import SelectActivitiesTypeDomain from '@/pages/DanhMuc/CCD/components/Select';
import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectLopHocPhanDebounce from '@/pages/DaoTaoV2/HocKy/LopHocPhan/components/SelectLopHocPhanDebounce';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/SinhVien/KhoaSinhVien/SelectKhoaSinhVien';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { Activity } from '@/services/CCT/Activity/typing';
import { EparticipantRole, EParticipantScope, mapNameParticipantScope } from '@/services/CCT/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import dayjs from '@/utils/dayjs';
import { ipCCT } from '@/utils/ip';
import rules from '@/utils/rules';
import { buildDisabledDateTime, resetFieldsForm } from '@/utils/utils';
import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, message, Radio, Row, Select } from 'antd';
import { useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';
import EquivalencyFormItem from '../Equivalency/FormItem';
import FormItemStudentDomain from '../Student/FormItem';
import FormItemUserRoles from '../UserRoles/FormItem';
import GroupTagVaiTro from './GroupTagVaiTro';

const MAX_SELECT = 3;
const normalizeEquivalencyData = (data: any[]) => {
	const map: Record<string, any> = {};

	data.forEach((item) => {
		const roleId = item.rolesId;
		if (!roleId) return;

		if (!map[roleId]) {
			map[roleId] = {
				rolesId: roleId,
				role: item.roles ?? null,
				attributes: {},
			};
		}

		if (item.attributesId) {
			map[roleId].attributes[item.attributesId] = true;
		}
	});

	return Object.values(map);
};

const FormActivity = (props: { getData?: () => void }) => {
	const intl = useIntl();
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm, setFormSubmiting } =
		useModel('cct.activity');
	const { danhSach: dscompetency, loading, getAllModel: getAllAttriCompetency } = useModel('danhmuc.competency');
	const { danhSach: dsActivityType } = useModel('danhmuc.activities');
	const { getAllModel: getAllLevel } = useModel('danhmuc.levels');
	const { record: recNhanSu } = useModel('tochucnhansu.nhansu');

	const startDate: Date = Form.useWatch('startDate', form);
	const endDate: Date = Form.useWatch('endDate', form);
	const onCampus: Boolean = Form.useWatch('onCampus', form);
	const participantScope: EParticipantScope = Form.useWatch('participantScope', form);
	const cct: boolean = Form.useWatch('cct', form);
	const participantRole: EparticipantRole = Form.useWatch('participantRole', form);
	const activitiesTypeDomainId: string = Form.useWatch('activitiesTypeDomainId', form);
	const allowPostEventResultsUpdate: boolean = Form.useWatch('allowPostEventResultsUpdate', form);
	const activitiesTypeId: string = Form.useWatch('activitiesTypeId', form);
	const competencyList: string[] = Form.useWatch('competencyList', form);
	const allowCapacity: boolean = Form.useWatch('allowCapacity', form);
	const allowDueDateRegistration: boolean = Form.useWatch('allowDueDateRegistration', form);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form, {
				studentDeclarationApproverList: null,
				coCurricularActivityEquivalency: null,
			});
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				cct: record?.activitiesTypeId ?? false,
				activitiesTypeDomainId: record?.activitiesType?.activitiesTypeDomainId,
				competencyList: record?.competencyList?.map((item) => item?.competencyId),
				coCurricularActivityEquivalency: normalizeEquivalencyData(record?.coCurricularActivityEquivalency),
				allowCapacity: record.capacity ? true : false,
				allowDueDateRegistration: record.dueDateRegistration ? true : false,
				activitiesTypeId: record?.activitiesTypeId,
			});
		}

		if (!record?._id) {
			form.setFieldsValue({
				participantScope: EParticipantScope.UNIVERSITY,
				participantRole: EparticipantRole.STUDENT,
				cct: true,
				allowPostEventResultsUpdate: true,
				onCampus: true,
				allowRegistration: false,
				dueDate: dayjs().add(10, 'day'),
				organizer: recNhanSu?.donViChinh?.ten,
				studentDeclarationApproverList: [
					{
						index: 0,
						ssoId: recNhanSu?.ssoId,
						name: recNhanSu?.hoTen,
						email: recNhanSu?.email ?? recNhanSu?.emailCanBo,
					},
				],
				allowCapacity: false,
				allowDueDateRegistration: false,
			});
		}
	}, [record?._id, visibleForm]);

	useEffect(() => {
		getAllAttriCompetency(undefined, { order: 1 }, { isActive: true });
		getAllLevel(undefined, { order: 1 }, { autoApproval: true, isActive: true });
	}, []);

	const onFinish = async (values: Activity.IRecord) => {
		setFormSubmiting(true);
		const banner = await buildUpLoadFile(values, 'banner', undefined, undefined, ipCCT);
		const backgroundImage = await buildUpLoadFile(values, 'backgroundImage', undefined, undefined, ipCCT);
		values.banner = banner;
		values.backgroundImage = backgroundImage;
		setFormSubmiting(false);

		values.codeOrganizer = recNhanSu?.donViChinh?.maDonVi;
		values.capacity = allowCapacity ? values.capacity : null;
		values.dueDateRegistration = allowDueDateRegistration ? values.dueDateRegistration : null;

		values.competencyList = values.competencyList?.map((id) => ({
			competencyId: id,
		})) as any;

		if (values.cct === false) {
			values.activitiesTypeId = null;
		}

		const list = values.coCurricularActivityEquivalency || [];

		const roleIds = list.map((i) => i.rolesId).filter(Boolean);
		if (roleIds.some((id, idx) => roleIds.indexOf(id) !== idx)) {
			message.error(intl.formatMessage({ id: 'activity.equivalency.vali' }));
			return;
		}

		const result: any[] = [];

		list.forEach((item: any) => {
			const { rolesId, attributes = {} } = item;

			const selectedAttributeIds = Object.keys(attributes).filter((id) => attributes[id]);

			if (!selectedAttributeIds.length) {
				result.push({
					rolesId,
					attributesId: null,
				});
				return;
			}

			selectedAttributeIds.forEach((attrId) => {
				result.push({
					rolesId,
					attributesId: attrId,
				});
			});
		});

		const data = { ...values, coCurricularActivityEquivalency: result };

		if (edit) {
			putModel(
				record?._id ?? '',
				data,
				getData,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(data, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }))
				.then()
				.catch((er) => console.log(er));
	};

	const columns: IColumn<Competency.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'activity.info.form.competency.name' }),
			dataIndex: 'name',
			width: 170,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'activity.info.form.competency.des' }),
			dataIndex: 'description',
			width: 250,
			render: (val, rec) => val && <ExpandText>{val}</ExpandText>,
		},
	];

	const sortedData = useMemo(() => {
		if (!dscompetency) return [];

		const selectedSet = new Set(competencyList ?? []);

		return [...dscompetency].sort((a, b) => {
			const aSelected = selectedSet.has(a._id);
			const bSelected = selectedSet.has(b._id);

			// selected lên trên
			if (aSelected && !bSelected) return -1;
			if (!aSelected && bSelected) return 1;

			return 0;
		});
	}, [dscompetency, competencyList]);

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item name='banner' label={intl.formatMessage({ id: 'activity.info.form.banner' })}>
								<UploadFile
									isWidescreen
									accept='.png,.jpg,.jpeg'
									buttonDescription={intl.formatMessage({ id: 'activity.info.form.banner.place' })}
									extra={intl.formatMessage({ id: 'activity.info.form.banner.extra' })}
								/>
							</Form.Item>
						</Col>

						<Col span={24} md={16}>
							<Row gutter={[12, 0]}>
								<Col span={24}>
									<Form.Item
										name='name'
										label={intl.formatMessage({ id: 'activity.info.form.name' })}
										rules={[...rules.required]}
									>
										<Input
											disabled={isView}
											placeholder={intl.formatMessage({ id: 'activity.info.form.name.place' })}
										/>
									</Form.Item>
								</Col>
								<Col span={24} md={12}>
									<Form.Item
										name='startDate'
										label={intl.formatMessage({ id: 'activity.info.form.startDate' })}
										rules={[...rules.required, ...rules.sauThoiDiem(dayjs(), 'Past')]}
									>
										<MyDatePicker
											showTime={{ showHour: true, showMinute: true }}
											format='HH:mm DD/MM/YYYY'
											disabled={isView}
											placeholder={intl.formatMessage({ id: 'activity.info.form.startDate.place' })}
											allowClear
											{...buildDisabledDateTime({
												min: dayjs(),
											})}
											onChange={() => form.resetFields(['endDate'])}
										/>
									</Form.Item>
								</Col>
								<Col span={24} md={12}>
									<Form.Item
										name='endDate'
										label={intl.formatMessage({ id: 'activity.info.form.endDate' })}
										rules={[
											...rules.required,
											...rules.sauThoiDiem(dayjs(), 'Past'),
											...rules.sauThoiDiem(
												dayjs(startDate),
												intl.formatMessage({ id: 'activity.info.form.startDate' }),
											),
										]}
									>
										<MyDatePicker
											showTime={{ showHour: true, showMinute: true }}
											format='HH:mm DD/MM/YYYY'
											disabled={isView}
											placeholder={intl.formatMessage({ id: 'activity.info.form.endDate.place' })}
											allowClear
											{...buildDisabledDateTime({
												min: startDate ? dayjs(startDate) : dayjs(),
											})}
											onChange={(val) => form.setFieldValue('dueDate', dayjs(val).add(10, 'day'))}
										/>
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item name='organizer' label={intl.formatMessage({ id: 'activity.info.form.organizer' })}>
										<Input disabled />
									</Form.Item>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>

				<Col span={24} md={8}>
					<Form.Item
						name='onCampus'
						label={intl.formatMessage({ id: 'activity.info.form.location' })}
						rules={[...rules.required]}
					>
						<Radio.Group
							disabled={isView}
							options={[
								{ value: true, label: intl.formatMessage({ id: 'activity.info.form.location.onCampus' }) },
								{ value: false, label: intl.formatMessage({ id: 'activity.info.form.location.otherAddress' }) },
							]}
						/>
					</Form.Item>
				</Col>

				{onCampus ? (
					<Col span={24} md={16}>
						<Form.Item
							name='facilityCode'
							label={intl.formatMessage({ id: 'activity.info.form.location.onCampus' })}
							rules={[...rules.required]}
						>
							<SelectPhongCSVC
								disabled={isView}
								onChange={(val, option) => {
									const phong = option?.rawData;
									form.setFieldsValue({
										facilityName: phong?.ten,
										capacity: phong?.sucChua,
									});
								}}
							/>
						</Form.Item>
						<Form.Item name='facilityName' hidden />
					</Col>
				) : (
					<Col span={24} md={16}>
						<Form.Item
							name='otherAddress'
							label={intl.formatMessage({ id: 'activity.info.form.location.otherAddress' })}
							rules={[...rules.required]}
							extra={intl.formatMessage({ id: 'activity.info.form.location.otherAddress.extra' })}
						>
							<Input
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'activity.info.form.location.otherAddress.place' })}
							/>
						</Form.Item>
					</Col>
				)}

				<Col span={24}>
					<Form.Item
						name='description'
						label={intl.formatMessage({ id: 'activity.info.form.description' })}
						rules={[...rules.text]}
					>
						<Input.TextArea
							rows={3}
							disabled={isView}
							placeholder={intl.formatMessage({ id: 'activity.info.form.description.place' })}
						/>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item
						name='participantScope'
						label={intl.formatMessage({ id: 'activity.info.form.participantScope' })}
						rules={[...rules.required]}
					>
						<Select
							disabled={isView}
							options={Object.values(EParticipantScope).map((item) => ({
								value: item,
								label: mapNameParticipantScope[item],
							}))}
							placeholder={intl.formatMessage({ id: 'activity.info.form.participantScope.place' })}
						/>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item
						name='participantRole'
						label={intl.formatMessage({ id: 'activity.info.form.participantRole' })}
						rules={[...rules.required]}
					>
						<GroupTagVaiTro
							disabled={isView}
							listVaiTro={
								participantScope === EParticipantScope.UNIT
									? [EparticipantRole.STAFF]
									: [EParticipantScope.COURSE_CLASS, EParticipantScope.STUDENT, EParticipantScope.MAJOR].includes(
												participantScope,
										  )
										? [EparticipantRole.STUDENT]
										: undefined
							}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					{participantScope === EParticipantScope.USER_LIST ? (
						<Form.Item
							name='participantsList'
							label={intl.formatMessage({ id: 'activity.info.form.participantsList' })}
						>
							<FormItemUserRoles disabled={isView} participantRole={participantRole} />
						</Form.Item>
					) : participantScope === EParticipantScope.STUDENT ? (
						<Form.Item
							name='studentCohortCode'
							label={intl.formatMessage({ id: 'activity.info.form.studentCohortCode' })}
							rules={[...rules.required]}
						>
							<SelectKhoaSinhVien selectMa allowClear disabled={isView} />
						</Form.Item>
					) : participantScope === EParticipantScope.MAJOR ? (
						<Form.Item
							name='majorCode'
							label={intl.formatMessage({ id: 'activity.info.form.majorCode' })}
							rules={[...rules.required]}
						>
							<SelectNganhCoSo selectMa allowClear disabled={isView} />
						</Form.Item>
					) : participantScope === EParticipantScope.COURSE_CLASS ? (
						<Form.Item
							name='courseClassCode'
							label={intl.formatMessage({ id: 'activity.info.form.courseClassCode' })}
							rules={[...rules.required]}
						>
							<SelectLopHocPhanDebounce selectMa allowClear disabled={isView} />
						</Form.Item>
					) : participantScope === EParticipantScope.UNIT ? (
						<Form.Item
							name='unitCode'
							label={intl.formatMessage({ id: 'activity.info.form.unitCode' })}
							rules={[...rules.required]}
						>
							<SelectDonVi selectMa allowClear disabled={isView} />
						</Form.Item>
					) : null}
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='allowCapacity' valuePropName='checked' label=''>
						<Checkbox disabled={isView}>{intl.formatMessage({ id: 'activity.info.form.allowCapacity' })}</Checkbox>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='allowDueDateRegistration' valuePropName='checked' label=''>
						<Checkbox disabled={isView}>
							{intl.formatMessage({ id: 'activity.info.form.allowDueDateRegistration' })}
						</Checkbox>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					{allowCapacity ? (
						<Form.Item
							name='capacity'
							label={intl.formatMessage({ id: 'activity.info.form.capacity' })}
							rules={[...rules.required]}
						>
							<InputNumber
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'activity.info.form.capacity.place' })}
								min={1}
								precision={0}
								step={1}
							/>
						</Form.Item>
					) : (
						<></>
					)}
				</Col>

				<Col span={24} md={12}>
					{allowDueDateRegistration ? (
						<Form.Item
							name='dueDateRegistration'
							label={intl.formatMessage({ id: 'activity.info.form.dueDateRegistration' })}
							rules={[
								...rules.required,
								...rules.sauThoiDiem(dayjs(), 'Past'),
								...rules.truocThoiDiem(dayjs(endDate), intl.formatMessage({ id: 'activity.info.form.endDate' })),
							]}
						>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								disabled={isView}
								placeholder={intl.formatMessage({ id: 'activity.info.form.dueDateRegistration.place' })}
								allowClear
								{...buildDisabledDateTime({
									min: dayjs(),
									max: endDate ? dayjs(endDate) : undefined,
								})}
							/>
						</Form.Item>
					) : (
						<></>
					)}
				</Col>

				<Col span={24}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item name='cct' valuePropName='checked' label=''>
								<Checkbox disabled={isView} onChange={() => form.setFieldValue('allowPostEventResultsUpdate', true)}>
									{intl.formatMessage({ id: 'activity.info.form.cct' })}
								</Checkbox>
							</Form.Item>
						</Col>

						{cct && (
							<>
								<Col span={24} md={8}>
									<Form.Item name='allowPostEventResultsUpdate' valuePropName='checked' label=''>
										<Checkbox
											disabled={isView}
											onChange={(e) => {
												if (!e.target.checked) return;
												const baseDate = endDate ? dayjs(endDate) : dayjs();
												form.setFieldValue('dueDate', baseDate.add(10, 'day'));
											}}
										>
											{intl.formatMessage({ id: 'activity.info.form.allowPostEventResultsUpdate' })}
										</Checkbox>
									</Form.Item>
								</Col>

								<Col span={24} md={8}>
									{allowPostEventResultsUpdate && (
										<Form.Item
											name='dueDate'
											label={intl.formatMessage({ id: 'activity.info.form.duedate' })}
											rules={[
												...rules.required,
												...rules.sauThoiDiem(dayjs(endDate), intl.formatMessage({ id: 'activity.info.form.endDate' })),
											]}
										>
											<MyDatePicker
												showTime={{ showHour: true, showMinute: true }}
												format='HH:mm DD/MM/YYYY'
												disabled={isView}
												placeholder={intl.formatMessage({ id: 'activity.info.form.duedate.place' })}
												allowClear
												{...buildDisabledDateTime({
													min: endDate ? dayjs(endDate) : undefined,
												})}
											/>
										</Form.Item>
									)}
								</Col>

								<Col span={24} md={8}>
									<Form.Item
										name='activitiesTypeDomainId'
										label={intl.formatMessage({ id: 'activity.info.form.group' })}
										rules={[...rules.required]}
									>
										<SelectActivitiesTypeDomain
											disabled={isView}
											onChange={() => form.resetFields(['activitiesTypeId'])}
										/>
									</Form.Item>
								</Col>

								<Col span={24} md={8}>
									<Form.Item
										name='activitiesTypeId'
										label={intl.formatMessage({ id: 'activity.info.form.type' })}
										rules={[...rules.required]}
									>
										<SelectActivitiesManagement
											disabled={isView}
											condition={{ activitiesTypeDomainId: activitiesTypeDomainId }}
											onChange={() => form.resetFields(['coCurricularActivityEquivalency'])}
										/>
									</Form.Item>
								</Col>

								{/* <Col span={24} md={8}>
									<Form.Item label={intl.formatMessage({ id: 'activity.info.form.track' })}>
										<Input
											disabled
											value={
												dsActivityType?.find((item) => item?._id === activitiesTypeId)?.track?.name ??
												intl.formatMessage({ id: 'activity.info.form.track.place' })
											}
										/>
									</Form.Item>
								</Col> */}

								{activitiesTypeId && (
									<Col span={24}>
										{intl.formatMessage({ id: 'activity.info.form.evidence' })}:{' '}
										<b>
											{dsActivityType
												?.find((item) => item?._id === activitiesTypeId)
												?.requiredEvidenceList?.join(', ') ?? '--'}
										</b>
									</Col>
								)}

								<Col span={24}>
									<Divider className='divider-big-title' orientation='left'>
										{intl.formatMessage({ id: 'activity.step.cca' })}
									</Divider>
								</Col>

								<Col span={24}>
									<EquivalencyFormItem
										coCurricularAttributesEquivalency={
											dsActivityType
												?.find((item) => item?._id === activitiesTypeId)
												?.attributes?.map((attr: any) => ({
													attributesId: attr._id,
													attributes: attr,
												})) ?? []
										}
										form={form}
										disabled={isView}
									/>
								</Col>

								<Col span={24}>
									<Divider className='divider-big-title' orientation='left'>
										{intl.formatMessage({ id: 'activity.info.form.competency' })}
									</Divider>
								</Col>

								<Col span={24}>
									<Form.Item name='competencyList'>
										<TableStaticData
											columns={columns}
											data={sortedData}
											loading={loading}
											size='small'
											hasTotal
											onReload={getAllAttriCompetency}
											otherProps={{
												pagination: false,
												scroll: { y: 350 },
												rowKey: '_id',
												rowSelection: {
													type: 'checkbox',
													columnWidth: 40,
													selectedRowKeys: competencyList ?? [],
													onChange: (selectedRowKeys: React.Key[]) => {
														if (isView) return;
														form.setFieldsValue({
															competencyList: selectedRowKeys,
														});
													},
													getCheckboxProps: (record: any) => ({
														disabled:
															isView ||
															((competencyList?.length ?? 0) >= MAX_SELECT && !competencyList?.includes(record._id)),
													}),
													hideSelectAll: true,
												},
											}}
											otherButtons={[
												<i className='text-info'>
													{intl.formatMessage({ id: 'activity.info.form.competency.infor' })}
												</i>,
											]}
										/>
									</Form.Item>
								</Col>

								<Col span={24}>
									<Divider className='divider-big-title' orientation='left'>
										{intl.formatMessage({ id: 'activity.info.form.approver' })}
									</Divider>
								</Col>

								<Col span={24}>
									<Form.Item name='studentDeclarationApproverList'>
										<FormItemStudentDomain disabled={isView} />
									</Form.Item>
								</Col>
							</>
						)}
					</Row>
				</Col>
			</Row>

			<div className='form-footer'>
				{!isView && (
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
				)}
				<Button onClick={() => setVisibleForm(false)}>
					{intl.formatMessage({ id: isView ? 'global.button.dong' : 'global.button.huy' })}
				</Button>
			</div>
		</Form>
	);
};

export default FormActivity;
