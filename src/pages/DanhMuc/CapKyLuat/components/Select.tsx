import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { type CSSProperties, useEffect } from 'react';
import { useModel } from 'umi';
import FormCapKyLuat from './Form';
import { type BaseOptionType } from 'antd/lib/select';

const SelectCapKyLuat = (props: {
	value?: string;
	onChange?: (value: string, option: BaseOptionType) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	style?: CSSProperties;
}) => {
	const { value, onChange, hasCreate, multiple, disabled, allowClear, style } = props;
	const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } = useModel('danhmuc.capkyluat');

	useEffect(() => {
		if (!visibleForm) getAllModel();
	}, [visibleForm]);

	const onAddNew = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	return (
		<div style={{ display: 'flex', gap: 8 }}>
			<div className={hasCreate !== false ? 'width-select-custom' : 'fullWidth'}>
				<Select
					style={style}
					allowClear={allowClear}
					disabled={disabled}
					mode={multiple ? 'multiple' : undefined}
					value={value}
					onChange={onChange}
					options={danhSach.map((item) => ({
						key: item._id,
						value: item._id,
						label: item.ten,
						rawData: item,
					}))}
					showSearch
					optionFilterProp='label'
					placeholder='Chọn cấp kỷ luật'
				/>
			</div>

			{hasCreate !== false ? (
				<>
					<Button icon={<PlusOutlined />} onClick={onAddNew} />
					<Modal open={visibleForm} styles={{ padding: 0 }} footer={null} onCancel={() => setVisibleForm(false)}>
						<FormCapKyLuat title='Cấp kỷ luật' />
					</Modal>
				</>
			) : null}
		</div>
	);
};

export default SelectCapKyLuat;
