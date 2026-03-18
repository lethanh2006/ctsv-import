import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { type BaseOptionType } from 'antd/lib/select';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormHinhThucKhenThuong from './Form';

const SelectHinhThucKhenThuong = (props: {
	value?: string;
	onChange?: (value?: string, option?: BaseOptionType) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	listHinhThucKhenThuong?: string[];
	disable?: boolean;
	allowClear?: boolean;
	loaiKhenThuongId?: any;
}) => {
	const intl = useIntl();
	const { value, onChange, hasCreate, multiple, listHinhThucKhenThuong, disable, allowClear, loaiKhenThuongId } = props;
	const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } =
		useModel('danhmuc.hinhthuckhenthuong');

	useEffect(() => {
		getAllModel(undefined, undefined, { loaiKhenThuongId });
	}, [loaiKhenThuongId]);

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
					mode={multiple ? 'multiple' : undefined}
					value={value}
					onChange={onChange}
					options={danhSach
						.filter((item) => !listHinhThucKhenThuong || listHinhThucKhenThuong?.includes(item._id))
						.map((item) => ({
							key: item._id,
							value: item._id,
							label: item.ten,
							rawData: item,
						}))}
					showSearch
					disabled={disable}
					optionFilterProp='label'
					placeholder={intl.formatMessage({ id: 'kyluatkhenthuong.selecthinhthuckhenthuong.placeholder' })}
				/>
			</div>

			{hasCreate !== false ? (
				<>
					<Button icon={<PlusOutlined />} onClick={onAddNew} />
					<Modal open={visibleForm} styles={{ padding: 0 }} footer={null} onCancel={() => setVisibleForm(false)}>
						<FormHinhThucKhenThuong
							title={intl.formatMessage({ id: 'kyluatkhenthuong.selecthinhthuckhenthuong.title' })}
						/>
					</Modal>
				</>
			) : null}
		</div>
	);
};

export default SelectHinhThucKhenThuong;
