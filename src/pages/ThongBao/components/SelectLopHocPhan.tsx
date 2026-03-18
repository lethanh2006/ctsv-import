import { EOperatorType } from '@/components/Table/constant';
import { ELoaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLopHocPhanDebounce = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	selectMa?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, disabled, selectMa } = props;
	const { danhSach, filters, setFilters, getModel, loading } = useModel('daotaov2.hocky.lophocphan');

	useEffect(() => {
		// Nếu trong danh sách đã có 1 giá trị trong `value` rồi thì ko get lại data nữa
		// Nhưng `có thể` bug khi lần đầu render
		const gotData = danhSach.some((item) =>
			Array.isArray(value)
				? value.includes(selectMa ? item.ten : item._id)
				: value === (selectMa ? item.ten : item._id),
		);
		getModel(
			{ loai: ELoaiLopHocPhan.CHINH },
			(!filters || !filters.length) && value && !gotData
				? [
						{
							active: true,
							field: selectMa ? 'ten' : '_id',
							values: Array.isArray(value) ? value : [value],
							operator: EOperatorType.INCLUDE,
						},
					]
				: undefined,
			undefined,
			1,
			20,
		);
	}, [filters, value]);

	const searchDebounceLopHocPhan = _.debounce((val) => {
		setFilters([{ active: true, field: 'ten', values: [val], operator: EOperatorType.CONTAIN }]);
	}, 800);

	return (
		<div style={{ display: 'flex', gap: 8 }}>
			<Select
				mode={multiple ? 'multiple' : undefined}
				value={value}
				onChange={onChange}
				disabled={disabled}
				notFoundContent={loading ? <Spin spinning={true} /> : undefined}
				onSearch={(val) => searchDebounceLopHocPhan(val)}
				options={danhSach.map((item) => ({
					key: item._id,
					value: selectMa ? item.ten : item._id,
					label: `${item.ten}${item.hocPhan?.ten ? ` (${item.hocPhan.ten})` : ''}`,
				}))}
				showSearch
				optionFilterProp='label'
				placeholder={intl.formatMessage({ id: 'thongbao.select.lophocphan.chonlophocphan' })}
			/>
		</div>
	);
};

export default SelectLopHocPhanDebounce;
