import FilterHocKy from '@/pages/DaoTaoV2/HocKy/HocKy/components/FilterHocKy';
import SelectDonVi from '@/pages/DaoTaoV2/ToChucNhanSu/DonVi/Select';
import { useModel } from 'umi';
import SelectHocPhan from './SelectHocPhan';

const FilterHocPhan = () => {
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan, setRecord: setHocPhan, danhSach: danhSachHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const { record: recDonVi, setRecord: setDonVi, danhSach: danhSachDonVi } = useModel('daotaov2.tochucnhansu.donvi');

	return (
		<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
			<FilterHocKy isSetHocKy />
			<SelectDonVi
				value={recDonVi?.maDonVi}
				style={{ width: 350 }}
				onChange={(val) => {
					setDonVi(danhSachDonVi.find((item) => item.maDonVi === val));
					setHocPhan(undefined);
				}}
				allowClear
				placeholder='Chọn đơn vị quản lý'
			/>
			<SelectHocPhan
				maHocKy={recHocKy?.ma}
				condition={{ maDonVi: recDonVi?.maDonVi }}
				value={recHocPhan?.ma}
				style={{ width: 300 }}
				selectMa
				onChange={(ma) => setHocPhan(danhSachHocPhan.find((item) => item.ma === ma))}
				allowClear
			/>
		</div>
	);
};

export default FilterHocPhan;
