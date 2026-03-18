import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHinhThuc = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, disabled, style, selectMa } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.danhmuc.dmhinhthuc');

	useEffect(() => {
		if (!visibleForm) getAllModel();
	}, [visibleForm]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten} (${item.ma})`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn hình thức đào tạo của bộ'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectHinhThuc;
