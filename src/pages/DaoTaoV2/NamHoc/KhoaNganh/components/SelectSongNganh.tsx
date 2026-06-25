import { Select } from 'antd';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SelectSongNganh = (props: {
	ssoId: string;
	style?: React.CSSProperties;
	disabled?: boolean;
	value?: string;
	onChange?: (val: string) => void;
	hideSelect?: boolean;
	size?: SizeType;
}) => {
	const intl = useIntl();
	const { ssoId, style, disabled, value, onChange, hideSelect, size } = props;
	const { getKhoaNganhSvModel, khoaNganhSv, loading } = useModel('daotaov2.sinhvien.sinhvien');

	useEffect(() => {
		if (ssoId)
			getKhoaNganhSvModel(ssoId).then((response) => {
				if (onChange) onChange(response?.khoaNganhChinh?.ma);
			});
	}, [ssoId]);

	if (hideSelect && !khoaNganhSv?.khoaNganhPhu?.ma) return null;
	return (
		<Select
			loading={loading}
			size={size}
			disabled={disabled}
			placeholder={intl.formatMessage({ id: 'sinhvienhocvu.selectsongnganh.placeholder' })}
			value={value}
			style={{ width: '100%', ...style }}
			options={
				khoaNganhSv?.khoaNganhPhu
					? [
							{
								value: khoaNganhSv?.khoaNganhChinh?.ma,
								label: `${khoaNganhSv?.khoaNganhChinh?.ten}`,
							},
							{
								value: khoaNganhSv?.khoaNganhPhu?.ma,
								label: `${khoaNganhSv?.khoaNganhPhu?.ten}`,
							},
						]
					: [
							{
								value: khoaNganhSv?.khoaNganhChinh?.ma,
								label: `${khoaNganhSv?.khoaNganhChinh?.ten}`,
							},
						]
			}
			onChange={(val) => onChange?.(val)}
		/>
	);
};

export default SelectSongNganh;
