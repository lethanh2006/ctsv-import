import { Activity } from '@/services/CCT/Activity/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import { Button, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormActivityStudent from '../../ActivityStudent/components/Form';
import CardChiTietSuKien from '../ChiTiet';
import ListEvidenceActivity from '../ListStudent/ListEvidence';
import RegisteredActivity from '../ListStudent/Registered';

const ModalActivity = () => {
	const intl = useIntl();
	const { visibleForm, record, setVisibleForm } = useModel('cct.activity');
	const [activeKey, setActiveKey] = useState<string>('0');

	useEffect(() => {
		if (!visibleForm) {
			setActiveKey('0');
		}
	}, [visibleForm]);

	return (
		<>
			<Tabs
				activeKey={activeKey}
				onChange={setActiveKey}
				items={[
					{
						key: '0',
						label: intl.formatMessage({ id: 'activity.chitiet.tab1' }),
						children: (
							<>
								<CardChiTietSuKien
									record={
										{
											...record,
											activityOutcome: record?.activityOutcome,
										} as Activity.IRecord
									}
									evidenceDeadline={
										record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED
											? record?.activityOutcome?.dueDate
												? dayjs(record?.activityOutcome?.dueDate).format('HH:mm DD/MM/YYYY')
												: '--'
											: record?.allowPostEventResultsUpdate
												? record?.dueDate
													? dayjs(record?.dueDate).format('HH:mm DD/MM/YYYY')
													: '--'
												: record?.endDate
													? dayjs(record?.endDate).format('HH:mm DD/MM/YYYY')
													: '--'
									}
									infoEvidence={!!record?.activityOutcome?.workflow || !!record?.activityOutcome?._id}
									activeKey={activeKey}
								/>

								<div className='form-footer'>
									<Button onClick={() => setVisibleForm(false)}>
										{intl.formatMessage({ id: 'global.button.dong' })}
									</Button>
								</div>
							</>
						),
					},
					{
						key: '1',
						label: intl.formatMessage({ id: 'activity.chitiet.tab2' }),
						children: <RegisteredActivity />,
					},
					{
						key: '2',
						label: intl.formatMessage({ id: 'activity.chitiet.tab3' }),
						children: <ListEvidenceActivity />,
					},
				]}
			/>

			<FormActivityStudent isActivity />
		</>
	);
};

export default ModalActivity;
