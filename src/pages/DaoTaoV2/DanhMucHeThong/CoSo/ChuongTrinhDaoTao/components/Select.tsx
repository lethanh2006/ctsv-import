import { EOperatorType } from '@/components/Table/constant';
import type { ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ETrangThaiCtdt } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectChuongTrinh = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	condition?: Partial<ChuongTrinhDaoTao.IRecord>;
	selectMa?: boolean;
	selectAll?: boolean;
}) => {
	const { value, onChange, multiple, disabled, condition, selectMa, selectAll } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');

	useEffect(() => {
		if (!visibleForm)
			getAllModel(
				false,
				undefined,
				condition,
				selectAll
					? undefined
					: [
							{
								active: true,
								field: 'trangThai',
								values: [ETrangThaiCtdt.LUU_TRU, ETrangThaiCtdt.RA_SOAT],
								operator: EOperatorType.NOT_INCLUDE,
							},
					  ],
			);
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn chương trình đào tạo'
			style={{ width: '100%' }}
		/>
	);
};

export default SelectChuongTrinh;
