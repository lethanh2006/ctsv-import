import { EOperatorType } from '@/components/Table/constant';
import {
	ETrangThaiDuyetCanhBao,
	colorTrangThaiDuyetCanhBao,
	fieldTrangThaiDuyetCanhBao,
} from '@/services/DaoTaoV2/KetQuaHocTap/constant';
import { Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatSinhVienCanhBao = (props: { isThoiHoc?: boolean }) => {
	const { isThoiHoc } = props;
	const { setFilters, filters } = useModel(
		isThoiHoc ? 'daotaov2.ketquahoctap.xethocvu.thoihoc' : 'daotaov2.ketquahoctap.xethocvu.canhbao',
	);
	const { thongkeSinhVienCanhBaoModel, thongKe } = useModel('daotaov2.ketquahoctap.xethocvu.thongke');
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const tongSVCanhBao = (thongKe?.choDuyet ?? 0) + (thongKe?.khongDuyet ?? 0) + (thongKe?.daDuyet ?? 0);

	useEffect(() => {
		if (recHocKy?.ma) thongkeSinhVienCanhBaoModel(isThoiHoc ? 'thoi-hoc' : 'canh-bao-ket-qua-hoc-tap', recHocKy?.ma);
	}, [recHocKy?.ma, isThoiHoc]);

	const handleTrangThai = (trangThai?: ETrangThaiDuyetCanhBao) => {
		const temp = [...(filters ?? [])].filter((item) => item.field !== 'trangThai');
		if (trangThai)
			temp.push({ active: true, field: 'trangThai', operator: EOperatorType.INCLUDE, values: [trangThai] });
		setFilters(temp);
	};

	return (
		<>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={12} md={6}>
					<Card className='card-stat-small' onClick={() => handleTrangThai()} style={{ cursor: 'pointer' }}>
						<span className='num'>{tongSVCanhBao ?? '--'}</span>
						<span>Tổng số SV</span>
					</Card>
				</Col>

				{Object.values(ETrangThaiDuyetCanhBao).map((item) => (
					<Col span={12} md={6} key={item}>
						<Card className='card-stat-small' style={{ cursor: 'pointer' }} onClick={() => handleTrangThai(item)}>
							<span className='num' style={{ color: colorTrangThaiDuyetCanhBao[item] }}>
								{thongKe?.[fieldTrangThaiDuyetCanhBao[item]] ?? '--'}
							</span>
							<span>SV {item.toLocaleLowerCase()}</span>
						</Card>
					</Col>
				))}
			</Row>
		</>
	);
};

export default StatSinhVienCanhBao;
