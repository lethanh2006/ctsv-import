import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
// import FilterPhamVi from '@/pages/TinTuc/ChuDe/components/Filter';
import { type DotKhaoSat } from '@/services/TienIch/DotKhaoSat/typing';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  MenuOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Popover, Switch, Tooltip } from 'antd';
import fileDownload from 'js-file-download';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useModel } from 'umi';
import FormViewDetail from '../components/FormViewDetail';
import ThongKe from './ThongKe';
import Form from './Form';
import { exportKetQuaKhaoSat } from '@/services/TienIch/DotKhaoSat';
import SelectMauKhaoSat from '../components/Select';

const DotKhaoSatPage = () => {
  const {
    page,
    limit,
    kichHoatBieuMauModel,
    edit,
    getBieuMauThongKeModel,
    deleteModel,
    handleEdit,
  } = useModel('tienich.dotkhaosat');
  const {
    getByIdModel: getBieuMau,
    visibleForm: visibleBieuMau,
    setVisibleForm: setVisibleBieuMau,
  } = useModel('tienich.bieumau');
  const [form, setForm] = useState<string>('edit');
  // const canUpdate = useCheckAccess('khao-sat:update');
  // const canDelete = useCheckAccess('khao-sat:delete');
  // const canCreate = useCheckAccess('khao-sat:create');
  // const canViewStats = useCheckAccess('khao-sat:view-stats');
  // const canExportStats = useCheckAccess('khao-sat:export-stats');

  const handleChangeStatus = (record: DotKhaoSat.IRecord) => {
    kichHoatBieuMauModel({ id: record._id, data: { kichHoat: !record.kichHoat } });
  };

  const onStatistic = (record: DotKhaoSat.IRecord) =>
    getBieuMauThongKeModel(record._id).then(() => {
      setForm('statistic');
      handleEdit(record);
    });

  const onCell = (record: DotKhaoSat.IRecord) => ({
    onClick: () => onStatistic(record),
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<DotKhaoSat.IRecord>[] = [
    {
      title: 'Tên đợt',
      dataIndex: 'ten',
      width: 200,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Biểu mẫu khảo sát',
      dataIndex: 'idKhaoSat',
      width: 200,
      filterType: 'customselect',
      filterCustomSelect: <SelectMauKhaoSat multiple />,
      render: (val, rec) => rec.khaoSat?.tieuDe ?? '--',
      onCell,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: 250,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      align: 'center',
      render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : ''),
      sortable: true,
      filterType: 'datetime',
      width: 120,
      onCell,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThuc',
      align: 'center',
      render: (val) => (val ? dayjs(val).format('HH:mm DD/MM/YYYY') : ''),
      sortable: true,
      filterType: 'datetime',
      width: 120,
      onCell,
    },
    {
      title: 'Đối tượng',
      dataIndex: 'loaiDoiTuongSuDung',
      render: (val) => (val?.length === 0 ? 'Tất cả' : val),
      width: 120,
      onCell,
    },
    // {
    //   title: 'Hình thức đào tạo',
    //   dataIndex: 'hinhThucDaoTaoId',
    //   width: 150,
    //   // hide: !access.admin,
    //   render: (val, record) => (
    //     <div>
    //       {record?.phamVi === 'Tất cả'
    //         ? 'Tất cả'
    //         : danhSachHinhThucDaoTao?.find((item) => item.id === val)?.display_name}
    //     </div>
    //   ),
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'kichHoat',
      width: 60,
      fixed: 'right',
      align: 'center',
      render: (val, record) => (
        <Switch
          checked={record.kichHoat}
          onChange={() => handleChangeStatus(record)}
          size="small"
        />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 60,
      fixed: 'right',
      render: (record: DotKhaoSat.IRecord) => (
        <Popover
          placement="left"
          content={
            <>
              <Tooltip title="Xuất kết quả">
                <Button
                  shape="circle"
                  onClick={() => {
                    exportKetQuaKhaoSat({ idKhaoSat: record._id }).then((res) =>
                      fileDownload(res.data, 'Kết quả khảo sát.xlsx'),
                    );
                  }}
                  type={'link'}
                  icon={<ExportOutlined />}
                />
              </Tooltip>
              <Divider type="vertical" />

              <Tooltip title="Thống kê">
                <Button
                  type={'link'}
                  onClick={() => onStatistic(record)}
                  shape="circle"
                  icon={<PieChartOutlined />}
                />
              </Tooltip>
              <Divider type="vertical" />

              <Tooltip title="Xem trước">
                <Button
                  type={'link'}
                  onClick={() => getBieuMau(record.idKhaoSat).then(() => setVisibleBieuMau(true))}
                  shape="circle"
                  icon={<EyeOutlined />}
                />
              </Tooltip>
              <Divider type="vertical" />

              <Tooltip title="Chỉnh sửa">
                <Button
                  onClick={() => {
                    setForm('edit');
                    handleEdit(record);
                  }}
                  type={'link'}
                  shape="circle"
                  icon={<EditOutlined />}
                  disabled={record.kichHoat}
                />
              </Tooltip>
              <Divider type="vertical" />

              <Tooltip title="Xóa">
                <Popconfirm
                  // disabled={!canDelete}
                  onConfirm={() => deleteModel(record._id)}
                  title="Bạn có chắc chắn muốn xóa khảo sát này?"
                  placement="topLeft"
                  disabled={record.kichHoat}
                >
                  <Button
                    type={'link'}
                    shape="circle"
                    danger
                    icon={<DeleteOutlined />}
                    disabled={record.kichHoat}
                  />
                </Popconfirm>
              </Tooltip>
            </>
          }
        >
          <Button type="link" icon={<MenuOutlined />} />
        </Popover>
      ),
    },
  ];

  let formTable = Form;
  if (form === 'statistic' && edit) formTable = ThongKe;

  return (
    <>
      <TableBase
        columns={columns}
        dependencies={[page, limit]}
        modelName="tienich.dotkhaosat"
        title="Đợt khảo sát"
        widthDrawer={800}
        Form={formTable}
      >
        {/* <FilterPhamVi modelName="tienich.dotkhaosat" /> */}
      </TableBase>

      <Modal
        open={visibleBieuMau}
        onCancel={() => setVisibleBieuMau(false)}
        styles={{ padding: 0 }}
        footer={null}
        width={800}
      >
        <FormViewDetail />
      </Modal>
    </>
  );
};

export default DotKhaoSatPage;
