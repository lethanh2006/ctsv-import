import { ETrangThaiQuay } from "./constant";

export module MLichSuQuay {
    interface IRecord {
        _id: string;
        ssoId: string;
        ngayQuay: string;
        tenVongQuay: string;
        trangThaiQuay: ETrangThaiQuay;
        voucherNguoiDung: VoucherNguoiDung;
        hoTen: string;
        ma: string;
    }
}