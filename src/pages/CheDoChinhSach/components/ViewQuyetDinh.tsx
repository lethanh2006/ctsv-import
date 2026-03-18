import ViewRender from '@/pages/QuyTrinhDong/QuanLyQuyTrinh/components/MauDon/ViewRender';
import { EKieuDuLieu, ETextDisplay } from '@/services/QuyTrinhDong/LoaiHinh/constants';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';

const ViewQuyetDinh = () => {
	const intl = useIntl();
	const { record } = useModel('chedochinhsach.chedochinhsach');
	const { record: recordQuyetDinh } = useModel('chedochinhsach.quyetdinhchedosinhvien');

	const buildItem = (label: string, value: any) => (
		<div
			style={{
				display: 'flex',
			}}
		>
			<div style={{ marginRight: 4 }}>
				<b>{label}: </b>
			</div>
			<div>{value}</div>
		</div>
	);

	return (
		<Row gutter={[0, 10]}>
			<Col sm={12} md={8}>
				{buildItem(intl.formatMessage({ id: 'kyluatkhenthuong.id.hovaten' }), recordQuyetDinh?.hoVaTen)}
			</Col>
			<Col sm={12} md={8}>
				{buildItem(intl.formatMessage({ id: 'kyluatkhenthuong.id.masv' }), recordQuyetDinh?.maSinhVien)}
			</Col>
			<Col sm={12} md={8}>
				{buildItem(intl.formatMessage({ id: 'kyluatkhenthuong.id.lop' }), recordQuyetDinh?.lop.ten)}
			</Col>
			<Col sm={12} md={8}>
				{buildItem(intl.formatMessage({ id: 'kyluatkhenthuong.id.nganh' }), recordQuyetDinh?.nganh.ten)}
			</Col>
			<Col sm={12} md={8}>
				{buildItem(
					intl.formatMessage({ id: 'kyluatkhenthuong.id.ngaysinh' }),
					recordQuyetDinh?.ngaySinh ? dayjs(recordQuyetDinh.ngaySinh).format('DD/MM/YYYY') : '',
				)}
			</Col>
			<Col sm={12} md={8}>
				{buildItem(intl.formatMessage({ id: 'kyluatkhenthuong.id.gioitinh' }), recordQuyetDinh?.gioiTinh)}
			</Col>
			<Col sm={12} md={8}>
				{buildItem(intl.formatMessage({ id: 'kyluatkhenthuong.id.dantoc' }), recordQuyetDinh?.danToc)}
			</Col>
			{record?.danhSachCauHinhThongTin.map((item) => {
				if (
					!item?.truongThongTinLienQuan ||
					(item?.truongThongTinLienQuan &&
						(recordQuyetDinh?.thongTinQuyetDinh?.[item?.truongThongTinLienQuan]?.value === item?.giaTriLienQuan ||
							(item.giaTriLienQuan.includes &&
								item?.giaTriLienQuan?.includes(
									recordQuyetDinh?.thongTinQuyetDinh?.[item?.truongThongTinLienQuan]?.value,
								))))
				) {
					const isTable = item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH;
					const isHtml = item.kieuDuLieu === EKieuDuLieu.TEXT && item.textDisplay === ETextDisplay.TEXT_EDITOR;
					const isDoanVanBan = item.kieuDuLieu === EKieuDuLieu.DOAN_VAN_BAN;

					return (
						<Col key={item.ma} xs={24} sm={24} md={item.colspan || 24} lg={item.colspan || 24}>
							<div
								style={{
									display: 'flex',
									flexDirection: isHtml || isTable ? 'column' : 'row',
								}}
							>
								<div style={{ marginRight: 4 }}>
									<b>{item.ten}: </b>
								</div>
								<div>
									{isDoanVanBan ? (
										item.ten
									) : (
										<ViewRender
											cauHinh={item}
											recordSanPham={{
												thongTinKhaiBao: recordQuyetDinh?.thongTinQuyetDinh,
											}}
										/>
									)}
								</div>
							</div>
						</Col>
					);
				} else return null;
			})}
		</Row>
	);
};

export default ViewQuyetDinh;
