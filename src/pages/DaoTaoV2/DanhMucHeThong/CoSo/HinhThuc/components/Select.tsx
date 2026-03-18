import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHinhThuc = (props: {
	value?: string | string[];
	onChange?: (id?: string | string[] | null) => void;
	multiple?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
	selectMa?: boolean;
	hasDefault?: boolean;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, placeholder, style, selectMa, hasDefault, disabled } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.danhmuc.hinhthucdaotao');

	useEffect(() => {
		if (!visibleForm)
			getAllModel().then((data) => {
				// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
				// Thì chọn phần tử đầu tiên
				if (hasDefault && data.length === 1 && !!onChange) onChange(selectMa ? data[0].ma : data[0]._id);
			});
	}, [visibleForm]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item?.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? intl.formatMessage({ id: 'lophanhchinh.filterkhoanganh.select.hinhthuc' })}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectHinhThuc;
