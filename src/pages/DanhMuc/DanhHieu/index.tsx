import TableStaticData from '@/components/Table/TableStaticData';
import { DanhHieuThiDuaKhenThuongGiaiThuong } from '@/services/DanhMuc/constants';
import { Card } from 'antd';
import _ from 'lodash';

const DanhHieu = () => {
	return (
		<Card title='Danh hiệu thi đua khen thưởng'>
			<TableStaticData
				columns={[
					{
						title: 'Tên danh hiệu thi đua khen thưởng',
						dataIndex: 'danhHieu',
						width: 250,
						filterType: 'string',
					},

					{
						title: 'Loại danh hiệu thi đua khen thưởng',
						dataIndex: 'loaiDanhHieu',
						width: 150,
						filterType: 'select',
						filterData: _.uniq(DanhHieuThiDuaKhenThuongGiaiThuong.map((item) => item.loaiDanhHieu)),
					},
				]}
				data={DanhHieuThiDuaKhenThuongGiaiThuong}
				addStt
			/>
		</Card>
	);
};

export default DanhHieu;
