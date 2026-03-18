import { Divider, Row, Col } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

const DanhSachHoatDongTuan = () => {
  const { getAllModel: getAllHoatDong, danhSach: danhSachHoatDong } = useModel(
    'danhmuc.loaihoatdongtuan',
  );

  useEffect(() => {
    getAllHoatDong(false, undefined, { active: true });
  }, []);

  return (
    <>
      <Divider>Chú thích các loại hoạt động tuần</Divider>
      <div style={{ textAlign: 'right' }}>
        <i>
          Chỉnh sửa danh sách các loại hoạt đồng tuần{' '}
          <a onClick={() => history.push('/danh-muc-he-thong/co-so-dao-tao/loai-hoat-dong-tuan')}>
            tại đây
          </a>
        </i>
      </div>
      <Row className="loai-hoat-dong">
        {danhSachHoatDong.map((item) => (
          <Col key={item._id} span={24} md={8}>
            <span style={{ backgroundColor: item.maMau }}>{item.kyHieu}</span> → {item.ten}
          </Col>
        ))}
      </Row>
    </>
  );
};

export default DanhSachHoatDongTuan;
