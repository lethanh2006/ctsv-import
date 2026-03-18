import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKhoiNganh = (props: { value?: string; onChange?: any; multiple?: boolean; selectMa?: boolean }) => {
	const { value, onChange, multiple, selectMa } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.danhmuc.dmkhoinganh');

	useEffect(() => {
		if (!visibleForm) getAllModel();
	}, [visibleForm]);

	return (
		<Select
			value={value}
			onChange={onChange}
			mode={multiple ? 'multiple' : undefined}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten} (${item.ma})`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn khối ngành đào tạo'
		/>
	);
};

export default SelectKhoiNganh;
