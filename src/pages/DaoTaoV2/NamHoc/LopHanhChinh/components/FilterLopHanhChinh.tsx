import { JSX } from 'react';
import { useModel } from 'umi';
import FilterKhoaNganh from '../../KhoaNganh/components/Filter';
import SelectLopHanhChinhCondition from './SelectLopHanhChinhCondition';

const FilterLopHanhChinh = (props: { width?: number; children?: JSX.Element }) => {
	const { record, setRecord, danhSach } = useModel('daotaov2.namhoc.lophanhchinh');
	const { record: recKhoa } = useModel('daotaov2.namhoc.khoasinhvien');
	const { record: recNganh } = useModel('daotaov2.danhmuc.nganhdaotao');

	return (
		<FilterKhoaNganh>
			<SelectLopHanhChinhCondition
				value={record?._id}
				onChange={(val) => setRecord(danhSach.find((i) => i._id === val))}
				style={{ width: 200 }}
				isSetRecord={!!recKhoa?.ma || !!recNganh?.ma || !record?._id}
				condition={{ maKhoaSinhVien: recKhoa?.ma, maNganh: recNganh?.ma }}
			/>

			{props.children}
		</FilterKhoaNganh>
	);
};

export default FilterLopHanhChinh;
