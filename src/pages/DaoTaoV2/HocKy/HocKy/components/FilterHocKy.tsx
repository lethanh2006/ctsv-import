import SelectNamHoc from '@/pages/DaoTaoV2/NamHoc/NamHoc/components/Select';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Space, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectHocKy from './SelectHocKy';

const FilterHocKy = (props: {
	width?: number;
	isSetHocKy?: boolean;
	allowClear?: boolean;
	hideExpand?: boolean;
	children?: React.ReactNode;
}) => {
	const intl = useIntl();
	const { record: recHocKy, danhSach: danhSachHocKy, setRecord: setHocKy } = useModel('daotaov2.hocky.hocky');
	const [namHocId, setNamHocId] = useState<string>();
	const [visibleOption, setVisibleOption] = useState(false);
	const [allHocKy, setAllHocKy] = useState(false);
	const width = props.width ?? 250;

	return (
		<Space wrap>
			{visibleOption ? (
				<>
					<Tooltip title={intl.formatMessage({ id: 'lophanhchinh.step.cvht.filterHK.tooltip.an' })}>
						<Button icon={<MinusOutlined />} onClick={() => setVisibleOption(false)} type='dashed' />
					</Tooltip>
					<SelectNamHoc
						style={{ width: 200 }}
						allowClear
						value={namHocId}
						onChange={(val) => setNamHocId(val)}
						hasDefault
					/>
					<Checkbox checked={allHocKy} onChange={(e) => setAllHocKy(e.target.checked)}>
						{intl.formatMessage({ id: 'lophanhchinh.step.cvht.filterHK.checkbox' })}
					</Checkbox>
				</>
			) : !props.hideExpand ? (
				<Tooltip title={intl.formatMessage({ id: 'lophanhchinh.step.cvht.filterHK.tooltip.morong' })}>
					<Button icon={<PlusOutlined />} onClick={() => setVisibleOption(true)} type='dashed' />
				</Tooltip>
			) : null}

			<SelectHocKy
				style={{ width }}
				allowClear={props.allowClear}
				condition={{ namHocId, active: allHocKy ? undefined : true }}
				value={recHocKy?._id}
				onChange={(val) => setHocKy(danhSachHocKy.find((item) => item._id === val))}
				isSetRecord={props.isSetHocKy && (!!namHocId || !recHocKy?._id)}
			/>

			{props.children}
		</Space>
	);
};

export default FilterHocKy;
