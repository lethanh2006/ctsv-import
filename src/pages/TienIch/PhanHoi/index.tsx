import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip, Tag } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';

const PhanHoiPage = () => {
  const { setCondition, page, limit, handleEdit, setPage } = useModel('tienich.phanhoi');
  const [daTraLoi, setDaTraLoi] = useState<boolean | undefined>();
  // const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('namhoc.lophanhchinh');

  const columns: IColumn<PhanHoi.IRecord>[] = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSv',
      align: 'center',
      filterType: 'string',
      width: 120,
    },
    // {
    //   title: 'Người gửi',
    //   dataIndex: 'hoTenNguoiPhanHoi',
    //   align: 'center',
    //   search: 'search',
    //   width: 130,
    // },
    // {
    //   title: 'Người trả lời',
    //   dataIndex: 'hoTenNguoiTraLoi',
    //   align: 'center',
    //   width: 150,
    //   hide: !daTraLoi,
    // },
    {
      title: 'Câu hỏi',
      dataIndex: 'noiDungPhanHoi',
      filterType: 'string',
      width: 200,
      render: (val) => <ExpandText>{val}</ExpandText>,
    },
    {
      title: 'File đính kèm',
      dataIndex: 'urlPhanAnh',
      align: 'center',
      render: (val) =>
        val ? (
          <a href={val} target="_blank" rel="noreferrer">
            File đính kèm
          </a>
        ) : null,
      width: 100,
    },
    {
      title: 'Thời gian hỏi',
      dataIndex: 'createdAt',
      align: 'center',
      render: (val) => dayjs(val).format('HH:mm DD/MM/YYYY'),
      sortable: true,
      filterType: 'date',
      width: 120,
    },
    {
      title: 'Loại phản hồi',
      dataIndex: 'loaiPhanHoi',
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'daTraLoiPhanHoi',
      align: 'center',
      width: 100,
      render: (val) =>
        val ? <Tag color="green">Đã trả lời</Tag> : <Tag color="red">Chưa trả lời</Tag>,
      hide: daTraLoi !== undefined,
    },
    {
      title: 'Câu trả lời',
      dataIndex: 'noiDungTraLoiPhanHoi',
      filterType: 'string',
      hide: daTraLoi === false,
      width: 200,
      render: (val) => <ExpandText>{val}</ExpandText>,
    },
    {
      title: 'Người trả lời',
      dataIndex: 'maChuyenVien',
      hide: daTraLoi === false,
      filterType: 'string',
      width: 120,
    },
    {
      title: 'Thời gian trả lời',
      dataIndex: 'thoiGianTraLoi',
      align: 'center',
      hide: daTraLoi === false,
      render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
      sortable: true,
      filterType: 'date',
      width: 120,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 70,
      fixed: 'right',
      render: (val, rec) => (
        <Tooltip title={rec.daTraLoiPhanHoi ? 'Xem chi tiết' : 'Trả lời'}>
          <Button onClick={() => handleEdit(rec)} type="link">
            {rec.daTraLoiPhanHoi ? <EyeOutlined /> : <EditOutlined />}
          </Button>
        </Tooltip>
      ),
    },
  ];

  const onChangeTrangThai = (value?: string) => {
    const isAnswer = value === 'Đã trả lời';
    setCondition({ daTraLoiPhanHoi: value ? isAnswer : undefined });
    setPage(1);
    setDaTraLoi(value ? isAnswer : undefined);
  };

  return (
    <TableBase
      columns={columns}
      modelName="tienich.phanhoi"
      dependencies={[page, limit]}
      title="Phản hồi"
      Form={Form}
      buttons={{ create: false }}
      otherButtons={[
        <Select
          key="1"
          placeholder="Lọc theo trạng thái"
          onChange={onChangeTrangThai}
          style={{ width: 200 }}
          allowClear
        >
          {['Đã trả lời', 'Chưa trả lời']?.map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>,
      ]}
    >
      {/* {(access.admin || access.nhanVien) && (
        <Select
          value={condition?.hinhThucDaoTaoId ?? -1}
          onChange={(val: number) => {
            setCondition({ ...condition, hinhThucDaoTaoId: val });
          }}
          style={{ marginBottom: 8, width: 250, marginRight: 8 }}
        >
          <Select.Option value={-1} key={-1}>
            Tất cả hình thức đào tạo
          </Select.Option>
          {danhSachHinhThucDaoTao?.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.ten_hinh_thuc_dao_tao}
            </Select.Option>
          ))}
        </Select>
      )}
      {(access.adminVaQuanTri || access.nhanVien) && (
        <Select
          placeholder="Lọc theo vai trò người gửi"
          onChange={onChangeVaiTro}
          value={vaiTro}
          style={{ width: 220, marginBottom: 8, marginRight: 8 }}
        >
          {[
            { value: 'sinh_vien', name: 'Sinh viên' },
            { value: 'nhan_vien', name: 'Cán bộ, giảng viên' },
          ]?.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      )} */}
    </TableBase>
  );
};

export default PhanHoiPage;
