import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type TinTuc } from '@/services/TienIch/TinTuc/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
// import FilterPhamVi from './components/Filter';
import Form from './components/Form';

const ChuDeChung = () => {
  const { page, limit, handleEdit, deleteModel, getModel, putModel } = useModel('tintuc.chude');

  const onSortEnd = (record: TinTuc.IChuDe, order: number) => {
    putModel(record._id, { ...record, order });
  };

  const columns: IColumn<TinTuc.IChuDe>[] = [
    {
      title: 'Tên chủ đề',
      dataIndex: 'name',
      width: 200,
      filterType: 'string',
      sortable: true,
    },
    // {
    //   title: 'Hình thức đào tạo',
    //   dataIndex: 'hinhThucDaoTaoId',
    //   width: 120,
    //   filterType: 'customselect',
    //   filterCustomSelect: <SelectHinhThuc multiple />,
    //   render: (val, record) =>
    //     record?.phamVi === 'Tất cả'
    //       ? record?.phamVi
    //       : record.hinhThucDaoTao?.danhMucHTDT?.ten ?? '--',
    // },
    {
      title: 'Thứ tự hiển thị',
      dataIndex: 'order',
      width: 70,
      sortable: true,
    },
    {
      title: 'Thao tác',
      width: 90,
      fixed: 'right',
      align: 'center',
      render: (record: TinTuc.IChuDe) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa chủ đề này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="tintuc.chude"
      title="Chủ đề"
      Form={Form}
      rowSortable
      onSortEnd={onSortEnd}
    >
      {/* <FilterPhamVi modelName="tintuc.chude" /> */}
    </TableBase>
  );
};

export default ChuDeChung;
