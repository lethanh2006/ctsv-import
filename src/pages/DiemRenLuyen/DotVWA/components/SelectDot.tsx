import { Empty, Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SelectDotDiemRenLuyen = (props: {
	value?: string | string[];
	onChange?: (val: string | string[] | null) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	placeHolder?: string;
	allowClear?: boolean;
	isSetRecord?: boolean;
}): any => {
	const intl = useIntl();
	const { value, onChange, multiple, disabled, style, placeHolder, allowClear, isSetRecord } = props;
	const { danhSach, getAllModel, loading } = useModel('diemrenluyen.dotvwa');

	const { danhSach: danhSachHocKy, getAllModel: getAllHocKy } = useModel('daotaov2.hocky.hocky');

	useEffect(() => {
		if (!danhSachHocKy.length) getAllHocKy(false, { ma: -1 });
	}, []);

	useEffect(() => {
		getAllModel(isSetRecord, { maHocKy: -1 });
	}, []);

	return (
		<Select
			allowClear={allowClear}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			notFoundContent={
				loading ? (
					<Spin
						spinning={true}
						tip={intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.selectdot.timkiem' })}
						style={{ width: '100%', margin: 10 }}
					/>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.selectdot.khongco' })}
					/>
				)
			}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: danhSachHocKy.find((hocKy) => hocKy.ma === item.maHocKy)?.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeHolder || intl.formatMessage({ id: 'sinhvienhocvu.phieudiemrl.selectdot.loc' })}
			style={{ ...style }}
			showArrow
		/>
	);
};

export default SelectDotDiemRenLuyen;
