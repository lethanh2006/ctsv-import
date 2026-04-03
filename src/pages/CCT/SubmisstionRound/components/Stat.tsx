import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { EOperatorType } from '@/components/Table/constant';
import { EStatusMyCCT } from '@/services/CCT/constant';
import { inputFormat } from '@/utils/utils';
import { useModel } from 'umi';

const StatMyCTT = (props: { loadingThongKe: boolean; dataThongKe: MyCCT.IAnalyticsMyCCT }) => {
	const { loadingThongKe, dataThongKe } = props;
	const { filters, setFilters } = useModel('cct.mycct');
	const valueFiltered = filters?.find((item) => item.field == 'status')?.values?.[0];

	const filterTrangThai = (status: EStatusMyCCT | 'all') => {
		const temp = [...(filters ?? [])].filter((item) => item.field !== 'status');

		if (status !== 'all') {
			temp.push({
				active: true,
				field: 'status',
				values: [status],
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
			title: 'Approved',
			value: inputFormat(dataThongKe?.approved ?? 0),
			valueColor: '#52c41a',
			onClick: () => filterTrangThai(EStatusMyCCT.APPROVED),
			selected: valueFiltered === EStatusMyCCT.APPROVED,
		},
		{
			title: 'Changed Required',
			value: inputFormat(dataThongKe?.changeRequired ?? 0),
			valueColor: '#fa8c16',
			onClick: () => filterTrangThai(EStatusMyCCT.CHANGES_REQUIRED),
			selected: valueFiltered === EStatusMyCCT.CHANGES_REQUIRED,
		},
		{
			title: 'Pending Approval',
			value: inputFormat(dataThongKe?.pending ?? 0),
			valueColor: '#faad14',
			onClick: () => filterTrangThai(EStatusMyCCT.PENDING_APPROVAL),
			selected: valueFiltered === EStatusMyCCT.PENDING_APPROVAL,
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

export default StatMyCTT;
