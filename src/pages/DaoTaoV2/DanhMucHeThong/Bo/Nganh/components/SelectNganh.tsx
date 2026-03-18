import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNganh = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	maDmTrinhDo?: string;
	disabled?: boolean;
	selectMa?: boolean;
	style?: React.CSSProperties;
}) => {
	const { value, onChange, multiple, maDmTrinhDo, disabled, selectMa, style } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.danhmuc.dmnganh');

	useEffect(() => {
		if (!visibleForm) getAllModel(undefined, undefined, { maDmTrinhDo });
	}, [visibleForm, maDmTrinhDo]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten} - ${item.ma}`,
			}))}
			style={{ width: '100%', ...style }}
			showArrow
			showSearch
			optionFilterProp='label'
			placeholder='Chọn ngành đào tạo theo Bộ'
		/>
	);
};

export default SelectNganh;
