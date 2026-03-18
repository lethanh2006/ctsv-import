import type { TFilter } from '@/components/Table/typing';
import { DownOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectPhongCSVC = (props: {
	value?: string;
	onChange?: (val: string | string[], option: any) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<PhongCSVC.IRecord>;
	selectMa?: boolean;
	disabled?: boolean;
	filter?: TFilter<PhongCSVC.IRecord>[];
	hideTCHC?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, selectMa, disabled, filter, hideTCHC } =
		props;
	const { danhSach, getAllModel, loading } = useModel('cosovatchat.phong');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, condition, filter);
	}, [JSON.stringify(condition), JSON.stringify(filter)]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			notFoundContent={loading ? <Spin spinning={true} style={{ width: '100%', margin: 10 }} /> : undefined}
			options={(hideTCHC ? danhSach?.filter((item) => item?.maDonViSuDung !== '04') : danhSach).map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item?.ten} - ${item?.soPhong}`,
				rawData: item,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'activity.info.form.location.onCampus.place' })}
			style={{ width: '100%', ...style }}
			suffixIcon={<DownOutlined />}
		/>
	);
};

export default SelectPhongCSVC;
