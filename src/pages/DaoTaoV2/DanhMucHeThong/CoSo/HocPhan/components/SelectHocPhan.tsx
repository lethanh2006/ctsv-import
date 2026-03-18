import type { HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHocPhan = (props: {
	value?: string;
	onChange?: (val: string | null) => void;
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
	const { value, multiple, allowClear, loadData, selectMa, disabled, style, condition, selectAll, maHocKy } = props;
	const { danhSach, getAllModel, loading } = useModel('daotaov2.hocphan.hocphan');

	useEffect(() => {
		if (loadData !== false)
			getAllModel(
				!!condition?.donVi,
				undefined,
				{
					...condition,
					active: !selectAll && !maHocKy ? true : undefined,
				},
				undefined,
				maHocKy ? `many/hoc-ky/${maHocKy}` : undefined,
			);
	}, [loadData, maHocKy, JSON.stringify(condition)]);

	const onChange = (val: string) => {
		if (props.onChange)
			if (val) props.onChange(val);
			else props.onChange(null);
	};

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
			showArrow
			loading={loading}
		/>
	);
};

export default SelectHocPhan;
