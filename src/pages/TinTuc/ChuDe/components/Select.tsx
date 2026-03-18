import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select để cho vào FormItem
 */
const SelectChuDe = (props: {
  value?: string;
  onChange?: (id: string) => void;
  multiple?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}) => {
  const { value, onChange, multiple, allowClear, placeholder, style, disabled } = props;
  const { danhSach, getAllModel } = useModel('tintuc.chude');

  useEffect(() => {
    getAllModel();
  }, []);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      allowClear={allowClear}
      value={value}
      disabled={disabled}
      onChange={onChange}
      options={danhSach.map((item) => ({
        key: item._id,
        value: item._id,
        label: item.name,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder={placeholder ?? 'Chọn chủ đề'}
      style={{ width: '100%', ...style }}
    />
  );
};

export default SelectChuDe;
