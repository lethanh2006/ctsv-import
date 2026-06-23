import access from '@/access';
import { Carousel, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import StatKetQuaTichLuySinhVien from '../../KetQuaNamHoc/components/StatKetQuaTichLuy';
import ChartDiemPLO from './ChartDiemPLO';
import ChartDiemTrungBinh from './ChartDiemTrungBinh';
import ChartSoTinChi from './ChartSoTinChi';

const TabTongQuanKqhtToanKhoa = (props: {
	sinhVienSsoId?: string;
	hideDetail?: boolean;
	maKhoaNganh?: string;
	/** Legend của charts luôn ở bottom? */
	fixedSize?: boolean;
}) => {
	const { loading, getKetQuaHkSvModel } = useModel('daotaov2.ketquahoctap.ketquahocky');
	const { thongKeDiemPLOSinhVienModel } = useModel('daotaov2.ketquahoctap.diemhpsvhk');
	const { hideDetail, sinhVienSsoId, maKhoaNganh, fixedSize } = props;
	const { cloPloAccessFilter } = access({});
	const hasCloPloAccess = cloPloAccessFilter();

	useEffect(() => {
		if (sinhVienSsoId && maKhoaNganh) {
			getKetQuaHkSvModel(sinhVienSsoId, maKhoaNganh);

			if (hasCloPloAccess) thongKeDiemPLOSinhVienModel(maKhoaNganh, sinhVienSsoId);
		}
	}, [sinhVienSsoId, maKhoaNganh]);

	return (
		<Spin spinning={loading}>
			{!hideDetail ? (
				<div style={{ marginBottom: 12 }}>
					<StatKetQuaTichLuySinhVien />
				</div>
			) : null}

			<Carousel autoplay pauseOnDotsHover>
				<div>
					<div style={{ marginBottom: 8 }}>
						<ChartSoTinChi legendBottom={fixedSize} />
					</div>
				</div>
				<div>
					<div style={{ marginBottom: 8 }}>
						<ChartDiemTrungBinh legendBottom={fixedSize} />
					</div>
				</div>

				{hasCloPloAccess && (
					<div>
						<div style={{ marginBottom: 8 }}>
							<ChartDiemPLO />
						</div>
					</div>
				)}
			</Carousel>
		</Spin>
	);
};

export default TabTongQuanKqhtToanKhoa;
