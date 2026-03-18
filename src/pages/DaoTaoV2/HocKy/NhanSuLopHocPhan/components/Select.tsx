import { Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SelectNhanSuLopHocPhan = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	lopHocPhanId?: string;
	hasDefault?: boolean;
	loadData?: boolean;
	placeholder?: string;
}) => {
	const { value, onChange, multiple, lopHocPhanId, hasDefault, loadData, placeholder } = props;
	const { danhSach, getAllModel, loading } = useModel('daotaov2.hocky.nhansulophocphan');

	useEffect(() => {
		if (loadData !== false)
			getAllModel(false, undefined, { lopHocPhanId }).then((data) => {
				// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
				// Thì chọn phần tử đầu tiên
				if (hasDefault && !value) onChange(data?.[0]?.nhanSuSsoId);
			});
		else if (hasDefault && !value) onChange(danhSach?.[0]?.nhanSuSsoId);
	}, [lopHocPhanId]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			notFoundContent={loading ? <Spin spinning={true} /> : undefined}
			options={danhSach.map((item) => ({
				key: item.nhanSuSsoId,
				value: item.nhanSuSsoId,
				label: `${item.tenNhanSu ?? ''} - ${item.maNhanSu ?? ''}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder || 'Chọn cán bộ, giảng viên'}
		/>
	);
};

export default SelectNhanSuLopHocPhan;
