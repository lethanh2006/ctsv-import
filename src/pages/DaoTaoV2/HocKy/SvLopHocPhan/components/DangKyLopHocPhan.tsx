import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { EColorLopDangKy } from '@/services/DaoTaoV2/DangKyTinChi/constant';
import { type LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { ELoaiLopHocPhan, ETrangThaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { Button } from 'antd';
import { type TableRowSelection } from 'antd/lib/table/interface';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import RenderLichHoc from '../../LopHocPhan/components/RenderLichHoc';
import './style.less';

/**
 * Phiên bản rút gọn của Đăng ký lớp tín chỉ tại VWA Connect
 * @param props
 * @returns
 */
const DangKyLopHocPhan = (props: {
	onOk: (lopHocPhan: LopHocPhan.IRecord) => void;
	onCancel: () => void;
	maHocKy: string;
	maHocPhan: string;
	sinhVienSsoId: string;
}) => {
	const { getAllModel: getAllSinhVienLopHp } = useModel('daotaov2.hocky.sinhvienlophocphan');
	const { record: recLopHP, getAllModel: getAllLopHp } = useModel('daotaov2.hocky.lophocphan');
	const { checkTrungLich, tinhDataLichHoc } = useModel('daotaov2.dangkytinchi.sinhviendotdangky');
	const [expandedLopHocPhan, setExpandedLopHocPhan] = useState<string[]>([]);
	const [danhSach, setDanhSach] = useState<LopHocPhan.IRecord[]>([]);
	const [lopDangKy, setLopDangKy] = useState<LopHocPhan.IRecord>();
	const { onCancel, onOk, maHocKy, maHocPhan, sinhVienSsoId } = props;

	/**
	 * Get lớp tín chỉ khả dụng: Cùng môn, cùng học kỳ, khác lớp hiện tại, còn mở
	 * @returns
	 */
	const getLopHocPhan = () => {
		if (maHocKy && maHocPhan)
			getAllLopHp(
				false,
				{ soThuTuLop: 1 },
				{
					maHocKy,
					loai: ELoaiLopHocPhan.CHINH,
					maHocPhan,
					trangThaiLop: ETrangThaiLopHocPhan.MO,
				},
				undefined,
				'dang-ky/many',
				false,
			).then((data) => {
				setDanhSach(data);
				setExpandedLopHocPhan(data.filter((item) => !!item.children?.length).map((item) => item.ten));
			});
	};

	const getSinhVienLopHocPhan = () => {
		// Get tất cả lớp đăng ký của sinh viên trong học kỳ hiện tại
		if (maHocKy && sinhVienSsoId && maHocPhan)
			getAllSinhVienLopHp(
				false,
				undefined,
				{
					maSvHk: `${sinhVienSsoId}|${maHocKy}`,
				},
				undefined,
				undefined,
				false,
			).then((res) => {
				const data =
					res?.filter(
						(item) =>
							item.lopHocPhan?.maHocPhan !== maHocPhan && item.lopHocPhan?.trangThaiLop !== ETrangThaiLopHocPhan.DONG,
					) ?? [];
				tinhDataLichHoc(data.map((item) => item.lopHocPhan?.thoiKhoaBieuList ?? []).flat());
			});
	};

	useEffect(() => {
		getLopHocPhan();
		getSinhVienLopHocPhan();
		setLopDangKy(undefined);
	}, [maHocPhan, sinhVienSsoId]);

	const onCell = (rec: LopHocPhan.IRecord) => ({
		style: {
			background:
				// rec.siSoToiDa - (rec.siSo ?? 0) <= 0
				//   ? EColorLopDangKy.FULL_LOP
				checkTrungLich(rec.thoiKhoaBieuList ?? []) ? EColorLopDangKy.TRUNG_LICH : undefined,
		},
	});

	const rowSelection: TableRowSelection<LopHocPhan.IRecord> = {
		hideSelectAll: true,
		preserveSelectedRowKeys: true,
		fixed: true,
		// type: 'radio',     // Dùng radio không được
		selectedRowKeys: lopDangKy?.ten ? [lopDangKy.ten] : [],

		onChange: (selectedRowKeys, selectedRows) => {
			const lopVuaChon = selectedRows?.at(-1);
			setLopDangKy(lopVuaChon);
		},

		getCheckboxProps: (record) => {
			const lopCha = danhSach.find((item) => item.ten === record.tenCha);
			// Check trùng cả thời khóa biểu của lớp cha
			const allThoiKhoaBieu = [...(record.thoiKhoaBieuList ?? []), ...(lopCha?.thoiKhoaBieuList ?? [])];
			// Check sĩ số còn trống ở cả lớp cha nữa
			// const siSo =
			//   record.siSoToiDa - (record.siSo ?? 0) <= 0 ||
			//   (!!lopCha?._id && lopCha.siSoToiDa - (lopCha.siSo ?? 0) <= 0);
			return {
				disabled: record._id === recLopHP?._id || checkTrungLich(allThoiKhoaBieu) || !!record.children?.length,
				// siSo,
			};
		},
	};

	/**
	 * Expand or Collapse Lớp thực hành
	 */
	const onExpand = (expanded: boolean, rec: LopHocPhan.IRecord) => {
		setExpandedLopHocPhan(
			expanded ? [...expandedLopHocPhan, rec.ten] : expandedLopHocPhan.filter((i) => i !== rec.ten),
		);
	};

	/**
	 * Thực hiện chuyển lớp
	 */
	const onFinish = () => {
		if (lopDangKy?._id) onOk(lopDangKy);
	};

	const columns: IColumn<LopHocPhan.IRecord>[] = [
		{
			title: 'TT lớp',
			dataIndex: 'soThuTuLop',
			width: 80,
			align: 'center',
			render: (val, rec) => `${val}${rec.soThuTuNhom ? ` (nhóm ${rec.soThuTuNhom})` : ''}`,
			onCell,
		},
		{
			title: 'Thông tin chi tiết',
			width: 400,
			render: (val, rec) => <RenderLichHoc lopHocPhan={rec} />,
			onCell,
		},
		{
			title: 'Sĩ số tối đa',
			dataIndex: 'siSoToiDa',
			align: 'center',
			width: 60,
			onCell,
		},
		{
			title: 'Còn trống',
			align: 'center',
			width: 60,
			render: (val, rec) => rec.siSoToiDa - (rec.siSo ?? 0),
			onCell,
		},
	];

	return (
		<>
			{maHocPhan ? (
				<>
					<div className='ant-descriptions-title' style={{ marginTop: 12, marginBottom: 8 }}>
						Danh sách lớp tín chỉ {`"${maHocPhan ?? ''}"`}
					</div>

					<TableStaticData
						columns={columns}
						data={danhSach.map((item: any) => ({
							...item,
							children:
								item?.children && Array.isArray(item.children) && item.children.length ? item.children : undefined,
						}))}
						hasTotal={false}
						otherProps={{
							rowKey: 'ten',
							rowSelection,
							expandable: {
								expandRowByClick: true,
								indentSize: 0,
								expandedRowKeys: expandedLopHocPhan,
								onExpand,
							},
						}}
					/>

					<div
						style={{
							display: 'flex',
							justifyContent: 'end',
							gap: 8,
							flexWrap: 'wrap',
							marginTop: 8,
						}}
					>
						<span
							style={{
								width: 40,
								height: 20,
								display: 'inline-block',
								backgroundColor: EColorLopDangKy.TRUNG_LICH,
							}}
						/>
						<span>Lớp bị trùng lịch học</span>
						{/* <span
          style={{
            width: 40,
            height: 20,
            display: 'inline-block',
            backgroundColor: EColorLopDangKy.FULL_LOP,
          }}
        />
        <span>Lớp không còn chỗ trống</span> */}
					</div>
				</>
			) : null}

			<div className='form-footer'>
				<Button type='primary' onClick={onFinish} disabled={!lopDangKy?._id}>
					Xác nhận
				</Button>
				<Button onClick={onCancel}>Hủy</Button>
			</div>
		</>
	);
};

export default DangKyLopHocPhan;
