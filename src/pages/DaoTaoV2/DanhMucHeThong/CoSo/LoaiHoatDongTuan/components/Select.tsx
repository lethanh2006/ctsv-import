import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormNganh from './Form';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLoaiHoatDongTuan = (props: {
  value?: string;
  onChange?: (id: string) => void;
  hasCreate?: boolean;
  multiple?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  loadData?: boolean;
}) => {
  const { value, onChange, hasCreate, multiple, allowClear, placeholder, loadData } = props;
  const { danhSach, getAllModel, setVisibleForm, visibleForm, setEdit, setRecord } = useModel(
    'danhmuc.loaihoatdongtuan',
  );

  useEffect(() => {
    if (!visibleForm && loadData !== false) getAllModel(false, undefined, { active: true });
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
          mode={multiple ? 'multiple' : undefined}
          allowClear={allowClear}
          value={value}
          onChange={onChange}
          options={danhSach.map((item) => ({
            key: item._id,
            value: item._id,
            label: [item?.kyHieu, item?.ten].join(' - '),
          }))}
          showSearch
          optionFilterProp="label"
          placeholder={placeholder ?? 'Chọn loại hoạt động tuần'}
        />
      </div>

      {hasCreate !== false ? (
        <>
          <Button icon={<PlusOutlined />} onClick={onAddNew} />
          <Modal
            open={visibleForm}
            styles={{ padding: 0 }}
            footer={null}
            onCancel={() => setVisibleForm(false)}
          >
            <FormNganh title="loại hoạt động tuần" />
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default SelectLoaiHoatDongTuan;
