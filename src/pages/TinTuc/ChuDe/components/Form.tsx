import { EPhamViChuDe } from '@/services/TienIch/TinTuc/constant';
import { type TinTuc } from '@/services/TienIch/TinTuc/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormChuDe = (props: any) => {
  const [form] = Form.useForm();
  const {
    record,
    setVisibleForm,
    edit,
    visibleForm,
    putModel,
    postModel,
    formSubmiting,
    getModel,
  } = useModel('tintuc.chude');
  // const [phamVi, setPhamVi] = useState<EPhamViChuDe | undefined>(record?.phamVi);
  const typeNews = 'Tin tức';
  const { title } = props;

  useEffect(() => {
    if (!visibleForm) {
      resetFieldsForm(form);
      form.setFieldsValue({ phamVi: EPhamViChuDe.TAT_CA });
    } else if (record?._id) form.setFieldsValue(record);
    // setPhamVi(record?.phamVi ?? EPhamViChuDe.TAT_CA);
  }, [record?._id, visibleForm]);

  const onFinish = async (values: TinTuc.IChuDe) => {
    const payload = { ...values, type: typeNews };
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
        <Row gutter={[12, 0]}>
          <Col xs={24}>
            <Form.Item
              name="name"
              label="Tên chủ đề"
              rules={[...rules.required, ...rules.text, ...rules.length(30)]}
            >
              <Input placeholder="Tên chủ đề" />
            </Form.Item>
          </Col>
          {/* <Col xs={24}>
            <Form.Item rules={[...rules.required]} name="phamVi" label="Phạm vi">
              <Select
                onChange={(val: EPhamViChuDe) => setPhamVi(val)}
                placeholder="Phạm vi"
                options={Object.values(EPhamViChuDe).map((item) => ({
                  key: item,
                  value: item,
                  label: item,
                }))}
              />
            </Form.Item>
          </Col> */}

          {/* {phamVi === EPhamViChuDe.HINH_THUC_DAO_TAO ? (
            <Col span={24}>
              <Form.Item
                rules={[...rules.required]}
                name="hinhThucDaoTaoId"
                label="Hình thức đào tạo"
              >
                <SelectHinhThuc />
              </Form.Item>
            </Col>
          ) : null} */}

          <Col xs={24}>
            <Form.Item
              name="order"
              label="Thứ tự hiển thị"
              rules={[...rules.required, ...rules.number(1000, 0, false)]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={1000}
                placeholder="Thứ tự hiển thị"
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới ' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormChuDe;
