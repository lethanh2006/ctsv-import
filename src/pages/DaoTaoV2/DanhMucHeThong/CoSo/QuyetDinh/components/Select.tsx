import type { ELoaiQuyetDinh } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectQuyetDinh = (props: {
	value?: string;
	onChange?: (id: string) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	placeholder?: string;
	hasDefault?: boolean;
	selectMa?: boolean;
	style?: React.CSSProperties;
	loai: ELoaiQuyetDinh;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, disabled, hasDefault, style, loai } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.quyetdinh.quyetdinh');

	useEffect(() => {
		if (!visibleForm)
			getAllModel(undefined, undefined, { loai }).then((data) => {
				// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
				// Thì chọn phần tử đầu tiên
				if (hasDefault && data.length === 1 && !!onChange) onChange(data[0].soQuyetDinh);
			});
	}, [visibleForm, loai]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item?._id,
				label: item?.soQuyetDinh,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn loại quyết định'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectQuyetDinh;
