import { Badge, Card, Statistic } from 'antd';

interface DataSoLuongDon {
	_id: string;
	sum: number;
}

const BlockSoLuongDon = (props: { title: string; data: DataSoLuongDon[] }) => {
	const color = ['blue', 'green', 'yellow', 'red', 'pink'];

	const { title, data } = props;

	return (
		<Card>
			<Statistic
				title={<div style={{ fontSize: 16 }}>{title}</div>}
				value={data?.reduce((previousValue, currentValue) => {
					return previousValue + currentValue?.sum;
				}, 0)}
			/>
			{data?.map((val, index) => {
				return (
					<>
						<Badge style={{ marginRight: 4 }} color={color?.[index]} />
						{val?._id}: {val?.sum ?? 0}
						<br />
					</>
				);
			})}
		</Card>
	);
};
export default BlockSoLuongDon;
