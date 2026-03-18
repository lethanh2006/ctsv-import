import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import { inputFormat } from '@/utils/utils';
import { Axis, Chart, Coord, Geom, Label, Tooltip } from 'bizcharts';

const ThongKeMultipleChoice = (props: { ketQua: BieuMau.ThongKeLuaChon[] }) => {
	const cols = {};
	return (
		<div>
			<Chart height={300} width={700} data={props.ketQua} scale={cols}>
				<Coord transpose />
				<Axis name='noiDungLuaChon' />
				<Axis name='soLuong' visible={false} />
				<Tooltip />
				<Geom type='interval' position='noiDungLuaChon*soLuong' color={['noiDungLuaChon', '#E6F6C8-#3376CB']}>
					<Label content={['noiDungLuaChon*soLuong', (name, value) => inputFormat(value)]} />{' '}
				</Geom>
			</Chart>
		</div>
	);
};

export default ThongKeMultipleChoice;
