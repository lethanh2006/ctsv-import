import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKhoanThu = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
	disabled?: boolean;
	condition?: any;
	initCondition?: any;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, style, disabled, condition, initCondition } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('dvmc.khoanthu');

	useEffect(() => {
		if (!visibleForm) getAllModel(false, undefined, { ...initCondition, ...condition });
	}, [visibleForm, condition]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			disabled={disabled}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.name,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn lệ phí'}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectKhoanThu;
