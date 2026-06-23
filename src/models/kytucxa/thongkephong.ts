import useInitModel from '@/hooks/useInitModel';
import { KyTucXa } from '@/services/KyTucXa/typing';
import { ipCsvc } from '@/utils/ip';

export default () => {
    const objInit = useInitModel<KyTucXa.IThongKePhong>('thong-ke-ktx/phong', undefined, undefined, ipCsvc);

    const getThongKe = async (params: { maHocKy: string }) => {
        objInit.setLoading(true);
        try {
            const response = await objInit.getService(params as any, '');
            const data = response?.data?.data;
            if (data) {
                objInit.setRecord(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            objInit.setLoading(false);
        }
    };

    return {
        ...objInit,
        getThongKe,
    };
};
