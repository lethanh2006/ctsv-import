import access from '@/access';
import { Segmented, Tabs } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
// import TienTrinhHocTapSinhVien from '../../DanhMucHeThong/CoSo/ChuongTrinhDaoTao/TienTrinhSinhVien';
import DiemHocPhanSvTable from '../DiemHocPhan';
import '../KetQuaHocKy/components/style.less';
import TableDiemHocPhan from '../KetQuaHocKy/components/TableDiemHocPhan';
// import ChuanDauRaSinhVien from './components/ChuanDauRa';
import TienTrinhHocTapSinhVien from '../TienTrinhSinhVien';
import ChuanDauRaSinhVien from './components/ChuanDauRa';
import './components/style.less';
import TabTongQuanKqhtToanKhoa from './components/TabTongQuan';

const KetQuaToanKhoaSinhVien = (props: {
	sinhVienSsoId?: string;
	maKhoaNganh?: string;
	/** Legend của charts luôn ở bottom? */
	fixedSize?: boolean;
}) => {
	const intl = useIntl();
	const [tabActive, setTabActive] = useState<string>('1');
	const [tabActive1, setTabActive1] = useState('1');
	const { sinhVienSsoId, maKhoaNganh } = props;

	const { cloPloAccessFilter } = access({});
	const hasCloPloAccess = cloPloAccessFilter();

	return (
		<>
			<Tabs activeKey={tabActive1} onChange={(tab) => setTabActive1(tab)}>
				<Tabs.TabPane key='1' tab={intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.tab1' })} />
				<Tabs.TabPane key='2' tab={intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.tab2' })} />
				<Tabs.TabPane key='3' tab={intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.tab3' })} />

				{hasCloPloAccess && (
					<Tabs.TabPane key='4' tab={intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.tab4' })} />
				)}
			</Tabs>

			{tabActive1 === '1' ? (
				<TabTongQuanKqhtToanKhoa {...props} />
			) : tabActive1 === '3' ? (
				<TienTrinhHocTapSinhVien sinhVienSsoId={sinhVienSsoId ?? ''} maKhoaNganh={maKhoaNganh ?? ''} />
			) : tabActive1 === '4' ? (
				<ChuanDauRaSinhVien sinhVienSsoId={sinhVienSsoId ?? ''} maKhoaNganh={maKhoaNganh ?? ''} />
			) : sinhVienSsoId ? (
				<>
					<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
						<Segmented
							value={tabActive}
							onChange={(tab) => setTabActive(tab.toString())}
							options={[
								{ value: '1', label: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.tientrinhhoctap' }) },
								{ value: '2', label: intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.bangdiemhocphan' }) },
							]}
						/>
						<i>{intl.formatMessage({ id: 'ketquahoctap.ketquatoankhoa.ghichu_tientrinh' })}</i>
					</div>

					{tabActive === '1' ? (
						<TableDiemHocPhan sinhVienSsoId={sinhVienSsoId} maKhoaNganh={maKhoaNganh ?? ''} hideTitle />
					) : (
						<DiemHocPhanSvTable sinhVienSsoId={sinhVienSsoId} maKhoaNganh={maKhoaNganh} />
					)}
				</>
			) : null}
		</>
	);
};

export default KetQuaToanKhoaSinhVien;
