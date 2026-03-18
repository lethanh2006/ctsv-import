import { type HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

/**
 * Select học phần riêng, ko dùng model hocphan
 */
const SelectHocPhanSinhVien = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	selectMa?: boolean;
	style?: React.CSSProperties;
	ssoId?: string;
}) => {
	const { value, onChange, multiple, allowClear, selectMa, disabled, style, ssoId } = props;
	const { getAllModel } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const [danhSach, setDanhSach] = useState<HocPhan.IRecord[]>([]);

	useEffect(() => {
		if (ssoId)
			getAllModel(false, undefined, undefined, undefined, `hoc-phan/sinh-vien/${ssoId}`, false).then((data: any) =>
				setDanhSach(data),
			);
	}, [ssoId]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten} (${item.ma} - ${item.soTinChi} tín)`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn học phần'
			style={{ width: '100%', ...style }}
			allowClear={allowClear ?? false}
		/>
	);
};

export default SelectHocPhanSinhVien;
