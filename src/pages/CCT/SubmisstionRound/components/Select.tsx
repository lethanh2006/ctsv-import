import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectSubmisstionRound = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<SubmisstionRound.IRecord>;
	disabled?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled } = props;
	const { danhSach, getAllModel } = useModel('cct.submissionround');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, { ...condition });
	}, [JSON.stringify(condition)]);

	const options = (danhSach || []).map((item) => ({
		key: item._id,
		value: item._id,
		label: item.roundName,
		rawData: item,
	}));

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={options}
			showSearch
			optionFilterProp='label'
			placeholder='Select Submisstion Round'
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectSubmisstionRound;
