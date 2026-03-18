import type { HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLoaiHocPhan = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	selectMa?: boolean;
	allowClear?: boolean;
	hasDefault?: boolean;
	style?: React.CSSProperties;
	disabled?: boolean;
	condition?: Partial<HocPhan.ILoaiHocPhan>;
}) => {
	const { value, onChange, multiple, selectMa, allowClear, hasDefault, style, disabled, condition } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.danhmuc.loaihocphan');

	useEffect(() => {
		if (!visibleForm)
			getAllModel(false, undefined, condition).then((data) => {
				// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
				// Thì chọn phần tử đầu tiên
				if (hasDefault && !!onChange) onChange(selectMa ? data?.[0]?.ma : data?.[0]?._id);
			});
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn tính chất học phần'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectLoaiHocPhan;
