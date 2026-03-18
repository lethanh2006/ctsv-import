import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectGiangVienDeCuong = (props: {
	value?: string;
	onChange?: (nhanSuSsoId: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	loadData?: boolean;
	style?: React.CSSProperties;
	condition?: { deCuongId?: string };
}) => {
	const { value, onChange, multiple, allowClear, loadData, disabled, style, condition } = props;
	const { danhSach, getAllModel } = useModel('daotaov2.hocphan.giangviendecuong');

	useEffect(() => {
		if (loadData !== false) getAllModel(false, undefined, condition);
	}, [loadData, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item.nhanSuSsoId,
				label: `${item.hoTen}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn giảng viên'
			style={{ width: '100%', ...style }}
			allowClear={allowClear ?? false}
		/>
	);
};

export default SelectGiangVienDeCuong;
