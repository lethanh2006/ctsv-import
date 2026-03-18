import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { currencyFormat } from '@/utils/utils';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectMucThu = (props: {
  value?: string;
  onChange?: (id: string) => void;
  multiple?: boolean;
  allowClear?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  isGetId?: boolean;
  condition?: any;
}) => {
  const { value, onChange, multiple, allowClear, placeholder, style, disabled,condition,isGetId } = props;
  const { danhSach, getAllModel, visibleForm } = useModel('dvmc.mucthu');

  useEffect(() => {
    if (!visibleForm) getAllModel(false,undefined,condition);
  }, [visibleForm,condition]);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      allowClear={allowClear}
      value={value}
      disabled={disabled}
      onChange={onChange}
      options={danhSach.map((item) => ({
        key: item._id,
        value: isGetId?item._id:`${currencyFormat(item.unitAmount)} ${item.currency}`,
        label: `${currencyFormat(item.unitAmount)} ${item.currency}`,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder={placeholder ?? 'Chọn mức giá'}
      style={{ width: '100%', ...style }}
    />
  );
};

export default SelectMucThu;
