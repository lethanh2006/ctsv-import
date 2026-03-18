import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormVanBanQuyDinh from './Form';

const SelectVanBanQuyDinh = (props: {
	value?: string;
	onChange?: any;
	hasDefault?: boolean;
	hasCreate?: boolean;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
}) => {
	const { value, onChange, hasCreate, multiple, hasDefault, allowClear, style, selectMa } = props;
	const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } = useModel(
		'daotaov2.danhmuc.vanbanquydinh',
	);
	const [created, setCreated] = useState(false); // Sau khi thêm mới xong?

	useEffect(() => {
		if (!visibleForm)
			getAllModel()
				.then((data) => {
					// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
					// Thì chọn phần tử đầu tiên
					if (hasDefault && (created || data.length === 1)) onChange(selectMa ? data[0].ma : data[0]._id);
				})
				.finally(() => setCreated(false));
	}, [visibleForm]);

	const onAddNew = () => {
		setCreated(true);
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};

	return (
		<div style={{ display: 'flex', gap: 8 }}>
			<div className={hasCreate !== false ? 'width-select-custom' : 'fullWidth'}>
				<Select
					mode={multiple ? 'multiple' : undefined}
					value={value}
					onChange={onChange}
					allowClear={allowClear !== false}
					options={danhSach.map((item) => ({
						key: item._id,
						value: selectMa ? item.ma : item._id,
						label: `${item.ten} (${item.ma})`,
					}))}
					showSearch
					optionFilterProp='label'
					placeholder='Chọn căn cứ pháp lý'
					style={{ width: '100%', ...style }}
					showArrow
				/>
			</div>

			{hasCreate !== false ? (
				<>
					<Button icon={<PlusOutlined />} onClick={onAddNew} />
					<Modal open={visibleForm} styles={{ padding: 0 }} footer={null} onCancel={() => setVisibleForm(false)}>
						<FormVanBanQuyDinh title='Căn cứ pháp lý' />
					</Modal>
				</>
			) : null}
		</div>
	);
};

export default SelectVanBanQuyDinh;
