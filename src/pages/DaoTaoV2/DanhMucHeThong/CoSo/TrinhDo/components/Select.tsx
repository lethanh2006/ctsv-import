import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectTrinhDo = (props: {
	value?: string | string[];
	onChange?: (id?: string | string[] | null) => void;
	multiple?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	hasDefault?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, placeholder, hasDefault, style, selectMa, disabled } = props;
	const { danhSach, getAllModel } = useModel('daotaov2.danhmuc.trinhdo');

	useEffect(() => {
		getAllModel().then((data) => {
			// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
			// Thì chọn phần tử đầu tiên
			if (hasDefault && data.length === 1 && !!onChange) onChange(selectMa ? data[0].ma : data[0]._id);
		});
	}, []);

	return (
		<Select
			disabled={disabled}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			mode={multiple ? 'multiple' : undefined}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten ?? item.dmTrinhDo?.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? intl.formatMessage({ id: 'lophanhchinh.filterkhoanganh.select.trinhdo' })}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectTrinhDo;
