import ModalExpandable from '@/components/Table/ModalExpandable';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory, EApprovalStatus } from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import { Button } from 'antd';
import { useIntl, useModel } from 'umi';
import CardChiTietSuKien from '../../Activity/ChiTiet';
import ChiTietActivityOutCome from './ChiTiet';
import FormPerstionActivityOutCome from './FormPerstion';

const FormActivityStudent = (props: any) => {
	const { isActivity, setTrangThai, iszindex } = props;
	const intl = useIntl();
	const { record, setVisibleForm, visibleForm, setVisibleXuLy, setVisibleChangeStatus, setVisibleImpact } =
		useModel('cct.activityoutcome');

	const now = dayjs();
	const endDateUpdateEvidence =
		record?.workflow === EApprovalStatus.CHANGES_REQUIRED
			? record?.dueDate
				? dayjs(record?.dueDate)
				: null
			: record?.activities?.allowPostEventResultsUpdate
				? record?.activities?.dueDate
					? dayjs(record?.activities?.dueDate)
					: null
				: record?.activities?.endDate
					? dayjs(record?.activities?.endDate)
					: null;

	const editableWorkflow =
		record?.workflow === EApprovalStatus.DRAFT ||
		record?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
		record?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

	const isExpired = editableWorkflow && now.isAfter(endDateUpdateEvidence);

	return (
		<ModalExpandable
			title='Detail Evidence'
			width={1000}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			open={visibleForm}
			styles={{
				body: { backgroundColor: '#F8F8F8', borderRadius: 2 },
				header: { backgroundColor: '#F8F8F8' },
			}}
			zIndex={iszindex ? 999 : undefined}
		>
			{record?.isAwardRecognition ? (
				<FormPerstionActivityOutCome />
			) : record?.activityCategory === EActivityCategory.REGISTERED ? (
				<CardChiTietSuKien
					record={{
						...record?.activities,
						activityOutcome: record,
					}}
					evidenceDeadline={
						record?.workflow === EApprovalStatus.CHANGES_REQUIRED
							? record?.dueDate
								? dayjs(record?.dueDate).format('HH:mm DD/MM/YYYY')
								: '--'
							: record?.activities?.allowPostEventResultsUpdate
								? record?.activities?.dueDate
									? dayjs(record?.dueDate).format('HH:mm DD/MM/YYYY')
									: '--'
								: record?.endDate
									? dayjs(record?.endDate).format('HH:mm DD/MM/YYYY')
									: '--'
					}
					infoEvidence
					isExpired={isExpired}
				/>
			) : (
				<ChiTietActivityOutCome recOutcome={record ?? ({} as ActivityOutCome.IRecord)} />
			)}

			<div
				style={{
					backgroundColor: '#fff',
					display: 'flex',
					gap: 8,
					justifyContent: 'flex-end',
					margin: '15px -15px -15px -15px',
					padding: 16,
				}}
			>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				{!isActivity && (
					<>
						{record?.workflow === EApprovalStatus.SUBMITTED ? (
							<>
								<Button
									type='primary'
									className='btn-success'
									onClick={() => {
										setTrangThai({
											title: intl.formatMessage({ id: 'activityresult.xuly.duyet' }),
											trangThai: EApprovalStatus.APPROVED,
										});
										setVisibleXuLy(true);
									}}
								>
									{intl.formatMessage({ id: 'activityresult.button.duyet' })}
								</Button>
								<Button
									type='primary'
									onClick={() => {
										setTrangThai({
											title: intl.formatMessage({ id: 'activityresult.xuly.tuchoi' }),
											trangThai: EApprovalStatus.REJECTED,
										});
										setVisibleXuLy(true);
									}}
									className='btn-error'
								>
									{intl.formatMessage({ id: 'activityresult.button.tuchoi' })}
								</Button>
								<Button
									type='primary'
									onClick={() => {
										setTrangThai({
											title: intl.formatMessage({ id: 'activityresult.xuly.yccs' }),
											trangThai: EApprovalStatus.CHANGES_REQUIRED,
										});
										setVisibleXuLy(true);
									}}
									className='btn-warning'
								>
									{intl.formatMessage({ id: 'activityresult.button.yccs' })}
								</Button>
							</>
						) : (
							<>
								<Button type='primary' onClick={() => setVisibleChangeStatus(true)}>
									{intl.formatMessage({ id: 'activityresult.button.changeStatus' })}
								</Button>
								<Button
									type='primary'
									className='btn-success'
									onClick={() => setVisibleImpact(true)}
									disabled={record?.workflow !== EApprovalStatus.APPROVED}
								>
									{intl.formatMessage({ id: 'activityresult.button.verifyImpact' })}
								</Button>
							</>
						)}
					</>
				)}
			</div>
		</ModalExpandable>
	);
};

export default FormActivityStudent;
