import { Avatar, Card } from 'antd';
import { useModel } from 'umi';

const ViewTinTuc = () => {
  const { record } = useModel('tintuc.tintuc');

  return (
    <Card>
      <Card.Meta
        avatar={<Avatar src={record?.urlAnhDaiDien} />}
        title={record?.tieuDe}
        description={record?.moTa}
      />
      <br />
      <div
        dangerouslySetInnerHTML={{ __html: record?.noiDung || '' }}
        style={{ width: '100%', overflowX: 'auto' }}
      />
    </Card>
  );
};

export default ViewTinTuc;
