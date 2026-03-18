import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNhomTietHoc = (props: {
	value?: string;
	onChange?: (val: string | string[] | null) => void;
	multiple?: boolean;
	disabled?: boolean;
	loadData?: boolean;
	isSetRecord?: boolean;
	hasDefault?: boolean;
	condition?: { maTrinhDoDaoTao?: string; maHinhThucDaoTao?: string };
	selectMa?: boolean;
	style?: React.CSSProperties;
}) => {
	const { value, onChange, multiple, disabled, loadData, isSetRecord, hasDefault, condition, selectMa, style } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.danhmuc.nhomtiethoc');
	const [created, setCreated] = useState(false); // Sau khi thêm mới xong?

	useEffect(() => {
		if (!visibleForm && loadData !== false)
			getAllModel(isSetRecord, undefined, { ...condition, active: true })
				.then((data) => {
					// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
					// Thì chọn phần tử đầu tiên
					if (hasDefault && (created || data.length === 1) && onChange) onChange(selectMa ? data[0].ma : data[0]._id);
				})
				.finally(() => setCreated(false));
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten} (${item.ma})`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn nhóm tiết học'
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectNhomTietHoc;
