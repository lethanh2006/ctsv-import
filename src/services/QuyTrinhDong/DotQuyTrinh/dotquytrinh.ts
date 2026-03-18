import axios from "axios";
import {ip3} from "@/utils/ip";

export const activeDot = (dotId: string) =>
  axios.put(`${ip3}/dot-quy-trinh-dong/${dotId}/active/switch`);
