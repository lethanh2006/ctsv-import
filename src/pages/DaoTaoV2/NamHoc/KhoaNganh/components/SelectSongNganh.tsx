import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SelectSongNganh = (props: {
	ssoId: string;
	style?: React.CSSProperties;
	disabled?: boolean;
	value?: string;
	onChange?: (val: string) => void;
	hideSelect?: boolean;
}) => {
	const intl = useIntl();
	const { ssoId, style, disabled, value, onChange, hideSelect } = props;
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
			disabled={disabled}
			placeholder={intl.formatMessage({ id: 'sinhvienhocvu.selectsongnganh.placeholder' })}
			value={value}
			style={{ width: '100%', ...style }}
			options={
				khoaNganhSv?.khoaNganhPhu
					? [
							{
								value: khoaNganhSv?.khoaNganhChinh?.ma,
								label: `${khoaNganhSv?.khoaNganhChinh?.nganh?.ten}`,
							},
							{
								value: khoaNganhSv?.khoaNganhPhu?.ma,
								label: `${khoaNganhSv?.khoaNganhPhu?.nganh?.ten}`,
							},
						]
					: [
							{
								value: khoaNganhSv?.khoaNganhChinh?.ma,
								label: `${khoaNganhSv?.khoaNganhChinh?.nganh?.ten}`,
							},
						]
			}
			onChange={(val) => onChange?.(val)}
		/>
	);
};

export default SelectSongNganh;
