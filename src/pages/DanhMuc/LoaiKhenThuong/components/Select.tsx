import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { type BaseOptionType } from 'antd/lib/select';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormLoaiKhenThuong from './Form';

const SelectLoaiKhenThuong = (props: {
	value?: string;
	onChange?: (value?: string, option?: BaseOptionType) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	listLoaiKhenThuongId?: string[];
	disabled?: boolean;
	allowClear?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, hasCreate, multiple, listLoaiKhenThuongId, disabled, allowClear } = props;
	const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } = useModel('danhmuc.loaikhenthuong');

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
					allowClear={allowClear}
					disabled={disabled}
					mode={multiple ? 'multiple' : undefined}
					value={value}
					onChange={onChange}
					options={danhSach
						.filter((item) => !listLoaiKhenThuongId || listLoaiKhenThuongId?.includes(item._id))
						.map((item) => ({
							key: item._id,
							value: item._id,
							label: item.ten,
							rawData: item,
						}))}
					showSearch
					optionFilterProp='label'
					placeholder={intl.formatMessage({ id: 'chinhsach.selectkhenthuong.chon' })}
				/>
			</div>

			{hasCreate !== false ? (
				<>
					<Button icon={<PlusOutlined />} onClick={onAddNew} />
					<Modal open={visibleForm} styles={{ padding: 0 }} footer={null} onCancel={() => setVisibleForm(false)}>
						<FormLoaiKhenThuong title={intl.formatMessage({ id: 'chinhsach.selectkhenthuong.title' })} />
					</Modal>
				</>
			) : null}
		</div>
	);
};

export default SelectLoaiKhenThuong;
