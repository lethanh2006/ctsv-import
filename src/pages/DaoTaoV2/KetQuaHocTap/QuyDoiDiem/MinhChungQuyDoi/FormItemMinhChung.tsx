import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { DotQuyDoiDiem } from '@/services/DaoTaoV2/KetQuaHocTap/DotQuyDoiDiem/typing';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Modal, Popconfirm } from 'antd';
import monent from 'dayjs';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormMinhChungQuyDoiDiem from './Form';

const FormItemMinhChungQuyDoi = (props: {
	value?: DotQuyDoiDiem.IMinhChungQuyDoiDiem[];
	onChange?: (data: DotQuyDoiDiem.IMinhChungQuyDoiDiem[]) => void;
	getData?: () => void;
}) => {
	const { record, isView } = useModel('daotaov2.ketquahoctap.quydoidiem.quydoidiemsinhvien');
	const { handleEdit, setVisibleForm, visibleForm, getModel, danhSach } = useModel(
		'ketquahoctap.quydoidiem.minhchungquydoidiem',
	);
	const { value = record?.danhSachMinhChungQuyDoi ?? [], onChange, getData: getDataExternal } = props;

	const getData = () => getModel({ quyDoiDiemSvId: record?._id });

	useEffect(() => {
		if (record?._id) getData();
	}, [record?._id]);

	const [recMinhChung, setRecMinhChung] = useState<any>();

	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		if (onChange) onChange(data);
	};

	const onAdd = (rec: DotQuyDoiDiem.IMinhChungQuyDoiDiem) => {
		if (!recMinhChung?.index) {
			const data = [...value, rec];
			if (onChange) onChange(data);
			setVisibleForm(false);
		} else {
			const data = [...value];
			data.splice(recMinhChung?.index - 1, 1, rec);
			if (onChange) onChange(data);
			setVisibleForm(false);
		}
	};

	const columns: IColumn<DotQuyDoiDiem.IMinhChungQuyDoiDiem & { index: number }>[] = [
		{
			title: 'Loai minh chứng',
			dataIndex: 'loai',
			width: 100,
			align: 'center',
		},
		{
			title: 'Thông tin minh chứng',
			width: 350,
			render: (val, rec) => (
				<>
					{/* Chứng chỉ đã đạt */}
					{rec.tenChungChi ? (
						<>
							- Tên chứng chỉ: <b>{rec?.tenChungChi}</b> <br />
						</>
					) : null}
					{rec.bacChungChi ? (
						<>
							- Điểm/bậc chứng chỉ: <b>{rec?.bacChungChi}</b> <br />
						</>
					) : null}
					{rec.donViCap ? (
						<>
							- Đơn vị cấp: <b>{rec?.donViCap}</b> <br />
						</>
					) : null}
					{rec.thoiGianHieuLuc ? (
						<>
							- Thời gian hiệu lực: <b>{monent(rec?.thoiGianHieuLuc).format('DD/MM/YYYY')}</b> <br />
						</>
					) : null}
					{rec.thoiGianHetHieuLuc ? (
						<>
							- Thời gian hết hiệu lực: <b>{monent(rec?.thoiGianHetHieuLuc).format('DD/MM/YYYY')}</b> <br />
						</>
					) : null}
					{rec.urlsChungChi ? (
						<>
							- Minh chứng:{' '}
							{rec?.urlsChungChi
								?.map((item) => (
									<a href={item} key={item}>
										Xem tệp tin
									</a>
								))
								.join(', ')}
						</>
					) : null}

					{/* Học phần đã học */}
					{rec?.tenHocPhan ? (
						<>
							- Tên học phần: <b>{rec?.tenHocPhan}</b> <br />
						</>
					) : null}
					{rec?.maHocPhan ? (
						<>
							- Mã học phần: <b>{rec?.maHocPhan}</b> <br />
						</>
					) : null}
					{rec?.soTinChi ? (
						<>
							- Số tín chỉ: <b>{rec?.soTinChi}</b> <br />
						</>
					) : null}
					{rec?.trinhDoDaoTao ? (
						<>
							- Trình độ: <b>{rec?.trinhDoDaoTao}</b> <br />
						</>
					) : null}
					{rec?.tenTruong ? (
						<>
							- Trường đã học: <b>{rec?.tenTruong}</b> <br />
						</>
					) : null}
					{rec?.diemHe10 ? (
						<>
							- Điểm hệ 10: <b>{rec?.diemHe10}</b> <br />
						</>
					) : null}
					{rec?.diemHe4 ? (
						<>
							- Điểm hệ 4: <b>{rec?.diemHe4}</b> <br />
						</>
					) : null}
					{rec?.diemChu ? (
						<>
							- Điểm chữ: <b>{rec?.diemChu}</b> <br />
						</>
					) : null}
					{rec.urlsHocPhan ? (
						<>
							- Minh chứng:{' '}
							{rec?.urlsHocPhan
								?.map((item) => (
									<a href={item} key={item}>
										Xem tệp tin
									</a>
								))
								.join(', ')}
						</>
					) : null}
				</>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip='Chỉnh sửa'
						type='link'
						onClick={() => (setRecMinhChung(rec), handleEdit(rec))}
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => onDelete(rec.index - 1)}
						title='Bạn có chắc chắn muốn xóa minh chứng này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
			hide: isView,
		},
	];

	return (
		<>
			<div className='fw500' style={{ marginTop: 8, marginBottom: 8 }}>
				Danh sách minh chứng
			</div>

			<TableStaticData
				data={record?._id ? danhSach : value}
				columns={columns}
				size='small'
				addStt
				otherProps={{ pagination: false }}
			>
				<ButtonExtend icon={<PlusCircleOutlined />} hidden={isView} onClick={() => setVisibleForm(true)} size='small'>
					Thêm mới
				</ButtonExtend>
			</TableStaticData>

			<Modal
				title='Thêm mới minh chứng'
				open={visibleForm}
				width={800}
				footer={null}
				onCancel={() => (setVisibleForm(false), setRecMinhChung(''))}
			>
				<FormMinhChungQuyDoiDiem
					onOk={onAdd}
					recMinhChung={recMinhChung}
					setRecMinhChung={setRecMinhChung}
					getData={() => {
						getData();
						if (getDataExternal) getDataExternal();
					}}
				/>
			</Modal>
		</>
	);
};

export default FormItemMinhChungQuyDoi;
