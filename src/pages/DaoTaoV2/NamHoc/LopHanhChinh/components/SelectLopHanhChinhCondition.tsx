import type { LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLopHanhChinhCondition = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<LopHanhChinh.IRecord>;
	selectMa?: boolean;
	keyName?: string;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, disabled, style, isSetRecord, condition, selectMa, keyName } = props;
	const { danhSach, getAllModel } = useModel('daotaov2.namhoc.lophanhchinh');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, condition);
	}, [JSON.stringify(condition)]);

	return (
		<Select
			allowClear
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item: any) => ({
				key: item._id,
				value: selectMa ? item.ten : keyName ? item[keyName] : item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'lophanhchinh.step.cvht.filterLHC.select.lhc' })}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectLopHanhChinhCondition;
