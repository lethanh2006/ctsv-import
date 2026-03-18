import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDotRaSoat = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	condition?: Partial<ChuongTrinhDaoTao.IDotRaSoat>;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
}) => {
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord, disabled } = props;
	const { danhSach, getAllModel, visibleForm, loading } = useModel('daotaov2.chuongtrinhdaotao.dotrasoat');

	useEffect(() => {
		if (!visibleForm) getAllModel(!!isSetRecord, { maNamHoc: -1 }, condition);
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item.ten} - ${item.maNamHoc ?? ''}`,
			}))}
			showSearch
			showArrow
			optionFilterProp='label'
			placeholder='Chọn đợt khảo sát'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectDotRaSoat;
