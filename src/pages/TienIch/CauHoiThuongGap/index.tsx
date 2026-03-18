import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type CauHoiThuongGap } from '@/services/TienIch/CauHoiThuongGap/typing';
import { decodeHtmlEntities } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormCauHoiThuongGap from './components/Form';

const CauHoiThuongGapPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('tienich.cauhoithuonggap');

  const columns: IColumn<CauHoiThuongGap.IRecord>[] = [
    {
      title: 'Câu hỏi',
      dataIndex: 'cauHoi',
      width: 200,
      filterType: 'string',
    },
    {
      title: 'Trả lời',
      dataIndex: 'cauTraLoi',
      render: (val) => <ExpandText>{decodeHtmlEntities(val)}</ExpandText>,
      width: 350,
    },
    {
      title: 'Thao tác',
      width: 90,
      align: 'center',
      render: (rec: CauHoiThuongGap.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(rec)} icon={<EditOutlined />} type="link" />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn xóa câu hỏi này?"
              onConfirm={() => deleteModel(rec._id, getModel)}
              placement="topLeft"
            >
              <Button icon={<DeleteOutlined />} type="link" danger />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      widthDrawer={800}
      Form={FormCauHoiThuongGap}
      modelName="tienich.cauhoithuonggap"
      columns={columns}
      dependencies={[page, limit]}
      title="Câu hỏi thường gặp"
    />
  );
};

export default CauHoiThuongGapPage;
