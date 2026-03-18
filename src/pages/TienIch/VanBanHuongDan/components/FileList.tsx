import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type VanBanHuongDan } from '@/services/TienIch/VanBanHuongDan/typing';
import {
  DeleteOutlined,
  EditOutlined,
  PaperClipOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormFile from './FormFile';

const FileList = () => {
  const {
    record,
    putModel,
    setRecord,
    setRecordFile,
    setEditFile,
    setVisibleFormFile,
    visibleFormFile,
  } = useModel('tienich.vanbanhuongdan');

  const delFile = (id: string) => {
    const payload: any = {
      ...record,
      danhSachTep: record?.danhSachTep?.filter((item) => item._id !== id) ?? [],
    };

    putModel(record?._id ?? '', payload, undefined, undefined, false).then(() =>
      setRecord(payload),
    );
  };

  const handleEdit = (recordFile: VanBanHuongDan.IFile) => {
    setRecordFile(recordFile);
    setVisibleFormFile(true);
    setEditFile(true);
  };

  const handleAdd = () => {
    setRecordFile({} as VanBanHuongDan.IFile);
    setVisibleFormFile(true);
    setEditFile(false);
  };

  const columns: IColumn<VanBanHuongDan.IFile>[] = [
    {
      title: 'Tên văn bản',
      dataIndex: 'ten',
      width: 200,
      filterType: 'string',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: 250,
      render: (val) => <ExpandText>{val}</ExpandText>,
    },
    {
      title: 'Tệp đính kèm',
      dataIndex: 'url',
      width: 120,
      render: (val) =>
        val ? (
          <>
            <PaperClipOutlined />{' '}
            <a href={val} target="_blank" rel="noreferrer">
              Xem tập tin
            </a>
          </>
        ) : null,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (recordFile: VanBanHuongDan.IFile) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(recordFile)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => delFile(recordFile._id)}
              title="Bạn có chắc chắn muốn xóa văn bản này?"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <TableStaticData
        columns={columns}
        data={[...(record?.danhSachTep?.map((item, index) => ({ ...item, index })) ?? [])]}
        addStt
        Form={FormFile}
        showEdit={visibleFormFile}
        setShowEdit={setVisibleFormFile}
        hasTotal
        otherProps={{ pagination: false, scroll: { y: 500 } }}
      >
        <Button type="primary" onClick={handleAdd}>
          <PlusCircleOutlined />
          Thêm mới
        </Button>
      </TableStaticData>
    </>
  );
};

export default FileList;
