import { EOperatorType } from '@/components/Table/constant';
import type { BieuMau } from '@/services/TienIch/BieuMau/typings';
import { ELoaiBieuMau } from '@/services/TienIch/constant';
import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select để cho vào FormItem
 */
const SelectMauKhaoSat = (props: {
	value?: string;
	onChange?: (val: string | string[], option: any) => void;
	multiple?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
	disabled?: boolean;
	condition?: Partial<BieuMau.Record>;
	size?: 'small' | 'middle' | 'large';
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, placeholder, style, disabled, condition, size } = props;
	const { danhSach, getAllModel, visibleForm, loading } = useModel('tienich.bieumau');

	useEffect(() => {
		if (!visibleForm)
			getAllModel(undefined, undefined, condition, [
				{
					active: true,
					field: 'loai',
					operator: EOperatorType.NOT_INCLUDE,
					values: [ELoaiBieuMau.TRAC_NGHIEM], //Lọc biểu mẫu liên quan đến giao bài tập phân hệ cán bộ
				},
				{
					active: true,
					field: 'khaoSatChaId',
					operator: EOperatorType.NULL, //Loại bỏ biểu mẫu tự sinh
				},
			]);
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			size={size}
			loading={loading}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			disabled={disabled}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.tieuDe,
				rawData: item,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? intl.formatMessage({ id: 'sukien.form.thongtinchung.bieumau.place' })}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectMauKhaoSat;
