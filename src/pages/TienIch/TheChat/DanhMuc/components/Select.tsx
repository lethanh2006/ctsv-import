import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDanhMucTheChat = (props: {
	value?: string;
	onChange?: (id: string) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, disabled, style, selectMa } = props;
	const { danhSach, getAllModel } = useModel('tienich.thechat.danhmuc');

	useEffect(() => {
		if (!danhSach.length) getAllModel();
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn danh mục thể chất'}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectDanhMucTheChat;
