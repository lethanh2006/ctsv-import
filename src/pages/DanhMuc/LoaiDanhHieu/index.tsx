import TableStaticData from '@/components/Table/TableStaticData';
import { LoaiDanhHieuThiDuaKhenThuongGiaiThuong } from '@/services/DanhMuc/constants';
import { Card } from 'antd';

const LoaiDanhHieu = () => {
	return (
		<Card title='Loại danh hiệu thi đua khen thưởng'>
			<TableStaticData
				columns={[
					{
						title: 'Loại danh hiệu',
						dataIndex: 'ten',
						width: 250,
						filterType: 'string',
					},
				]}
				data={Object.values(LoaiDanhHieuThiDuaKhenThuongGiaiThuong).map((item) => ({
					ten: item,
				}))}
				addStt
			/>
		</Card>
	);
};

export default LoaiDanhHieu;
