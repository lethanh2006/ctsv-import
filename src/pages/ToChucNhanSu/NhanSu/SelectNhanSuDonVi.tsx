import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNhanSuDonVi = (props: {
  idDonVi: string;
  value?: string;
  onChange?: any;
  multiple?: boolean;
  loadData?: boolean;
  allowClear?: boolean;
}) => {
  const { value, onChange, multiple, loadData, allowClear, idDonVi } = props;
  const { danhSach, getAllModel } = useModel('tochucnhansu.nhansudonvi');

  useEffect(() => {
    if (idDonVi && loadData !== false) getAllModel(undefined, undefined, { donViId: idDonVi });
  }, [idDonVi]);

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      value={value}
      allowClear={allowClear}
      onChange={onChange}
      options={danhSach.map((item) => ({
        key: item.thongTinNhanSuId,
        value: item.thongTinNhanSu?.ssoId,
        label: `${item.thongTinNhanSu?.hoDem} ${item?.thongTinNhanSu?.ten} (${item?.thongTinNhanSu?.maCanBo})`,
      }))}
      showSearch
      optionFilterProp="label"
      placeholder="Chọn chuyên viên"
    />
  );
};

export default SelectNhanSuDonVi;
