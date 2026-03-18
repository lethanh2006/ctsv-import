import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

/**
 * Select học phần riêng, ko dùng model hocphan
 */
const SelectHocPhanRieng = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	loadData?: boolean;
	selectMa?: boolean;
	style?: React.CSSProperties;
	condition?: Partial<HocPhan.IRecord>;
	selectAll?: boolean;
	maHocKy?: string;
}) => {
	const { value, onChange, multiple, allowClear, selectMa, disabled, style, condition, selectAll, maHocKy } = props;
	const { getAllModel } = useModel('daotaov2.hocphan.hocphan');
	const [danhSach, setDanhSach] = useState<HocPhan.IRecord[]>([]);

	useEffect(() => {
		getAllModel(
			false,
			undefined,
			{
				...condition,
				active: !selectAll && !maHocKy ? true : undefined,
			},
			undefined,
			maHocKy ? `many/hoc-ky/${maHocKy}` : undefined,
			false,
		).then((data) => setDanhSach(data));
	}, [maHocKy, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten} (${item.ma} - ${item.soTinChi} tín)`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn học phần'
			style={{ width: '100%', ...style }}
			allowClear={allowClear ?? false}
		/>
	);
};

export default SelectHocPhanRieng;
