import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { EOperatorType } from '@/components/Table/constant';
import { EApprovalStatus } from '@/services/CCT/constant';
import { inputFormat } from '@/utils/utils';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatActivityOutCome = (props: {
	getData: () => void;
	pending: boolean;
	processed: boolean;
	dependency?: any;
}) => {
	const { getData, pending, processed, dependency } = props;
	// const intl = useIntl();
	const { loadingThongKe, dataThongKe, filters, setFilters } = useModel('cct.activityoutcome');

	useEffect(() => {
		getData();
	}, [dependency]);

	const PROCESSED = [EApprovalStatus.APPROVED, EApprovalStatus.REJECTED, EApprovalStatus.CHANGES_REQUIRED];

	const filterTrangThai = (workflow: EApprovalStatus | EApprovalStatus[] | 'all') => {
		const temp = [...(filters ?? [])].filter((item) => item.field !== 'workflow');

		if (workflow !== 'all') {
			temp.push({
				active: true,
				field: 'workflow',
				values: Array.isArray(workflow) ? workflow : [workflow],
				operator: EOperatorType.INCLUDE,
			});
		}

		setFilters(temp);
	};

	const statisticsData: StatisticsItem[] = [
		{
			title: 'Total',
			value: inputFormat(dataThongKe?.total ?? 0),
			valueColor: '#1677ff',
			onClick: () => filterTrangThai('all'),
		},
		{
			title: 'Pending',
			value: inputFormat(dataThongKe?.pending ?? 0),
			valueColor: '#faad14',
			onClick: () => filterTrangThai(EApprovalStatus.SUBMITTED),
			selected: pending,
		},
		{
			title: 'Processed',
			value: inputFormat(dataThongKe?.processed ?? 0),
			valueColor: '#52c41a',
			onClick: () => filterTrangThai(PROCESSED),
			selected: processed,
		},
	];

	return (
		<StatisticsCard
			data={statisticsData}
			loading={loadingThongKe}
			hideCard={true}
			colSpan={{ xs: 24, md: 8 }}
			rowGutter={8}
			containerStyle={{ marginBottom: 12 }}
			title=''
		/>
	);
};

export default StatActivityOutCome;
