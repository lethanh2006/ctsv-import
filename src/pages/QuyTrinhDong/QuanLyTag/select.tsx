import { Select, Spin } from 'antd';
import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectTags = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	hienThiMaQuocTich?: boolean;
	valueGet?: string;
	style?: CSSProperties;
}) => {
	const { value, onChange, multiple, loadData, allowClear, placeholder, disabled, style, valueGet } = props;
	const { danhSach, getAllModel, loading } = useModel('quytrinh.quanlytag');

	useEffect(() => {
		if (loadData !== false) getAllModel();
	}, []);

	return (
		<Select
			notFoundContent={loading ? <Spin spinning={true} /> : undefined}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			disabled={disabled}
			allowClear={allowClear}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: valueGet ? item?.[valueGet] : item._id,
				label: `${item?.ten}`,
			}))}
			style={style}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn nhãn'}
		/>
	);
};

export default SelectTags;
