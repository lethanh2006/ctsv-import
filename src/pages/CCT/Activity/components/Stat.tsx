import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { EOperatorType } from '@/components/Table/constant';
import useCheckAccess from '@/hooks/useCheckAccess';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatActivity = (props: { currentWorkflow: 'total' | 'upcoming' | 'ongoing' | 'completed' }) => {
	const { currentWorkflow } = props;
	const intl = useIntl();
	const { loadingThongKe, dataThongKe, getAnalyticsActivityModel, filters, setFilters } = useModel('cct.activity');
	const { initialState } = useModel('@@initialState');
	const quanTri = useCheckAccess('ctsv|activity-management');

	useEffect(() => {
		getAnalyticsActivityModel(
			!quanTri
				? {
						activityCreatorSsoId: initialState?.currentUser?.ssoId,
					}
				: undefined,
		);
	}, []);

	const filterTrangThai = (workflow: 'total' | 'upcoming' | 'ongoing' | 'completed') => {
		const now = dayjs().toISOString();

		const temp = [...(filters ?? [])].filter((item) => item.field !== 'startDate' && item.field !== 'endDate');

		if (workflow === 'upcoming') {
			temp.push({
				active: true,
				field: 'startDate',
				values: [now],
				operator: EOperatorType.GREAT_THAN,
			});
		}

		if (workflow === 'ongoing') {
			temp.push(
				{
					active: true,
					field: 'startDate',
					values: [now],
					operator: EOperatorType.LESS_EQUAL,
				},
				{
					active: true,
					field: 'endDate',
					values: [now],
					operator: EOperatorType.GREAT_EQUAL,
				},
			);
		}

		if (workflow === 'completed') {
			temp.push({
				active: true,
				field: 'endDate',
				values: [now],
				operator: EOperatorType.LESS_THAN,
			});
		}

		setFilters(temp);
	};

	const statisticsData: StatisticsItem[] = [
		{
			title: intl.formatMessage({ id: 'activityresult.stat.total' }),
			value: inputFormat(dataThongKe?.total ?? 0),
			valueColor: '#1677ff',
			onClick: () => filterTrangThai('total'),
		},
		{
			title: intl.formatMessage({ id: 'activityresult.stat.upcoming' }),
			value: inputFormat(dataThongKe?.upcoming ?? 0),
			valueColor: '#faad14',
			onClick: () => filterTrangThai('upcoming'),
			selected: currentWorkflow === 'upcoming',
		},
		{
			title: intl.formatMessage({ id: 'activityresult.stat.ongoing' }),
			value: inputFormat(dataThongKe?.ongoing ?? 0),
			valueColor: '#52c41a',
			onClick: () => filterTrangThai('ongoing'),
			selected: currentWorkflow === 'ongoing',
		},
		{
			title: intl.formatMessage({ id: 'activityresult.stat.completed' }),
			value: inputFormat(dataThongKe?.completed ?? 0),
			valueColor: '#8c8c8c',
			onClick: () => filterTrangThai('completed'),
			selected: currentWorkflow === 'completed',
		},
	];

	return (
		<StatisticsCard
			data={statisticsData}
			loading={loadingThongKe}
			hideCard={true}
			colSpan={{ xs: 24, md: 6 }}
			rowGutter={8}
			containerStyle={{ marginBottom: 12 }}
			title=''
		/>
	);
};

export default StatActivity;
