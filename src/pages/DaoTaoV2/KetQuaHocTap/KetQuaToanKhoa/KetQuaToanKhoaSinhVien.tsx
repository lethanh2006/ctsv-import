import { Carousel, Empty, Segmented, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectSongNganh from '../../NamHoc/KhoaNganh/components/SelectSongNganh';
import DiemHocPhanSvTable from '../DiemHocPhan';
import TableDiemHocPhan from '../KetQuaHocKy/components/TableDiemHocPhan';
import '../KetQuaHocKy/components/style.less';
import ChartDiemTrungBinh from './components/ChartDiemTrungBinh';
import ChartSoTinChi from './components/ChartSoTinChi';
import './components/style.less';

const KetQuaToanKhoaSinhVien = (props: { sinhVienSsoId?: string; hideDetail?: boolean; maKhoaNganh?: string }) => {
	const intl = useIntl();
	const { getAllModel: getKetQuaHocKy, danhSach, loading } = useModel('daotaov2.ketquahoctap.ketquahocky');
	const [tabActive, setTabActive] = useState<string>('1');
	const [selectKhoaNganh, setSelectKhoaNganh] = useState<string>();
	const { sinhVienSsoId, hideDetail } = props;
	const maKhoaNganh = props.maKhoaNganh || selectKhoaNganh;

	const getData = () => sinhVienSsoId && getKetQuaHocKy(false, { maHocKy: 1 }, { sinhVienSsoId, maKhoaNganh });

	useEffect(() => {
		getData();
	}, [sinhVienSsoId, maKhoaNganh]);

	return (
		<>
			{!props.maKhoaNganh ? (
				<div style={{ marginBottom: 12 }}>
					<SelectSongNganh
						ssoId={sinhVienSsoId ?? ''}
						style={{ width: 250 }}
						value={selectKhoaNganh}
						onChange={(val) => setSelectKhoaNganh(val)}
					/>
				</div>
			) : null}

			<Spin spinning={loading}>
				{danhSach.length ? (
					<>
						<Carousel autoplay pauseOnDotsHover>
							<div>
								<div style={{ marginBottom: 8 }}>
									<ChartSoTinChi />
								</div>
							</div>
							<div>
								<div style={{ marginBottom: 8 }}>
									<ChartDiemTrungBinh />
								</div>
							</div>
						</Carousel>

						{sinhVienSsoId && !hideDetail ? (
							<>
								<Segmented
									value={tabActive}
									onChange={(tab) => setTabActive(tab.toString())}
									options={[
										{ value: '1', label: intl.formatMessage({ id: 'sinhvienhocvu.ketqua.danhsach.label' }) },
										{ value: '2', label: intl.formatMessage({ id: 'sinhvienhocvu.ketqua.bangdiemhocphan.label' }) },
									]}
									style={{ margin: '12px 8px 8px 0' }}
								/>

								{tabActive === '1' ? (
									<TableDiemHocPhan sinhVienSsoId={sinhVienSsoId} maKhoaNganh={maKhoaNganh} hideTitle />
								) : (
									<DiemHocPhanSvTable sinhVienSsoId={sinhVienSsoId} maKhoaNganh={maKhoaNganh} />
								)}
							</>
						) : null}
					</>
				) : (
					<Empty
						description={intl.formatMessage({ id: 'sinhvienhocvu.ketqua.khongcodulieu' })}
						style={{ marginTop: 50, marginBottom: 32 }}
					/>
				)}
			</Spin>
		</>
	);
};

export default KetQuaToanKhoaSinhVien;
