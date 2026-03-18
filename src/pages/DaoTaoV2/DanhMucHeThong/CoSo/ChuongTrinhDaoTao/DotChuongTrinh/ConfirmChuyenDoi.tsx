import { ELoaiThaoTacRaSoatCtdt } from '@/services/DaoTaoV2/DanhMucHeThong/constant';
import { Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormKhoiHocPhanCTDT from '../KhoiHocPhanCTDT/Form';

const ConfirmChuyenDoiKhoiHocPhan = (props: { onCancel: () => void; onOk: () => void; selectedMas: string[] }) => {
	const { onCancel, onOk, selectedMas } = props;
	const {
		setRecord: setKhoi,
		setVisibleForm: setVisibleKhoi,
		visibleForm: visibleKhoi,
	} = useModel('daotaov2.chuongtrinhdaotao.khoihocphanctdt');
	const { combineChuongTrinh, record } = useModel('daotaov2.chuongtrinhdaotao.dotchuongtrinh');
	const { postModel } = useModel('daotaov2.chuongtrinhdaotao.thaotacrasoat');

	useEffect(() => {
		const listKhoiHpCtGoc = selectedMas.map((index) => combineChuongTrinh.at(+index) ?? {});
		// Set khối để fill vào form
		setKhoi(listKhoiHpCtGoc?.[0]?.listKhoiHpCtGoc?.[0]?.khoiHpCt);
	}, [JSON.stringify(selectedMas)]);

	const onFinish = (values: any) => {
		const { ghiChu, ...khoiHpCt } = values;
		const listKhoiHpCtGoc = selectedMas
			.map((index) => combineChuongTrinh.at(+index) ?? {})
			.map((item) => item.listKhoiHpCtGoc ?? {})
			.flat();
		if (record?.ma)
			postModel(
				{
					ghiChu,
					khoiHpCt,
					listKhoiHpCtGoc,
					maChuongTrinh: record.ma,
					loai: listKhoiHpCtGoc.length
						? ELoaiThaoTacRaSoatCtdt.THAY_THE_KHOI_HP_CT
						: ELoaiThaoTacRaSoatCtdt.THEM_KHOI_HP_CT,
				},
				onOk,
			)
				.then(() => setVisibleKhoi(false))
				.catch((er) => console.log(er));
	};

	return (
		<Modal
			open={visibleKhoi}
			onCancel={() => {
				onCancel();
				setVisibleKhoi(false);
			}}
			width={800}
			footer={null}
			title={`${selectedMas.length ? 'Chuyển đổi' : 'Thêm mới'} khối học phần`}
			maskClosable={false}
		>
			<FormKhoiHocPhanCTDT getData={() => {}} afterInsertOrUpdate={onFinish} fromChuyenDoi onCancel={onCancel} />
		</Modal>
	);
};

export default ConfirmChuyenDoiKhoiHocPhan;
