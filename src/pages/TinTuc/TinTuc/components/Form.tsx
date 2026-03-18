import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectChuDe from '../../ChuDe/components/Select';

const FormTinTuc = (props: any) => {
  const [form] = Form.useForm();
  const {
    record,
    setFormSubmiting,
    setVisibleForm,
    edit,
    putModel,
    postModel,
    formSubmiting,
    getModel,
    visibleForm,
  } = useModel('tintuc.tintuc');
  // const { danhSach: danhSachChuDe } = useModel('tintuc.chude');
  // const [chuDeSelected, setChuDeSelected] = useState<TinTuc.IChuDe>();
  const { title } = props;

  // const onChangeChuDe = (val?: string) =>
  //   setChuDeSelected(danhSachChuDe.find((item) => item._id === val));

  // useEffect(() => {
  //   onChangeChuDe(record?.idTopic);
  // }, [danhSachChuDe.length]);

  useEffect(() => {
    if (!visibleForm) {
      resetFieldsForm(form);
      form.setFieldsValue({ noiDung: '' });
    } else if (record?._id)
      form.setFieldsValue({
        ...record,
        // danhSachVaiTro:
        //   record?.doiTuong !== 'Tất cả' ? record?.danhSachVaiTro : ['sinh_vien', 'nhan_vien'],
      });
    // onChangeChuDe(record?.idTopic);
  }, [record?._id, visibleForm]);

  const onFinish = async (values: any) => {
    if (formSubmiting) return;
    setFormSubmiting(true);
    try {
      const urlAnhDaiDien = await buildUpLoadFile(values, 'urlAnhDaiDien');
      values.urlAnhDaiDien = urlAnhDaiDien;
      setFormSubmiting(false);

      const payload = {
        ...values,
        doiTuong: values.danhSachVaiTro?.length !== 1 ? 'Tất cả' : 'Vai trò',
        // phamVi: record?.phamVi ?? EPhamViChuDe.TAT_CA,
      };

      if (edit) {
        putModel(record?._id ?? '', payload, getModel)
          .then()
          .catch((er) => console.log(er));
      } else
        postModel(payload, getModel)
          .then()
          .catch((er) => console.log(er));
    } catch (er) {
      console.log(er);
    } finally {
      setFormSubmiting(false);
    }
  };

  return (
    <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="tieuDe"
          label="Tiêu đề"
          rules={[...rules.required, ...rules.text, ...rules.length(250)]}
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>
        <Form.Item name="idTopic" label="Chủ đề" rules={[...rules.required]}>
          <SelectChuDe />
        </Form.Item>
        <Form.Item name="moTa" label="Mô tả" rules={[...rules.text, ...rules.length(2000)]}>
          <Input placeholder="Mô tả" />
        </Form.Item>

        <Row gutter={[12, 0]}>
          <Col span={24} md={8}>
            <Form.Item name="urlAnhDaiDien" label="Ảnh đại diện">
              <UploadFile isAvatarSmall />
            </Form.Item>
          </Col>

          {/* {chuDeSelected?.phamVi === 'Tất cả' && (
            <Col xs={24} md={8}>
              <Form.Item name="danhSachVaiTro" label="Đối tượng">
                <GroupTagVaiTro />
              </Form.Item>
            </Col>
          )} */}

          <Col xs={24} md={8}>
            <Form.Item
              name="ngayDang"
              label="Ngày đăng"
              rules={[...rules.required, ...(!edit ? rules.sauHomNay : [])]}
            >
              <MyDatePicker
                format="HH:mm DD/MM/YYYY"
                disabledDate={(cur) => (!edit ? dayjs(cur).isBefore(dayjs()) : false)}
                placeholder="Chọn ngày đăng"
                allowClear={false}
                showTime={{ showHour: true, showMinute: true }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="noiDung"
          label="Nội dung"
          rules={[...rules.requiredHtml, ...rules.required]}
        >
          <TinyEditor height={700} />
        </Form.Item>

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

export default FormTinTuc;
