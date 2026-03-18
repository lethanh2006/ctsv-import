import SelectNganhCoSo from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import { Space } from 'antd';
import { useModel } from 'umi';
import SelectKhoaSinhVien from '../KhoaSinhVien/components/Select';

const FilterKhoaNganhKeHoachNamHoc = () => {
	const { danhSach: danhSachKhoa, record: recKhoa, setRecord: setKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { danhSach: danhSachNganh, record: recNganh, setRecord: setNganh } = useModel('daotaov2.danhmuc.nganhdaotao');

	return (
		<Space wrap style={{ marginTop: 12 }}>
			<SelectKhoaSinhVien
				loadData={false}
				value={recKhoa?.ma}
				onChange={(val) => setKhoa(danhSachKhoa.find((i) => i.ma === val))}
				selectMa
				style={{ width: 200 }}
				allowClear
			/>
			<SelectNganhCoSo
				loadData={false}
				value={recNganh?.ma}
				onChange={(val) => setNganh(danhSachNganh.find((i) => i.ma === val))}
				selectMa
				style={{ width: 250 }}
				allowClear
			/>
		</Space>
	);
};

export default FilterKhoaNganhKeHoachNamHoc;
