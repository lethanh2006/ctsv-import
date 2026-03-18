import { useModel } from 'umi';
import SelectHinhThuc from '../../HinhThuc/components/Select';
import SelectTrinhDo from './Select';

const FilterTrinhDoHinhThuc = (props: { width?: number; allowClear?: boolean; hasDefault?: boolean }) => {
	const { record: recTrinhDo, setRecord: setTrinhDo, danhSach: danhSachTrinhDo } = useModel('daotaov2.danhmuc.trinhdo');
	const {
		record: recHinhThuc,
		setRecord: setHinhThuc,
		danhSach: danhSachHinhThuc,
	} = useModel('daotaov2.danhmuc.hinhthucdaotao');
	const { width = 200, allowClear, hasDefault } = props;

	return (
		<>
			<SelectTrinhDo
				style={{ width }}
				allowClear={allowClear}
				value={recTrinhDo?.ma}
				onChange={(val) => setTrinhDo(danhSachTrinhDo.find((item) => item.ma === val))}
				selectMa
				hasDefault={hasDefault}
			/>
			<SelectHinhThuc
				style={{ width }}
				allowClear={allowClear}
				value={recHinhThuc?.ma}
				onChange={(val) => setHinhThuc(danhSachHinhThuc.find((item) => item.ma === val))}
				selectMa
				hasDefault={hasDefault}
			/>
		</>
	);
};

export default FilterTrinhDoHinhThuc;
