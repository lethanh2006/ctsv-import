import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormSinhVien from './Form';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectSinhVienLopHC = (props: {
	value?: string;
	onChange?: (val: string) => void;
	onSearch?: any;
	hasCreate?: boolean;
	multiple?: boolean;
	lopHanhChinhId: string;
	keyName?: string;
}) => {
	const intl = useIntl();
	const { value, onChange, onSearch, hasCreate, multiple, lopHanhChinhId, keyName } = props;
	const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } = useModel(
		'daotaov2.namhoc.sinhvienlophanhchinh',
	);

	useEffect(() => {
		if (!lopHanhChinhId) return;
		if (!visibleForm) getAllModel(false, undefined, { lopHanhChinhId });
	}, [visibleForm, lopHanhChinhId]);

	const onAddNew = () => {
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
					onSearch={onSearch}
					options={danhSach.map((item: any) => ({
						key: item.sinhVienSsoId,
						value: keyName ? item?.[keyName] : item.sinhVienSsoId,
						label: `${item.sinhVien?.ten} - ${item.sinhVien?.ma}`,
					}))}
					showSearch
					optionFilterProp='label'
					placeholder={intl.formatMessage({ id: 'lophanhchinh.step.bcsl.form.sv.place' })}
				/>
			</div>

			{hasCreate !== false ? <Button icon={<PlusOutlined />} onClick={onAddNew} /> : null}

			<Modal open={visibleForm} styles={{ body: { padding: 0 } }} footer={null} onCancel={() => setVisibleForm(false)}>
				<FormSinhVien title='Sinh viên' />
			</Modal>
		</div>
	);
};

export default SelectSinhVienLopHC;
