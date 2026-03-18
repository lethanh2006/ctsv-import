import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { FileOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Empty, Input, List, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useIntl } from 'umi';
import CardSuKienCCT from '../../Activity/ChiTiet/CardSuKien';

const ChiTietActivityOutCome = (props: { recOutcome: ActivityOutCome.IRecord }) => {
	const { recOutcome } = props;
	const intl = useIntl();

	return (
		<Row gutter={[12, 12]}>
			<Col span={24} md={9}>
				<CardSuKienCCT
					record={{
						...recOutcome?.activities,
						activityOutcome: recOutcome,
					}}
					banner={recOutcome?.banner}
					name={recOutcome?.activitiesOutcomeName}
					startDate={recOutcome?.startDate ? dayjs(recOutcome?.startDate).format('HH:mm DD/MM/YYYY') : '--'}
					endDate={recOutcome?.endDate ? dayjs(recOutcome?.endDate).format('HH:mm DD/MM/YYYY') : '--'}
					equivalencyAttributeIds={recOutcome?.activitiesType?.attributes?.map((x) => x._id)}
					isPersonal
					isDetail
					isExpired={
						recOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED && dayjs().isAfter(dayjs(recOutcome?.dueDate))
					}
				/>
			</Col>
			<Col span={24} md={15}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
						{intl.formatMessage({ id: 'activityresult.detail.administrativeInfo' })}
					</Divider>

					<div className='custom-info-grid grid-2'>
						<div className='info-row'>
							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activityresult.detail.organizer' })}</div>
								<div className='info-value'>{recOutcome?.organizer ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activityresult.detail.approver' })}</div>
								<div className='info-value'>{recOutcome?.studentDeclarationApproverName ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activityresult.detail.activityGroup' })}</div>
								<div className='info-value'>{recOutcome?.activitiesType?.activitiesTypeDomain?.name ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activityresult.detail.activityType' })}</div>
								<div className='info-value'>{recOutcome?.activitiesType?.name ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activityresult.detail.track' })}</div>
								<div className='info-value'>{recOutcome?.trackText ?? recOutcome?.track?.name ?? '--'}</div>
							</div>
							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activityresult.detail.mentorSupervisor' })}</div>
								<div className='info-value'>{recOutcome?.supervisorName ?? '--'}</div>
							</div>
							{recOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED && (
								<div className='info-item'>
									<div className='info-label'>
										{intl.formatMessage({ id: 'activityresult.detail.evidenceUpdateDeadline' })}
									</div>
									<div className='info-value'>
										{recOutcome?.dueDate ? dayjs(recOutcome?.dueDate).format('HH:mm DD/MM/YYYY') : '--'}
									</div>
								</div>
							)}
							{!!recOutcome?.workflow &&
								recOutcome?.workflow !== EApprovalStatus.DRAFT &&
								recOutcome?.workflow !== EApprovalStatus.EVIDENCE_REQUIRED && (
									<div className='info-item'>
										<div className='info-label'>
											{intl.formatMessage({ id: 'activityresult.detail.submissionTime' })}
										</div>
										<div className='info-value'>
											{recOutcome.submittedAt ? dayjs(recOutcome.submittedAt).format('HH:mm DD/MM/YYYY') : '--'}
										</div>
									</div>
								)}
							{recOutcome?.workflow !== EApprovalStatus.DRAFT && recOutcome?.workflow !== EApprovalStatus.SUBMITTED && (
								<div className='info-item'>
									<div className='info-label'>
										{intl.formatMessage({ id: 'activityresult.detail.evidenceReviewTime' })}
									</div>
									<div className='info-value'>
										{recOutcome?.approvalTime ? dayjs(recOutcome?.approvalTime).format('HH:mm DD/MM/YYYY') : '--'}
									</div>
								</div>
							)}
						</div>
					</div>
				</Card>
			</Col>

			{(recOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED || !!recOutcome?.revisionNote) && (
				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							{intl.formatMessage({ id: 'activityresult.detail.revisionNote' })}
						</Divider>
						<span>{recOutcome?.revisionNote}</span>
					</Card>
				</Col>
			)}

			{(recOutcome?.workflow === EApprovalStatus.REJECTED || !!recOutcome?.activityRejectionNote) && (
				<Col span={24}>
					<Card variant='borderless' size='small'>
						<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
							{intl.formatMessage({ id: 'activityresult.detail.rejectionNote' })}
						</Divider>
						<span>{recOutcome?.activityRejectionNote}</span>
					</Card>
				</Col>
			)}

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
						{intl.formatMessage({ id: 'activityresult.detail.evidenceInfo' })}
					</Divider>

					<div className='custom-info-grid grid-2' style={{ marginTop: 16 }}>
						<div className='info-row'>
							<div className='info-item'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>
									{intl.formatMessage({ id: 'activityresult.detail.role' })}
								</div>
								<Input disabled value={recOutcome?.roles?.name ?? intl.formatMessage({ id: 'global.noInfo' })} />
							</div>
							<div className='info-item'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>
									{intl.formatMessage({ id: 'activityresult.detail.level' })}
								</div>
								<Input disabled value={recOutcome?.levels?.name ?? intl.formatMessage({ id: 'global.noInfo' })} />
							</div>
							<div className='info-item full-width'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>
									{intl.formatMessage({ id: 'activityresult.detail.listEvidence' })}
								</div>
								<List
									size='small'
									dataSource={recOutcome?.evidenceFile ?? []}
									locale={{
										emptyText: (
											<Empty
												image={Empty.PRESENTED_IMAGE_SIMPLE}
												description={intl.formatMessage({ id: 'activityresult.detail.noEvidence' })}
											/>
										),
									}}
									renderItem={(item: any) => (
										<List.Item>
											<Typography.Link
												href={item.file}
												target='_blank'
												rel='noopener noreferrer'
												style={{ display: 'flex', alignItems: 'center', gap: 8 }}
											>
												<FileOutlined />
												<span>{item.name}</span>
											</Typography.Link>
										</List.Item>
									)}
								/>
							</div>
							<div className='info-item full-width'>
								<div style={{ marginBottom: 8, fontWeight: 600 }}>
									{intl.formatMessage({ id: 'activityresult.detail.reflection' })}
								</div>
								<Input.TextArea
									rows={3}
									disabled
									value={recOutcome?.reflection ?? intl.formatMessage({ id: 'global.noInfo' })}
								/>
							</div>
						</div>
					</div>
				</Card>
			</Col>

			<Col span={24}>
				<Card variant='borderless' size='small'>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0 }}>
						{intl.formatMessage({ id: 'activityresult.detail.competency' })}
					</Divider>
					<div className='competency-list'>
						{recOutcome?.listAchievedCompetencies?.map((item) => (
							<div className='competency-item'>
								<span className='competency-title'>{item?.competencie?.name}</span>
								<p className='competency-desc'>{item?.competencie?.description}</p>
							</div>
						))}
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default ChiTietActivityOutCome;
