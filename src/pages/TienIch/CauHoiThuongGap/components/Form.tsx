import TinyEditor from '@/components/TinyEditor';
import { type CauHoiThuongGap } from '@/services/TienIch/CauHoiThuongGap/typing';
import { ELoaiPhanHoi } from '@/services/TienIch/PhanHoi/constant';
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCauHoiThuongGap = (props: any) => {
  const { formSubmiting, record, setVisibleForm, postModel, putModel, getModel, edit } =
    useModel('tienich.cauhoithuonggap');
  const [form] = Form.useForm();
  const { title } = props;

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: CauHoiThuongGap.IRecord) => {
    const payload = { ...values, loaiCauHoi: ELoaiPhanHoi.DVMC };
    if (edit) {
      putModel(record?._id ?? '', payload, getModel)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(payload, getModel)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="cauHoi"
          label="Câu hỏi"
          initialValue={record?.cauHoi}
          rules={[...rules.required, ...rules.text, ...rules.length(250)]}
        >
          <Input placeholder="Nhập câu hỏi" />
        </Form.Item>

        <Form.Item
          name="cauTraLoi"
          label="Câu trả lời"
          initialValue={record?.cauTraLoi}
          rules={[...rules.required, ...rules.text, ...rules.length(2000), ...rules.requiredHtml]}
        >
          <TinyEditor miniToolbar hideMenubar />
        </Form.Item>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới ' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormCauHoiThuongGap;
