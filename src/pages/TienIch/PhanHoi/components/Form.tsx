import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Descriptions, Form, Input } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormPhanHoi = () => {
  const { formSubmiting, record, setVisibleForm, traLoiPhanHoiModel, visibleForm } =
    useModel('tienich.phanhoi');
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  useEffect(() => {
    if (!visibleForm) resetFieldsForm(form);
  }, [visibleForm]);

  const onFinish = async (values: PhanHoi.IRecord) => {
    traLoiPhanHoiModel({
      id: record?._id ?? '',
      data: {
        noiDungTraLoiPhanHoi: values.noiDungTraLoiPhanHoi,
        maChuyenVien: currentUser?.username ?? '',
        noiDungPhanHoi: record?.noiDungPhanHoi ?? '',
      },
    });
  };

  return (
    <Card title="Trả lời phản hồi">
      <Descriptions column={1}>
        <Descriptions.Item label="Người hỏi">{record?.maSv ?? '--'}</Descriptions.Item>
        <Descriptions.Item label="Câu hỏi">{record?.noiDungPhanHoi}</Descriptions.Item>
        <Descriptions.Item label="Thời gian hỏi">
          {dayjs(record?.createdAt).format('HH:mm DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Loại phản hồi">{record?.loaiPhanHoi}</Descriptions.Item>
        <Descriptions.Item label="File đính kèm">
          {record?.urlPhanAnh ? (
            <a href={record?.urlPhanAnh} target="_blank" rel="noreferrer">
              File đính kèm
            </a>
          ) : null}
        </Descriptions.Item>
      </Descriptions>

      <Form layout="vertical" onFinish={onFinish} form={form}>
        {record?.daTraLoiPhanHoi ? (
          <Descriptions column={1}>
            <Descriptions.Item label="Nội dung trả lời">
              {record?.noiDungTraLoiPhanHoi}
            </Descriptions.Item>
            <Descriptions.Item label="Người trả lời">
              {record?.maChuyenVien ?? '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian trả lời">
              {record?.thoiGianTraLoi
                ? dayjs(record.thoiGianTraLoi).format('HH:mm DD/MM/YYYY')
                : '--'}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Form.Item
            name="noiDungTraLoiPhanHoi"
            label="Nội dung trả lời"
            initialValue={record?.noiDungTraLoiPhanHoi}
            rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung" />
          </Form.Item>
        )}

        <div className="form-footer">
          {!record?.daTraLoiPhanHoi && (
            <Button loading={formSubmiting} htmlType="submit" type="primary">
              Gửi
            </Button>
          )}
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormPhanHoi;
