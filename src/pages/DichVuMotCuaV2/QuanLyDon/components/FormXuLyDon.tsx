import UploadFile from '@/components/Upload/UploadFile';
import { type DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import rules from '@/utils/rules';
import { checkFileSize, renderFileList, uploadMultiFile } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const titleByType = {
  ok: 'Duyệt',
  'not-ok': 'Không duyệt',
  'edit-result': 'Chỉnh sửa kết quả',
};

const FormXuLyDon = (props: {
  type: 'ok' | 'not-ok' | 'edit-result';
  onCancel: any;
  traKetQua?: boolean;
  recordEdit?: { duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] };
}) => {
  const [form] = Form.useForm();
  const {
    loading,
    recordDonThaoTac,
    recordDon,
    setLoading,
    chuyenVienDieuPhoiDuyetDonModel,
    chuyenVienXuLyDuyetDonModel,
    adminDuyetDonModel,
    traKetQuaModel,
    adminPutDonModel,
    adminDieuPhoiDonModel
  } = useModel('dvmc.dichvumotcuav2');
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  return (
    <Card title={titleByType?.[props?.type]}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (!recordDonThaoTac?._id) return;
          const checkSize =
            checkFileSize(values?.urlFileDinhKem?.fileList ?? []) &&
            checkFileSize(values?.ketQuaDinhKem?.fileList ?? []);
          if (!checkSize) return;
          setLoading(true);
          if (props?.recordEdit&&props?.recordEdit?.duLieuBieuMau?.length>0) await adminPutDonModel(recordDon?._id ?? '', props?.recordEdit);
          if (props.type !== 'edit-result') {
            const urlFileDinhKem = await uploadMultiFile(values?.urlFileDinhKem?.fileList);
            const payload = {
              type: props.type,
              idDonThaoTac: recordDonThaoTac?._id,
              data: {
                urlFileDinhKem,
                info: {
                  ghiChuXuLy: values?.ghiChuXuLy ?? '',
                },
              },
            };
            // if (arrPathName?.includes('quanlydondieuphoi')) {
            //   chuyenVienDieuPhoiDuyetDonModel(payload);
            // }else
            //   chuyenVienXuLyDuyetDonModel(payload);
            adminDuyetDonModel(payload);
          }
          if (
            props?.traKetQua === true ||
            props.type === 'not-ok' ||
            props.type === 'edit-result'
          ) {
            const ketQuaDinhKem = await uploadMultiFile(values?.ketQuaDinhKem?.fileList);
            traKetQuaModel(
              {
                ketQuaText: values?.ketQuaText ?? '',
                ketQuaDinhKem,
              },
              recordDon?._id,
            );
          }
          props?.onCancel();
        }}
        form={form}
      >
        {props?.type !== 'edit-result' && (
          <>
            <Form.Item
              // initialValue={recordDonThaoTac?.info?.ghiChuXuLy}
              name="ghiChuXuLy"
              rules={[...rules.text]}
              label="Ghi chú xử lý (nếu có)"
            >
              <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
            </Form.Item>
            <Form.Item
              name="urlFileDinhKem"
              extra={
                <>
                  <div>Định dạng file: pdf, doc, docx</div>
                  <div>Tối đa 5 file, dung lượng mỗi file không quá 25Mb</div>
                </>
              }
              rules={[...rules.fileLimit(5)]}
              // initialValue={renderFileList(recordDonThaoTac?.urlFileDinhKem ?? [])}
              label="Kết quả xử lý (nếu có)"
            >
              <UploadFile
                otherProps={{
                  accept: '.pdf, .doc,.docx',
                  multiple: true,
                  showUploadList: { showDownloadIcon: false },
                }}
              />
            </Form.Item>
          </>
        )}
        {(props?.traKetQua === true || props.type === 'not-ok') && (
          <>
            <b>Trả kết quả:</b>
            <Form.Item
              initialValue={recordDon?.ketQuaText || recordDon?.thongTinDichVu?.cauTraLoiMacDinh}
              name="ketQuaText"
              rules={[...rules.text]}
              label="Nội dung"
            >
              <Input.TextArea rows={2} placeholder="Nhập nội dung" />
            </Form.Item>
            <Form.Item
              name="ketQuaDinhKem"
              extra={
                <>
                  <div>Định dạng file: pdf, doc, docx</div>
                  <div>Tối đa 5 file, dung lượng mỗi file không quá 25Mb</div>
                </>
              }
              rules={[...rules.fileLimit(5)]}
              initialValue={renderFileList(recordDon?.ketQuaDinhKem ?? [])}
              label="Tệp đính kèm (nếu có)"
            >
              <UploadFile
                otherProps={{
                  accept: '.pdf, .doc,.docx',
                  multiple: true,
                  showUploadList: { showDownloadIcon: false },
                }}
              />
            </Form.Item>
          </>
        )}
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button
            loading={loading}
            style={{
              backgroundColor: props.type === 'ok' ? '#007F3E' : '#007EB9',
              border: `1px solid ${props.type === 'ok' ? '#007F3E' : '#007EB9'}`,
              color: 'white',
              marginRight: 8,
            }}
            htmlType="submit"
            type="primary"
          >
            Gửi
          </Button>
          <Button
            onClick={() => {
              props?.onCancel();
            }}
          >
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormXuLyDon;
