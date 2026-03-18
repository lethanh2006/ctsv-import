import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ETrangThaiVoucher } from '@/services/Minigame/Voucher/constant';
import { MVoucher } from '@/services/Minigame/Voucher/typing';
import { currencyFormat } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Switch, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const VoucherPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit, putModel } = useModel('minigame.voucher');

  const onChangeStatus = async (record: MVoucher.ICauHinhVoucherDto, status: ETrangThaiVoucher) => {
    const reqUpdate = {
      ...record,
      trangThai: status
    }
    await putModel(reqUpdate._id, reqUpdate);
  }

  const columns: IColumn<MVoucher.ICauHinhVoucherDto>[] = [
    {
      title: 'Tên phiếu quà tặng',
      dataIndex: 'ten',
      width: 250,
      filterType: 'string',
    },
    {
      title: 'Số tiền giảm giá',
      dataIndex: 'giamGia',
      align: 'center',
      sortable: true,
      width: 120,
      render: (text) => (currencyFormat(text) || '0') + ' đ',
    },
    // {
    //   title: 'Ngày hết hạn',
    //   dataIndex: 'ngayHetHan',
    //   align: 'center',
    //   width: 120,
    //   render: (text) => (text ? new Date(text).toLocaleDateString() : <Tag color="green">Vô thời hạn</Tag>),
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      align: 'center',
      width: 120,
      render: (text, record) => <Switch checked={text === ETrangThaiVoucher.DA_KICH_HOAT} checkedChildren="Kích hoạt" unCheckedChildren="vô hiệu hóa" onChange={() => 
        Modal.confirm({
          title: `Bạn có chắc chắn muốn ${text === ETrangThaiVoucher.DA_KICH_HOAT ? 'vô hiệu hóa' : 'kích hoạt'} phiếu quà tặng này?`,
          onOk: async e => await onChangeStatus(record, text === ETrangThaiVoucher.DA_KICH_HOAT? ETrangThaiVoucher.CHUA_KICH_HOAT: ETrangThaiVoucher.DA_KICH_HOAT),
        })
      }/>,
      filterType: 'select',
      filterData: [
        { label: 'Đã kích hoạt', value: ETrangThaiVoucher.DA_KICH_HOAT },
        { label: 'Chưa kích hoạt', value: ETrangThaiVoucher.CHUA_KICH_HOAT },
      ]
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: MVoucher.ICauHinhVoucherDto) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa chức vụ này?"
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
      modelName="minigame.voucher"
      title="Phiếu quà tặng"
      buttons={{ import: true }}
      Form={Form}
    />
  );
};

export default VoucherPage;
