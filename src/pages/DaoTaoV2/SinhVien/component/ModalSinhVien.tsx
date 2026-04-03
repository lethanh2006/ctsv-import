import DanhSachMyCCT from '@/pages/CCT/SubmisstionRound/DanhSach';
import QuyetDinh from '@/pages/CheDoChinhSach/QuyetDinh';
import SinhVienHocVuPage from '@/pages/DaoTaoV2/SinhVien/XetHocVu';
import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { Button, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useIntl, useModel } from 'umi';
import FormSinhVien from './Form';
import FormKhenThuongKyLuat from './FormKhenThuongKyLuat';
import FormQuaTrinhHocTap from './FormQuaTrinhHocTap';

const ModalSinhVien = (props: any) => {
	const intl = useIntl();
	const { record, edit, setVisibleForm, handleView } = useModel('daotaov2.sinhvien.sinhvien');
	const [currentStep, setCurrentStep] = useState<string>('0');
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1200px)' });
	const { disabledForm } = props;

	useEffect(() => {
		setCurrentStep('0');
	}, [record?.ssoId]);

	const onChangeStep = (step: string) => {
		setCurrentStep(step);
	};

	return (
		<Card
			title={`${intl.formatMessage({ id: edit ? 'global.title.chinhsua' : 'global.title.themmoi' })} ${intl.formatMessage({ id: 'sinhvien.modal.title' })}`}
		>
			<Tabs
				destroyInactiveTabPane
				activeKey={currentStep}
				tabPosition={isTabletOrMobile ? 'top' : 'left'}
				onChange={record?.ssoId ? onChangeStep : undefined}
			>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab1' })} key={'0'}>
					<FormSinhVien afterAddNew={() => setCurrentStep('1')} disabledForm={disabledForm} />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab2' })} key={'1'} disabled={!record?.ssoId}>
					<FormQuaTrinhHocTap />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab3' })} key={'kqht'} disabled={!record?.ssoId}>
					{/* <KetQuaToanKhoaSinhVien sinhVienSsoId={record?.ssoId} /> */}
					<SinhVienHocVuPage />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab4' })} key={'hb'} disabled={!record?.ssoId}>
					{/* <HocBongSinhVienPage /> */}
					<QuyetDinh
						filterWidth={450}
						loaiCheDoSinhVien={ELoaiCheDoSinhVien.HOC_BONG}
						ssoId={record?.ssoId}
						title={intl.formatMessage({ id: 'sinhvien.quyetdinh.title' })}
					/>
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab5' })} key={'2'} disabled={!record?.ssoId}>
					<FormKhenThuongKyLuat />
				</Tabs.TabPane>
				{/* <Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab12' })} key={'12'} disabled={!record?.ssoId}>
					<QuyetDinh
						filterWidth={250}
						loaiCheDoSinhVien={ELoaiCheDoSinhVien.CHE_DO_CHINH_SACH}
						ssoId={record?.ssoId}
						title={intl.formatMessage({ id: 'sinhvien.quyetdinh.title' })}
					/>
				</Tabs.TabPane> */}
				{/* <Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab14' })} key={'14'} disabled={!record?.ssoId}>
					<QuyetDinh
						filterWidth={250}
						loaiCheDoSinhVien={ELoaiCheDoSinhVien.GDCT_TU_TUONG}
						ssoId={record?.ssoId}
						title={intl.formatMessage({ id: 'sinhvien.quyetdinh.title' })}
					/>
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab13' })} key={'13'} disabled={!record?.ssoId}>
					<PhieuDiemRenLuyenComponent ssoId={record?.ssoId} hideCard />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab6' })} key={'7'} disabled={!record?.ssoId}>
					<CongNoSinhVienPage sinhVienSsoId={record?.ssoId} />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab15' })} key={'15'} disabled={!record?.ssoId}>
					<SinhVienDotKhamPage ssoId={record?.ssoId} />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab16' })} key={'16'} disabled={!record?.ssoId}>
					<QuyetDinh
						filterWidth={250}
						loaiCheDoSinhVien={ELoaiCheDoSinhVien.BAO_HIEM}
						ssoId={record?.ssoId}
						title={intl.formatMessage({ id: 'sinhvien.quyetdinh.title' })}
					/>
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab7' })} key={'4'} disabled={!record?.ssoId}>
					<NoiNgoaiTruSinhVienPage />
				</Tabs.TabPane> */}
				{/* <Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab11' })} key={'9'} disabled={!record?.ssoId}>
					<SinhVienHocVuPage />
				</Tabs.TabPane> */}
				{/* <Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab8' })} key={'8'} disabled={!record?.ssoId}>
					<ChungChiSinhVienPage fromSinhVien />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab9' })} key={'5'} disabled={!record?.ssoId}>
					<FormTotNghiepVanBang />
				</Tabs.TabPane>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'sinhvien.tab10' })} key={'6'} disabled={!record?.ssoId}>
					<ViecLamSinhVienPage />
				</Tabs.TabPane> */}
				<Tabs.TabPane tab='CCT Submission' key={'17'} disabled={!record?.ssoId}>
					<DanhSachMyCCT ssoId={record?.ssoId} />
				</Tabs.TabPane>
			</Tabs>

			<div className='form-footer'>
				<Button onClick={() => handleView()}>{intl.formatMessage({ id: 'sinhvien.xemrutgon' })}</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ModalSinhVien;
