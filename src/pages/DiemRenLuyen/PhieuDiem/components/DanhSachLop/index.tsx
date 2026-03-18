import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import SelectNganh from '@/pages/DaoTaoV2/DanhMucHeThong/CoSo/Nganh/components/SelectNganh';
import SelectKhoaSinhVien from '@/pages/DaoTaoV2/SinhVien/KhoaSinhVien/SelectKhoaSinhVien';
import { LopHanhChinh } from '@/services/DaoTaoV2/LopHanhChinh/typing';
import { useIntl, useModel } from 'umi';

const DanhSachLop = () => {
	const intl = useIntl();
	const { setRecord, record, getModel, page, limit, condition } = useModel('daotaov2.lophanhchinh.lophanhchinh');
	const {
		getModel: getModelLopNhanSu,
		setRecord: setRecordLopNhanSu,
		record: recordLopNhanSu,
		page: pageLopNhanSu,
		limit: limitLopNhanSu,
		condition: conditionLopNhanSu,
	} = useModel('daotaov2.lophanhchinh.lophanhchinhnhansu');
	const { dataPhanQuyen } = useModel('diemrenluyen.dot');
	const { record: recNganh, setRecord: setRecordNganh } = useModel('daotaov2.danhmuc.nganhdaotao');
	const { record: recKhoaSinhVien, setRecord: setRecKhoaSinhVien } = useModel('daotaov2.khoasinhvien.khoasinhvien');
	const isCVHT = false;
	const { initialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;
	const isAdmin = currentUser?.preferred_username === 'admin';

	// useEffect(() => {
	// 	if (isCVHT) {
	// 		getAllModelLopNhanSu(true, undefined);
	// 	} else {
	// 		getAllModel(true, undefined, { maNganh: recNganh?.ma });
	// 	}
	// }, [recNganh, isCVHT]);

	const getData = async () => {
		if (isCVHT && !isAdmin && !dataPhanQuyen?.isPhongCTSV) {
			getModelLopNhanSu().then((res) => setRecordLopNhanSu(res?.[0] ?? {}));
		} else {
			if (recNganh?.ma || recKhoaSinhVien?.ma)
				getModel({ maNganh: recNganh?.ma, maKhoaSinhVien: recKhoaSinhVien?.ma })?.then((res) => {
					setRecord(res?.[0] ?? {});
				});
		}
	};

	const onCell = (recordVal: LopHanhChinh.IRecord) => ({
		onClick: () => {
			setRecord(recordVal);
		},
		style: {
			cursor: 'pointer',
			fontWeight:
				recordVal?._id === (isCVHT && !dataPhanQuyen?.isPhongCTSV && !isAdmin ? recordLopNhanSu?._id : record?._id)
					? 700
					: 600,
			color:
				recordVal?._id === (isCVHT && !dataPhanQuyen?.isPhongCTSV && !isAdmin ? recordLopNhanSu?._id : record?._id)
					? '#CC0D00'
					: undefined,
			backgroundColor:
				recordVal?._id === (isCVHT && !dataPhanQuyen?.isPhongCTSV && !isAdmin ? recordLopNhanSu?._id : record?._id)
					? '#f0f0f0'
					: undefined,
		},
	});

	const columns: IColumn<LopHanhChinh.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'phieudiem.tt' }),
			dataIndex: 'index',
			align: 'center',
			width: 50,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'phieudiem.tenlophanhchinh' }),
			dataIndex: 'ten',
			width: 200,
			onCell,
		},
	];

	return (
		<div style={{ paddingTop: 3 }}>
			{/*{(!isCVHT || dataPhanQuyen?.isPhongCTSV || isAdmin) && (*/}
			{/*	<SelectNganh*/}
			{/*		style={{ marginBottom: 12 }}*/}
			{/*		value={recNganh?._id}*/}
			{/*		onChange={(val, option) => {*/}
			{/*			const rawData = option?.rawData;*/}
			{/*			setRecordNganh(rawData);*/}
			{/*		}}*/}
			{/*		isSetRecord={true}*/}
			{/*		condition={{ maDonVi: isAdmin || dataPhanQuyen?.isPhongCTSV ? undefined : dataPhanQuyen?.donVi?.maDonVi }}*/}
			{/*	/>*/}
			{/*)}*/}

			{/*<TableStaticData*/}
			{/*	columns={columns}*/}
			{/*	data={isCVHT ? danhSachLopNhanSu : danhSach}*/}
			{/*	otherProps={{ scrol: { x: 350 }, pagination: false }}*/}
			{/*/>*/}

			<TableBase
				addStt={false}
				hideTotal
				hideCard
				getData={getData}
				dependencies={[
					isCVHT,
					recNganh,
					recKhoaSinhVien,
					page,
					pageLopNhanSu,
					limit,
					limitLopNhanSu,
					condition,
					conditionLopNhanSu,
					dataPhanQuyen,
				]}
				buttons={{ create: false }}
				modelName={
					isCVHT && !isAdmin && !dataPhanQuyen?.isPhongCTSV
						? 'daotaov2.lophanhchinh.lophanhchinhnhansu'
						: 'daotaov2.lophanhchinh.lophanhchinh'
				}
				columns={columns}
				otherButtons={[
					<>
						{((!isCVHT && !dataPhanQuyen?.isPhongCTSV && !isAdmin) || dataPhanQuyen?.isPhongCTSV) && (
							<SelectNganh
								// style={{ marginBottom: 12 }}
								style={{ width: 200 }}
								value={recNganh?._id}
								onChange={(val, option) => {
									const rawData = option?.rawData;
									setRecordNganh(rawData);
								}}
								isSetRecord={true}
								condition={{
									maDonVi: isAdmin || dataPhanQuyen?.isPhongCTSV ? undefined : dataPhanQuyen?.donVi?.maDonVi,
								}}
							/>
						)}
						{(dataPhanQuyen?.isPhongCTSV || isAdmin) && (
							<>
								<SelectKhoaSinhVien
									isSetRecord
									style={{ width: 200 }}
									value={recKhoaSinhVien?._id}
									onChange={(val, option) => {
										const rawData = option?.rawData;
										setRecKhoaSinhVien(rawData);
									}}
								/>
							</>
						)}
					</>,
				]}
			/>
		</div>
	);
};
export default DanhSachLop;
