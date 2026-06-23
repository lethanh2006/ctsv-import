import useInitModel from '@/hooks/useInitModel';
import { ipCsvc } from '@/utils/ip';
import axios from '@/utils/axios';

export default () => {
    const objInit = useInitModel<any>('thong-ke-ktx', undefined, undefined, ipCsvc);

    const getThongKeDotChiTiet = (params?: any, headers?: any) => {
        return axios.get(`${ipCsvc}/thong-ke-ktx/dot-chi-tiet`, { params, headers });
    };
    const getThongKeDotTongQuan = (params?: any, headers?: any) => {
        return axios.get(`${ipCsvc}/thong-ke-ktx/dot-tong-quan`, { params, headers });
    };
    const getThongKePhong = (params?: any, headers?: any) => {
        return axios.get(`${ipCsvc}/thong-ke-ktx/phong`, { params, headers });
    };


    return {
        ...objInit,
        getThongKeDotChiTiet,
        getThongKeDotTongQuan,
        getThongKePhong,
    };
};
