import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { type ThoiKhoaBieu } from '@/services/DaoTaoV2/HocKy/ThoiKhoaBieu/typing';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Tooltip, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalLichHocTuan from './ModalLichHocTuan';

/** Check trùng lịch học tuần trong 1 lớp tín chỉ */
export const checkTrungLichTuan = (lichHocTuanList: ThoiKhoaBieu.ILichHocTuan[]): boolean => {
	const data: Record<number, boolean[]> = {};
	// Với mỗi mục mã hóa lịch
	return lichHocTuanList.some((lich) => {
		const thu = +lich.thu - 1; // Index thứ trong tuần
		return lich.danhSachTuanHoc.some((tuan) => {
			// Với mỗi tuần học
			const date = (tuan - 1) * 7 + thu; // Ngày tương ứng ngày đấy, tuần ấy
			if (!(date in data)) data[date] = [];

			// Từ tiết bắt đầu đến kết thúc
			for (let tiet = 0; tiet < lich.soTiet; tiet++)
				// Nếu có flag thì return true => break
				if (data[date][lich.tietBatDau + tiet]) return true;
				// Nếu ko thì đánh dấu flag
				else data[date][lich.tietBatDau + tiet] = true;
			return false;
		});
	});
};

const LichHocTuanTable = (props: { onOk: () => void; fromPhanCong?: boolean }) => {
	const { onOk, fromPhanCong } = props;
	const { formSubmiting, putLichHocTuanModel, phanCongGiangDayModel } = useModel('daotaov2.hocky.thoikhoabieu');
	const { record: recLopHp, getByIdModel } = useModel('daotaov2.hocky.lophocphan');
	const [lichTuanList, setLichTuanList] = useState<ThoiKhoaBieu.ILichHocTuan[]>([]);
	const [indexLich, setIndexLich] = useState<number>(-1);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	useEffect(() => {
		// Chuyển từ mã hóa => Lịch học tuần để put
		const lichHocTuanList: ThoiKhoaBieu.ILichHocTuan[] =
			recLopHp?.maHoaLichHoc?.map((mh) => {
				const thu = mh.thu === 0 ? '7' : mh.thu.toString();
				return { ...mh, thu, danhSachTuanHoc: mh.danhSachTuan.map((i) => i.tuan) };
			}) ?? [];
		setLichTuanList(lichHocTuanList);
	}, [recLopHp?._id]);

	const onFinish = async () => {
		if (recLopHp?._id)
			if (fromPhanCong) {
				// Phân công giảng dạy
				const updateList = recLopHp?.maHoaLichHoc?.map((item, index) => ({
					nhanSuSsoId: lichTuanList?.[index]?.nhanSuSsoId,
					tkbIds: item.danhSachTuan.map((i) => i.tkbId),
				}));
				if (updateList) await phanCongGiangDayModel({ updateList });
			} else {
				if (checkTrungLichTuan(lichTuanList))
					notification.error({ message: 'Trùng lịch học', description: 'Vui lòng kiểm tra lại' });
				else
					await putLichHocTuanModel(recLopHp.ten, {
						lichHocTuanList: lichTuanList.map((item) => ({ ...item, thu: (+item.thu + 1).toString() })),
					})
						.then(() => {
							getByIdModel(recLopHp._id);
							if (onOk) onOk();
						})
						.catch((er) => console.log(er));
			}
	};

	const onAdd = () => {
		setIndexLich(-1);
		setVisibleModal(true);
	};

	const removeItemAt = (index: number) => {
		const newList = [...lichTuanList];
		newList.splice(index - 1, 1);
		setLichTuanList(newList);
	};

	const handleEdit = (index: number) => {
		setIndexLich(index - 1);
		setVisibleModal(true);
	};

	const handleOkLichTuan = (values: ThoiKhoaBieu.ILichHocTuan) => {
		const newList = [...lichTuanList];
		if (indexLich === -1) newList.push(values);
		else newList.splice(indexLich, 1, values);
		setLichTuanList(newList);
		setVisibleModal(false);
	};

	const columns: IColumn<ThoiKhoaBieu.ILichHocTuan & { index: number }>[] = [
		{
			title: 'Thứ',
			dataIndex: 'thu',
			width: 80,
			render: (val) => (val === '7' ? 'Chủ nhật' : `Thứ ${+val + 1}`),
			align: 'center',
		},
		{
			title: 'Tiết học',
			align: 'center',
			width: 80,
			render: (val, rec) => `${rec.tietBatDau} - ${rec.tietBatDau + rec.soTiet - 1}`,
		},
		{
			title: 'Danh sách tuần',
			width: 150,
			render: (val, rec) => rec.danhSachTuanHoc.sort((a, b) => a - b).join(', '),
		},
		{
			title: 'Giảng viên',
			dataIndex: 'nhanSuSsoId',
			render: (val, rec) => [rec.nhanSu?.hoDem, rec.nhanSu?.ten].join(' '),
			width: 150,
		},
		{
			title: 'Loại hình',
			dataIndex: 'loaiHinhHocTap',
			width: 120,
		},
		{
			title: 'Phòng học',
			dataIndex: 'phongHoc',
			width: 120,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title={props.fromPhanCong ? 'Phân công giảng dạy' : 'Chỉnh sửa'}>
						<Button onClick={() => handleEdit(rec.index)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					{!props.fromPhanCong ? (
						<Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => removeItemAt(rec.index)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topRight'
							>
								<Button danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					) : null}
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData columns={columns} data={lichTuanList} addStt otherProps={{ pagination: false }} hasTotal>
				<Space wrap>
					{!props.fromPhanCong ? (
						<Button icon={<PlusCircleOutlined />} onClick={() => onAdd()}>
							Thêm mới
						</Button>
					) : null}
					<Popconfirm title='Xác nhận lưu thời khóa biểu?' onConfirm={() => onFinish()}>
						<Button loading={formSubmiting} type='primary' icon={<SaveOutlined />}>
							Lưu lại
						</Button>
					</Popconfirm>
					<i>(Lưu ý: Thông tin không được ghi nhận nếu chưa ấn Lưu lại)</i>
				</Space>
			</TableStaticData>

			<ModalLichHocTuan
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				onOk={handleOkLichTuan}
				fromPhanCong={fromPhanCong}
				lichTuan={indexLich >= 0 ? lichTuanList[indexLich] : undefined}
			/>
		</>
	);
};

export default LichHocTuanTable;
