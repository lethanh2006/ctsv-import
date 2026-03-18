import { ETrangThaiVoucher } from '@/services/Minigame/Voucher/constant';
import { MVoucher } from '@/services/Minigame/Voucher/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Switch } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormVoucher = (props: any) => {
  const [form] = Form.useForm();
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
    useModel('minigame.voucher');
  const title = props?.title ?? '';

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
    else if (record?._id) form.setFieldsValue(record);
  }, [record?._id, visibleForm]);

  const onFinish = async (values: MVoucher.ICauHinhVoucherDto) => {
    values = {
        ...values,
        trangThai: values.trangThai ? ETrangThaiVoucher.DA_KICH_HOAT : ETrangThaiVoucher.CHUA_KICH_HOAT
    }
    if (edit) {
      putModel(record?._id ?? '', values)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(values)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
  };

  return (
    <Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Form.Item
          name="ten"
          label="Tên mã giảm giá"
          rules={[...rules.required, ...rules.text, ...rules.length(20)]}
        >
          <Input placeholder="Nhập tên mã giảm giá" />
        </Form.Item>

        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[...rules.text, ...rules.length(250)]}
        >
          <TextArea placeholder="Nhập mô tả" />
        </Form.Item>
        <Row gutter={[10, 10]}>
            <Col span={12}>
                <Form.Item
                    name="giamGia"
                    label="Số tiền giảm giá (VNĐ)"
                    rules={[...rules.required]}
                    >
                    <InputNumber className='fullWidth' placeholder='Nhập số tiền giảm giá'/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    name="trangThai"
                    label="Trạng thái"
                    valuePropName='checked'
                    >
                    <Switch checkedChildren="Kích hoạt" unCheckedChildren="vô hiệu hóa" defaultChecked={false}/>
                </Form.Item>
            </Col>
        </Row>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormVoucher;
