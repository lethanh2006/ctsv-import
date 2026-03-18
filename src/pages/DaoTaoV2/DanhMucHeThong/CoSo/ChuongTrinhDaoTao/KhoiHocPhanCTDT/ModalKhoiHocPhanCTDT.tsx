import { type ChuongTrinhDaoTao } from '@/services/DaoTaoV2/DanhMucHeThong/ChuongTrinhDaoTao/typings';
import { ELoaiHocPhanCTDT } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormKhoiHocPhanCTDT from './Form';
import HocPhanCTDT from '../HocPhanCTDT';

const ModalKhoiHocPhanCTDT = (props: {
	initKhoi?: string;
	initChuyenNganh?: string;
	getData: () => void;
	isKeHoach?: boolean;
}) => {
	const { initKhoi, initChuyenNganh, getData, isKeHoach } = props;
	const { record, setVisibleForm, isClone } = useModel('daotaov2.chuongtrinhdaotao.khoihocphanctdt');
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id, isClone]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	const onAfterInertOrUpdate = (rec: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => {
		if (rec.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON || rec.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TOT_NGHIEP)
			onChangeStep(1);
		else setVisibleForm(false);
	};

	return (
		<>
			{record?.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON ||
			record?.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TOT_NGHIEP ? (
				<Steps
					current={currentStep}
					type='navigation'
					style={{ marginBottom: 18, paddingTop: 0 }}
					onChange={record?._id ? onChangeStep : undefined}
				>
					<Steps.Step title='Thông tin chung' />
					<Steps.Step title='Danh sách học phần tự chọn' disabled={!record?._id || isClone} />
				</Steps>
			) : null}

			{currentStep === 0 ? (
				<FormKhoiHocPhanCTDT
					initKhoi={initKhoi}
					initNganh={initChuyenNganh}
					getData={getData}
					afterInsertOrUpdate={onAfterInertOrUpdate}
					isKeHoach={isKeHoach}
				/>
			) : (
				<HocPhanCTDT />
			)}
		</>
	);
};

export default ModalKhoiHocPhanCTDT;
