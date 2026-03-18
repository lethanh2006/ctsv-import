import { EOperatorType } from '@/components/Table/constant';
import type { NganhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/Nganh/typings';
import { Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNganhCoSo = (props: {
	value?: string;
	onChange?: (val: string | string[] | null, option?: any) => void;
	multiple?: boolean;
	allowClear?: boolean;
	hasDefault?: boolean;
	maKhoaSinhVien?: string;
	style?: React.CSSProperties;
	selectMa?: boolean;
	condition?: Partial<NganhDaoTao.IRecordCoSo>;
	disabled?: boolean;
	loadData?: boolean;
	isSetRecord?: boolean;
	placeholder?: string;
	except?: string[];
}) => {
	const intl = useIntl();
	const {
		value,
		onChange,
		multiple,
		allowClear,
		hasDefault,
		maKhoaSinhVien,
		style,
		selectMa,
		condition,
		disabled,
		loadData,
		isSetRecord,
		placeholder,
		except,
	} = props;
	const { danhSach, getAllModel, loading } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { getAllModel: getKhoaNganh } = useModel('daotaov2.namhoc.khoanganh');

	const getData = async () => {
		let allowList: string[] = [];
		if (maKhoaSinhVien) {
			const res = await getKhoaNganh(isSetRecord, undefined, { maKhoaSinhVien });
			allowList = res.map((item) => item.maNganh);
		}

		getAllModel(
			isSetRecord,
			undefined,
			{ ...condition, maNganhGoc: null },
			allowList.length
				? [
						{
							active: true,
							field: 'ma',
							values: allowList,
							operator: EOperatorType.INCLUDE,
						},
					]
				: undefined,
		).then((data) => {
			// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
			// Thì chọn phần tử đầu tiên
			if (hasDefault && !!onChange) onChange(selectMa ? data?.[0]?.ma : data?.[0]?._id);
		});
	};

	useEffect(() => {
		if (loadData !== false) getData();
	}, [maKhoaSinhVien, JSON.stringify(condition)]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			notFoundContent={loading ? <Spin spinning={true} style={{ width: '100%', margin: 10 }} /> : undefined}
			options={danhSach
				.filter((item) => !except || !except.includes(item.ma))
				.map((item) => ({
					key: item.ma ?? item._id,
					value: selectMa ? item.ma : item._id,
					label: `${item.dmNganh?.ten ?? item.ten ?? ''} (${item.ma ?? ''})`,
				}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? intl.formatMessage({ id: 'activity.info.form.majorCode.place' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectNganhCoSo;
