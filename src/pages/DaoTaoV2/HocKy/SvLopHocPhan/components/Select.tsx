import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormSinhVien from './Form';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectSinhVienLopHP = (props: {
  value?: string;
  onChange?: any;
  onSearch?: any;
  hasCreate?: boolean;
  multiple?: boolean;
  lopHocPhanId: any;
}) => {
  const { value, onChange, onSearch, hasCreate, multiple, lopHocPhanId } = props;
  const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } = useModel(
    'hocky.sinhvienlophocphan',
  );

  useEffect(() => {
    if (!visibleForm) getAllModel(false, undefined, { lopHocPhanId });
  }, [visibleForm, lopHocPhanId]);

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
          options={danhSach.map((item) => ({
            key: item.sinhVienSsoId,
            value: item.sinhVienSsoId,
            label: `${item.sinhVien?.ten} - ${item.sinhVien?.ma}`,
          }))}
          showSearch
          optionFilterProp="label"
          placeholder="Chọn sinh viên"
        />
      </div>

      {hasCreate !== false ? <Button icon={<PlusOutlined />} onClick={onAddNew} /> : null}

      <Modal
        open={visibleForm}
        styles={{ padding: 0 }}
        footer={null}
        onCancel={() => setVisibleForm(false)}
      >
        <FormSinhVien title="Sinh viên" />
      </Modal>
    </div>
  );
};

export default SelectSinhVienLopHP;
