import TableTiepNhanDieuPhoi from '@/pages/QuyTrinhDong/TiepNhanDieuPhoiQuyTrinh/components/TableTiepNhanDieuPhoi';
import ThongTinTongHop from '@/pages/QuyTrinhDong/TiepNhanDieuPhoiQuyTrinh/components/ThongTinTongHop/ThongTinTongHop';
import '../components/style.less';
const DieuPhoi = () => {
	return (
		<>
			<ThongTinTongHop type={'dieu_phoi'}>
				<TableTiepNhanDieuPhoi title={'Điều phối'} type={'dieu_phoi'} />
			</ThongTinTongHop>
		</>
	);
};
export default DieuPhoi;
