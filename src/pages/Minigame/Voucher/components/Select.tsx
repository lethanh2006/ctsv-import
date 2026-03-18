import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormChucVu from './Form';
import { ETrangThaiVoucher } from '@/services/Minigame/Voucher/constant';

/**
 * Secect Chức vụ để cho vào FormItem
 */
const SelectVoucher = (props: {
	value?: string | null;
	onChange?: (val: string | null) => void;
	multiple?: boolean;
	hasCreate?: boolean;
}) => {
	const { value, onChange, multiple, hasCreate } = props;
	const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } = useModel('minigame.voucher');

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
					className='fullWidth'
					mode={multiple ? 'multiple' : undefined}
					value={value}
					onChange={onChange}
					options={danhSach.filter(item => item.trangThai === ETrangThaiVoucher.DA_KICH_HOAT).map((item) => ({
						key: item._id,
						value: item._id,
						label: `${item.ten}`,
					}))}
					showSearch
					optionFilterProp='label'
					placeholder='Chọn phiếu quà tặng'
				/>
			</div>

			{hasCreate !== false ? (
				<>
					<Button icon={<PlusOutlined />} onClick={onAddNew} />
					<Modal open={visibleForm} styles={{ padding: 0 }} footer={null} onCancel={() => setVisibleForm(false)}>
						<FormChucVu title='Voucher' />
					</Modal>
				</>
			) : null}
		</div>
	);
};

export default SelectVoucher;
