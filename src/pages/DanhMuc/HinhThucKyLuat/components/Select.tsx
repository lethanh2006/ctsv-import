import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormHinhThucKhenThuong from './Form';
import { type BaseOptionType } from 'antd/lib/select';

const SelectHinhThucKyLuat = (props: {
	value?: string;
	onChange?: (value?: string, option?: BaseOptionType) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	disable?: boolean;
	allowClear?: boolean;
	capKyLuatId?: string;
	condition?: any;
}) => {
	const { value, onChange, hasCreate, multiple, disable, allowClear, capKyLuatId, condition } = props;
	const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } = useModel('danhmuc.hinhthuckyluat');

	useEffect(() => {
		getAllModel(undefined, undefined, { capKyLuatId });
	}, [capKyLuatId]);

	const onAddNew = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	useEffect(() => {
		getAllModel(undefined, undefined, condition);
	}, [condition]);

	return (
		<div style={{ display: 'flex', gap: 8 }}>
			<div className={hasCreate !== false ? 'width-select-custom' : 'fullWidth'}>
				<Select
					allowClear={allowClear}
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
					disabled={disable}
					optionFilterProp='label'
					placeholder='Chọn hình thức kỷ luật'
				/>
			</div>

			{hasCreate !== false ? (
				<>
					<Button icon={<PlusOutlined />} onClick={onAddNew} />
					<Modal open={visibleForm} styles={{ padding: 0 }} footer={null} onCancel={() => setVisibleForm(false)}>
						<FormHinhThucKhenThuong title='Hình thức kỷ luật' />
					</Modal>
				</>
			) : null}
		</div>
	);
};

export default SelectHinhThucKyLuat;
