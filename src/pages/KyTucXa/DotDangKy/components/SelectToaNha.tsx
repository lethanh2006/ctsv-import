import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

const SelectToaNha = (props: {
	value?: string | string[];
	onChange?: (id: string | string[]) => void;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, disabled, selectMa } = props;
	const { danhSach, getAllModel, visibleForm, loading } = useModel('theodoitaisanvattu.toanha');

	useEffect(() => {
		if (!visibleForm) getAllModel(!!isSetRecord).catch(() => {});
	}, [visibleForm]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item: any) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn tòa nhà'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectToaNha;
