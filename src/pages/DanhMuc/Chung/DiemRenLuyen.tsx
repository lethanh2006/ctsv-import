import { Card } from 'antd';
import DanhMucChungComponent from '.';
import { ELoaiDanhMucChung } from '@/services/QuyTrinhDong/DanhMuc/constants';

const DanhMucChungDiemRenLuyen = () => {
	return (
		<Card title='Danh mục'>
			<DanhMucChungComponent maModule={ELoaiDanhMucChung.DIEM_REN_LUYEN} />
		</Card>
	);
};

export default DanhMucChungDiemRenLuyen;
