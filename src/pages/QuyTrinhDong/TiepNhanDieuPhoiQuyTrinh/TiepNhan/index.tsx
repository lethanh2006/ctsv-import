import TableTiepNhanDieuPhoi from '@/pages/QuyTrinhDong/TiepNhanDieuPhoiQuyTrinh/components/TableTiepNhanDieuPhoi';
import ThongTinTongHop from '@/pages/QuyTrinhDong/TiepNhanDieuPhoiQuyTrinh/components/ThongTinTongHop/ThongTinTongHop';
import { useIntl } from 'umi';

const TiepNhan = () => {
	const intl = useIntl();
	return (
		<>
			<ThongTinTongHop type={'tiep_nhan'}>
				<TableTiepNhanDieuPhoi
					title={intl.formatMessage({ id: 'dichvuhanhchinh.tiepnhan.title' })}
					type={'tiep_nhan'}
				/>
			</ThongTinTongHop>
		</>
	);
};
export default TiepNhan;
