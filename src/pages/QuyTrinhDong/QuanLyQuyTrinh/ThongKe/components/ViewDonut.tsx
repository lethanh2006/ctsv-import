import DonutChart from '@/components/Chart/DonutChart';
import { inputFormat } from '@/utils/utils';

const ViewDonutThongKe = (props: { data: any[] }) => {
	const objKeyTypeNumber =
		Object.keys(props?.data?.[0])?.find((item) => typeof props.data[0]?.[item] === 'number') ?? '';
	const objKeyTypeString =
		Object.keys(props?.data?.[0])?.find((item) => typeof props.data[0]?.[item] === 'string') ?? '';

	return (
		<DonutChart
			formatY={(val) => inputFormat(val ?? 0)}
			showTotal={true}
			xAxis={
				props.data?.map((item) => {
					return item[objKeyTypeString];
				}) as string[]
			}
			height={300}
			yAxis={[
				props.data?.map((item) => {
					return item[objKeyTypeNumber];
				}) as number[],
			]}
			yLabel={['']}
		/>
	);
};

export default ViewDonutThongKe;
