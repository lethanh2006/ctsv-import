import SelectNhanSuDonVi from '@/pages/ToChucNhanSu/NhanSu/SelectNhanSuDonVi';
import rules from '@/utils/rules';
import { Button, Card, Form } from 'antd';
import { useModel } from 'umi';

const FormDieuPhoi = (props: { onCancel: any }) => {
  const [form] = Form.useForm();
  const { loading, recordDonThaoTac, adminDieuPhoiDonModel, idDonViSelect } =
    useModel('dvmc.dichvumotcuav2');
  const { danhSach: danhSachChuyenVien } = useModel('tochucnhansu.nhansudonvi');

  return (
    <Card title="Điều phối đơn">
      <Form
        // labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (!recordDonThaoTac?._id) return;
          const chuyenVien = danhSachChuyenVien?.find(
            (item) => item?.thongTinNhanSu?.ssoId === values?.idChuyenVien,
          );
          adminDieuPhoiDonModel({
            idDonThaoTac: recordDonThaoTac._id,
            data: {
              nguoiDuocGiao: {
                _id: chuyenVien?.thongTinNhanSuId?.toString() || '',
                hoTen: `${chuyenVien?.thongTinNhanSu?.hoDem} ${chuyenVien?.thongTinNhanSu?.ten}`,
                gioiTinh: chuyenVien?.thongTinNhanSu?.gioiTinh || '',
                ngaySinh: chuyenVien?.thongTinNhanSu?.ngaySinh || '',
                maDinhDanh: chuyenVien?.thongTinNhanSu?.maCanBo || '',
                ssoId: chuyenVien?.thongTinNhanSu?.ssoId || '',
              },
            },
          });

          props?.onCancel();
        }}
        form={form}
      >
        <Form.Item rules={[...rules.required]} name="idChuyenVien" label="Chuyên viên xử lý">
          {/*<Select*/}
          {/*  allowClear*/}
          {/*  showSearch*/}
          {/*  placeholder="Chọn chuyên viên xử lý"*/}
          {/*  filterOption={(value, option) => includes(option?.props.children, value)}*/}
          {/*>*/}
          {/*  {danhSachChuyenVienXuLy?.map((item) => (*/}
          {/*    <Select.Option key={item.id} value={item.id}>*/}
          {/*      {item.name}*/}
          {/*    </Select.Option>*/}
          {/*  ))}*/}
          {/*</Select>*/}
          <SelectNhanSuDonVi idDonVi={idDonViSelect ?? ''} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button
            loading={loading}
            style={{
              marginRight: 8,
              backgroundColor: '#1890ff',
              border: '1px solid #1890ff',
              color: 'white',
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

export default FormDieuPhoi;
