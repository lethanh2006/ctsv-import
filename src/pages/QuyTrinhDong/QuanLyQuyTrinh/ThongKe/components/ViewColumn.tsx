import ColumnChart from '@/components/Chart/ColumnChart';
import _ from 'lodash';

const ViewColumnThongKe = (props: { data: any[] }) => {
	const objKeyTypeNumber =
		Object.keys(props?.data?.[0])?.find((item) => typeof props.data[0]?.[item] === 'number') ?? '';
	const objKeyTypeString =
		Object.keys(props?.data?.[0])?.find((item) => typeof props.data[0]?.[item] === 'string') ?? '';

	const dataFinal = [...props.data];

	return (
		<ColumnChart
			formatY={(val) => val + ''}
			yLabel={['Số lượng']}
			xAxis={dataFinal.map((i) => i[objKeyTypeString] + '')}
			yAxis={[dataFinal.map((i) => i[objKeyTypeNumber])]}
		/>
	);
};

export default ViewColumnThongKe;
