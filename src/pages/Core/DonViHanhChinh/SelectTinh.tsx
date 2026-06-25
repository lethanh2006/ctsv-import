import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectTinhThanhPho = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
	selectMa?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, loadData, allowClear, selectMa } = props;
	const { danhSach, getAllModel, loading } = useModel('core.tinhthanhpho');

	useEffect(() => {
		if (loadData !== false && !danhSach.length) getAllModel();
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item.ma,
				value: selectMa ? item.ma : item.tenDonVi,
				label: item.tenDonVi,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'sinhvien.select.tinhtp.place' })}
			loading={loading}
		/>
	);
};

export default SelectTinhThanhPho;
