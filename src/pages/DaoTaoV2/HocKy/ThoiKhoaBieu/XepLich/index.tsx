import { EOperatorType } from '@/components/Table/constant';
import FilterHocPhan from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/HocPhan/components/Filter';
import { ELoaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { Card, Col, Empty, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import GroupTagTuanHoc from '../LichHocTuan/GroupTagTuanHoc';
import TableLopHocPhanTKB from './TableLopHocPhan';
import TableXepLich from './TableXepLich';

const XepLichThoiKhoaBieuPage = (props: { tuanHienTai: number }) => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');
	const { record: recHocPhan, danhSach: danhSachHocPhan } = useModel('daotaov2.hocphan.hocphan');
	const { record: recDonVi } = useModel('daotaov2.tochucnhansu.donvi');
	const { getAllModel, danhSach, loading } = useModel('daotaov2.hocky.lophocphan');
	const [selectTuan, setSelectTuan] = useState<number>(1);

	const getLopHocPhan = async () =>
		getAllModel(
			undefined,
			undefined,
			{
				maHocKy: recHocKy?.ma,
				loai: ELoaiLopHocPhan.CHINH,
				maHocPhan: recHocPhan?.ma,
			},
			!recHocPhan?.ma && recDonVi?.maDonVi
				? [
						{
							active: true,
							field: 'maHocPhan',
							operator: EOperatorType.INCLUDE,
							values: danhSachHocPhan.length ? danhSachHocPhan.map((item) => item.ma) : [''],
						},
				  ]
				: undefined,
			undefined,
			undefined,
			['_id', 'ten', 'maHocPhan', 'cauHinhTkb', 'maHoaLichHoc'],
		);

	useEffect(() => {
		if (recHocKy?.ma) getLopHocPhan();
	}, [recHocKy?.ma, recDonVi?._id, recHocPhan?.ma]);

	return (
		<Card title={intl.formatMessage({ id: 'kyhoc.xeplich.title' })}>
			<FilterHocPhan />

			<Spin spinning={loading}>
				{danhSach.length ? (
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<div className='fw500' style={{ marginBottom: 8 }}>
								Danh sách tuần học
							</div>
							<GroupTagTuanHoc
								soTuan={recHocKy?.soTuan ?? 1}
								value={[selectTuan]}
								prefix='T'
								onChange={(val) => {
									if (val.length) setSelectTuan(val.at(-1) ?? 1);
								}}
							/>
						</Col>

						<Col span={24}>
							<TableLopHocPhanTKB tuanHienTai={selectTuan} />
						</Col>

						<Col span={24}>
							<TableXepLich tuanHienTai={selectTuan} getData={getLopHocPhan} />
						</Col>
					</Row>
				) : (
					<Empty description={<i>Không có lớp tín chỉ nào</i>} style={{ marginBottom: 32, marginTop: 32 }} />
				)}
			</Spin>
		</Card>
	);
};

export default XepLichThoiKhoaBieuPage;
