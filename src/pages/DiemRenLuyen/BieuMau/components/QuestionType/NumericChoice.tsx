import rules from '@/utils/rules';
import { Col, Form, Row, Select } from 'antd';
import { useWatch, type FormInstance } from 'antd/es/form/Form';
import { range } from 'lodash';
import { useMemo } from 'react';
import { useIntl } from 'umi';

const NumericRange = (props: { form: FormInstance<any>; blockIndex: number; index: number }) => {
	const intl = useIntl();
	const gioiHanDuoiTuyenTinh = useWatch(
		['danhSachKhoi', props.blockIndex, 'danhSachCauHoi', props.index, 'gioiHanDuoiTuyenTinh'],
		props.form,
	);
	const gioiHanTrenTuyenTinh = useWatch(
		['danhSachKhoi', props.blockIndex, 'danhSachCauHoi', props.index, 'gioiHanTrenTuyenTinh'],
		props.form,
	);

	const opionsGioiHanTrenTuyenTinh = useMemo(() => {
		if (!gioiHanDuoiTuyenTinh) {
			return range(-21, 21);
		}
		if (gioiHanDuoiTuyenTinh === 1) {
			return range(-21, 21);
		}
		return range(-21, 21);
	}, [gioiHanDuoiTuyenTinh]);

	return (
		<Row gutter={[12, 0]}>
			<Col span={12}>
				<Form.Item
					initialValue={0}
					name={[props.index, 'gioiHanDuoiTuyenTinh']}
					rules={[...rules.required]}
					label={intl.formatMessage({ id: 'bieumau.tu' })}
				>
					<Select
						onChange={(value) => {
							if (value >= gioiHanTrenTuyenTinh) {
								props.form.setFields([
									{
										name: ['danhSachKhoi', props.blockIndex, 'danhSachCauHoi', props.index, 'gioiHanTrenTuyenTinh'],
										value: value + 1,
										touched: true,
									},
								]);
							}
						}}
					>
						{/*{[0, 1].map((item) => (*/}
						{/*	<Select.Option key={item} value={item}>*/}
						{/*		{item}*/}
						{/*	</Select.Option>*/}
						{/*))}*/}
						{range(-21, 21).map((item) => (
							<Select.Option key={item} value={item}>
								{item}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item
					label={intl.formatMessage({ id: 'bieumau.den' })}
					rules={[...rules.required]}
					name={[props.index, 'gioiHanTrenTuyenTinh']}
				>
					<Select>
						{opionsGioiHanTrenTuyenTinh.map((item) => (
							<Select.Option key={item} value={item}>
								{item}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Col>
		</Row>
	);
};

export default NumericRange;
