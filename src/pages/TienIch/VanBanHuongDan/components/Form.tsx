import { EDoiTuong } from '@/services/TienIch/VanBanHuongDan/constant';
import { type VanBanHuongDan } from '@/services/TienIch/VanBanHuongDan/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormBaiHoc = (props: { afterAddNew?: (rec: VanBanHuongDan.IRecord) => void }) => {
  const {
    record,
    setVisibleForm,
    edit,
    postModel,
    putModel,
    getModel,
    setRecord,
    setEdit,
    formSubmiting,
    visibleForm,
  } = useModel('tienich.vanbanhuongdan');
  const [form] = Form.useForm();
  const { afterAddNew } = props;
  // const { danhSachHinhThucDaoTao } = useModel('namhoc.lophanhchinh');
  // const [phamVi, setPhamVi] = useState<string>(record?.phamVi ?? '');
  // const [doiTuong, setDoiTuong] = useState<string>(record?.doiTuong ?? 'Tất cả');

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else form.setFieldsValue(record);
  }, [record?._id, visibleForm]);

  const onFinish = async (values: VanBanHuongDan.IRecord) => {
    const payload = { ...values, doiTuong: EDoiTuong.TAT_CA, vaiTro: ['Admin', 'User'] };
    if (edit) {
      putModel(record?._id ?? '', payload, getModel, undefined, false)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(payload, getModel, false)
        .then((rec) => {
          setRecord(rec);
          setEdit(true);
          if (afterAddNew) afterAddNew(rec);
        })
        .catch((er) => console.log(er));
  };

  return (
    <Form layout="vertical" onFinish={onFinish} form={form}>
      <Form.Item
        name="ten"
        label="Tên thư mục"
        rules={[...rules.required, ...rules.text, ...rules.length(200)]}
      >
        <Input placeholder="Tên thư mục" />
      </Form.Item>
      <Form.Item name="moTa" label="Mô tả" rules={[...rules.text, ...rules.length(2000)]}>
        <Input.TextArea rows={3} placeholder="Nhập mô tả" />
      </Form.Item>
      {/* <Form.Item
          rules={[...rules.required]}
          name="doiTuong"
          label="Đối tượng"
          initialValue={doiTuong}
        >
          <Select
            onChange={(val: string) => {
              setDoiTuong(val);
            }}
            placeholder="Chọn đối tượng"
          >
            {['Tất cả', 'Vai trò'].map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item> */}
      {/* {doiTuong === 'Vai trò' && (
          <Form.Item
            rules={[...rules.required]}
            name="vaiTro"
            label="Vai trò"
            initialValue={record?.vaiTro}
          >
            <Select mode="multiple" placeholder="Chọn vai trò">
              {[
                { value: 'nhan_vien', name: 'Cán bộ, giảng viên' },
                { value: 'sinh_vien', name: 'Sinh viên' },
              ].map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )} */}

      <div className="form-footer">
        <Button loading={formSubmiting} htmlType="submit" type="primary">
          {!edit ? 'Thêm mới ' : 'Lưu lại'}
        </Button>
        <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
      </div>
    </Form>
  );
};

export default FormBaiHoc;
