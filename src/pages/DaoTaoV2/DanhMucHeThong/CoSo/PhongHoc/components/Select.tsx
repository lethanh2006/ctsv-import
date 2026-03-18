import { ETrangThaiPhong } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select để cho vào FormItem
 */
const SelectPhongHoc = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	hasDefault?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
	disabled?: boolean;
	selectAll?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, hasDefault, style, selectMa, disabled, selectAll } =
		props;
	const { danhSach, getAllModel } = useModel('daotaov2.danhmuc.phonghoc');

	useEffect(() => {
		getAllModel(false, undefined, !selectAll ? { trangThai: ETrangThaiPhong.HOAT_DONG } : undefined).then((data) => {
			// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
			// Thì chọn phần tử đầu tiên
			if (hasDefault && data.length === 1 && !!onChange) onChange(selectMa ? data[0].ma : data[0]._id);
		});
	}, []);

	return (
		<Select
			value={value}
			disabled={disabled}
			allowClear={allowClear}
			onChange={onChange}
			mode={multiple ? 'multiple' : undefined}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten} (${item.ma})`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn phòng học, giảng đường'}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectPhongHoc;
