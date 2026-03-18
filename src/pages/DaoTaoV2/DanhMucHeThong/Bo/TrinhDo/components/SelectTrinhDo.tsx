import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectTrinhDo = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, style, selectMa } = props;
	const { danhSach, getAllModel } = useModel('daotaov2.danhmuc.dmtrinhdo');

	useEffect(() => {
		getAllModel();
	}, []);

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
			placeholder='Chọn trình độ đào tạo của Bộ'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectTrinhDo;
