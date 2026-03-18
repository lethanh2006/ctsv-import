import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNhomNganh = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, style, selectMa } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.danhmuc.dmnhomnganh');

	useEffect(() => {
		if (!visibleForm) getAllModel();
	}, [visibleForm]);

	return (
		<Select
			value={value}
			onChange={onChange}
			mode={multiple ? 'multiple' : undefined}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten} (${item.ma})`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn nhóm ngành đào tạo'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectNhomNganh;
