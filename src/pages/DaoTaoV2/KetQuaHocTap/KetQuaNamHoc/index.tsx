import { EOperatorType } from '@/components/Table/constant';
import { type HocKy } from '@/services/DaoTaoV2/HocKy/HocKy/typing';
import { Card, Col, Empty, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import CardLopHanhChinh from '../KetQuaHocKy/components/CardLopHanhChinh';
import TableDiemHocPhan from '../KetQuaHocKy/components/TableDiemHocPhan';
import '../KetQuaHocKy/components/style.less';
import SelectNamHoc from '@/pages/DaoTaoV2/NamHoc/NamHoc/components/Select';

const KetQuaNamHocPage = () => {
	const intl = useIntl();
	const { record: recordSVLopHC } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');
	const { record: recNamHoc, danhSach: danhSachNamHoc, setRecord: setNamHoc } = useModel('daotaov2.namhoc.namhoc');
	const { getAllModel: getAllHocKy, danhSach: danhSachHocKy } = useModel('daotaov2.hocky.hocky');
	const { getAllModel: getKetQuaHocKy, record, loading } = useModel('daotaov2.ketquahoctap.ketquahocky');

	const getData = (hocKys?: HocKy.IRecord[]) =>
		recordSVLopHC?.sinhVienSsoId &&
		getKetQuaHocKy(true, { maHocKy: -1 }, { sinhVienSsoId: recordSVLopHC.sinhVienSsoId }, [
			{
				active: true,
				field: 'maHocKy',
				values: (hocKys || danhSachHocKy).map((item) => item.ma),
				operator: EOperatorType.INCLUDE,
			},
		]);

	useEffect(() => {
		if (recNamHoc?._id)
			getAllHocKy(false, undefined, { namHocId: recNamHoc._id }).then((hocKys) => {
				getData(hocKys);
			});
	}, [recNamHoc?._id]);

	useEffect(() => {
		getData();
	}, [recordSVLopHC?.sinhVienSsoId]);

	return (
		<CardLopHanhChinh
			title={intl.formatMessage({ id: 'ketquahoctap.ketquanamhoc.title' })}
			otherComponent={
				<SelectNamHoc
					isSetRecord
					style={{ width: 200 }}
					value={recNamHoc?._id}
					onChange={(val) => setNamHoc(danhSachNamHoc.find((item) => item._id === val))}
				/>
			}
		>
			<Spin spinning={loading}>
				{record?._id ? (
					<>
						<Row gutter={[12, 12]}>
							{/* <Col span={12} xxl={8}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>Tổng số TC</div>
										<span className='sum-text'>15</span>
									</div>
								</Card>
							</Col> */}
							{/* <Col span={12} xxl={8}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>Trung bình năm học</div>
										<span className='sum-text'>3.5</span>
									</div>
								</Card>
							</Col> */}
							<Col span={12} xxl={8}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>Tổng số TC tích luỹ</div>
										<span className='sum-text'>{record.tongSoTinChiTichLuyToanKhoa}</span>
									</div>
								</Card>
							</Col>

							<Col span={12} xxl={8}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>Trung bình tích luỹ</div>
										<span className='sum-text'>{record.trungBinhTichLuyToanKhoaThang4}</span>
									</div>
								</Card>
							</Col>
							{/* <Col span={12} xxl={8}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>Xếp loại</div>
										<span className='sum-text' style={{ color: colorLoaiHocLuc[record.hocLuc] }}>
											{record.hocLuc}
										</span>
									</div>
								</Card>
							</Col> */}
							<Col span={24} xxl={8}>
								<Card className='ket-qua-card'>
									<div className='ket-qua-content'>
										<div className='title'>Trình độ</div>
										<span className='sum-text'>{record.trinhDo}</span>
									</div>
								</Card>
							</Col>
						</Row>

						{recordSVLopHC?.sinhVienSsoId && recNamHoc?._id ? (
							<TableDiemHocPhan sinhVienSsoId={recordSVLopHC.sinhVienSsoId} namHocId={recNamHoc._id} />
						) : null}
					</>
				) : (
					<Empty description='Không có dữ liệu !' style={{ marginTop: 50, marginBottom: 32 }} />
				)}
			</Spin>
		</CardLopHanhChinh>
	);
};

export default KetQuaNamHocPage;
