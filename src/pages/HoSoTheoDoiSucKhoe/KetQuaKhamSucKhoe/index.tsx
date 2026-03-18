import SelectHocKy from '@/pages/HocKy/components/SelectHocKy';
import { ETrangThaiKhamSucKhoe } from '@/services/DotKhamSuKhoe/constant';
import { Alert, Card, Empty } from 'antd';
import { useModel } from 'umi';
import SelectDotKhamSucKhoe from '../DotKhamSucKhoe/components/Select';
import SinhVienDotKhamPage from '../SinhVienDotKham';
import StatKetQuaKhamSucKhoe from './Stat';

const KetQuaKhamSucKhoePage = () => {
	const {
		danhSach: danhSachDotKham,
		setRecord: setRecordDotKham,
		record: recDot,
	} = useModel('hosotheodoisuckhoe.dotkhamsuckhoe');

	const { record: recHocKy, setRecord, danhSach: danhSachHocKy } = useModel('daotaov2.hocky.hocky');

	return (
		<Card title={intl.formatMessage({ id: 'ketquakhamsuckhoe.title' })}>
			<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
				<SelectHocKy
					style={{ width: 250 }}
					value={recHocKy?.ma}
					onChange={(val) => {
						setRecord(danhSachHocKy.find((item) => item.ma === val));
					}}
					isSetRecord
					selectMa
				/>
				<SelectDotKhamSucKhoe
					condition={{ maHocKy: recHocKy?.ma }}
					onChange={(val) => setRecordDotKham(danhSachDotKham.find((item) => item._id === val))}
					style={{ width: 250 }}
					value={recDot?._id}
					isSetRecord
				/>
			</div>

			{recDot?._id ? (
				<>
					<div style={{ marginBottom: 12 }}>
						{recDot.trangThai === ETrangThaiKhamSucKhoe.DA_DUYET ? (
							<Alert
								description={intl.formatMessage({ id: 'ketquakhamsuckhoe.alert.daduyet' })}
								type='success'
								showIcon
							/>
						) : recDot.trangThai === ETrangThaiKhamSucKhoe.CHO_DUYET ? (
							<Alert
								description={intl.formatMessage({ id: 'ketquakhamsuckhoe.alert.chuaduyet' })}
								type='warning'
								showIcon
							/>
						) : null}
					</div>

					<StatKetQuaKhamSucKhoe />
					<SinhVienDotKhamPage isKetQua />
				</>
			) : (
				<Empty
					description={intl.formatMessage({ id: 'ketquakhamsuckhoe.empty' })}
					style={{ marginTop: 50, marginBottom: 32 }}
				/>
			)}
		</Card>
	);
};

export default KetQuaKhamSucKhoePage;
