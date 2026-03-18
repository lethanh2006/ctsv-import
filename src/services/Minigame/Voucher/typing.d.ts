import { ETrangThaiVoucher } from "./constant";

export module MVoucher {
    interface ICauHinhVoucherDto {
        _id: string;
        ten: string;
        moTa?: string;
        giamGia: number;
        ngayHetHan?: string;
        trangThai: ETrangThaiVoucher;
    }
}
 