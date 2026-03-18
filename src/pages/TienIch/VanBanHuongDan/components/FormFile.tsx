import UploadOne from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { renderFileListUrlWithName } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormFile = () => {
  const {
    formSubmiting,
    record,
    setVisibleFormFile,
    editFile,
    putModel,
    recordFile,
    setFormSubmiting,
  } = useModel('tienich.vanbanhuongdan');
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setFormSubmiting(true);
    try {
      const taiLieu = await buildUpLoadFile(values, 'taiLieu');
      values.url = taiLieu;
      delete values.taiLieu;

      if (editFile) {
        const index = recordFile?.index ?? 0;
        if (record) record.danhSachTep[index] = values;
      } else {
        if (record) record.danhSachTep.push(values);
      }
      if (record) putModel(record?._id ?? '', record, undefined, undefined, false);
      setVisibleFormFile(false);
    } catch (er) {
      console.log(er);
    } finally {
      setFormSubmiting(false);
    }
  };

  return (
    <Card title={editFile ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="ten"
          label="Tên văn bản"
          rules={[...rules.required, ...rules.text, ...rules.length(200)]}
          initialValue={recordFile?.ten}
        >
          <Input placeholder="Tên văn bản" />
        </Form.Item>
        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[...rules.text, ...rules.length(200)]}
          initialValue={recordFile?.moTa}
        >
          <Input.TextArea rows={3} placeholder="Mô tả" />
        </Form.Item>
        <Form.Item
          name="taiLieu"
          rules={[...rules.fileRequired]}
          initialValue={renderFileListUrlWithName(recordFile?.url ?? '', recordFile?.ten)}
          label="Tài liệu"
        >
          <UploadOne maxCount={1} accept="image/*, .xls, .xlsx, .doc, .docx, .pdf" />
        </Form.Item>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!editFile ? 'Thêm mới ' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleFormFile(false)}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormFile;
