import { Select, Spin } from 'antd';
import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectQuyTrinhChuyenVien = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	loaiXuLyDon: string;
	hienThiMaQuocTich?: boolean;
	style?: CSSProperties;
}) => {
	const { value, onChange, multiple, loadData, allowClear, placeholder, disabled, style,loaiXuLyDon } = props;
	const { dataQuyTrinh, loading, getDataByChuyenVien } = useModel('quytrinh.quanlyquytrinh');

	useEffect(() => {
		if (loadData !== false) getDataByChuyenVien(loaiXuLyDon);
	}, []);

	return (
		<Select
			notFoundContent={loading ? <Spin spinning={true} /> : undefined}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			disabled={disabled}
			allowClear={allowClear}
			onChange={onChange}
			options={dataQuyTrinh.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item?.ten}`,
			}))}
			style={style}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn quy trình'}
		/>
	);
};

export default SelectQuyTrinhChuyenVien;
