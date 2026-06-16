import { JwtPayload } from "jsonwebtoken";
import { number } from "zod";

declare global {
    interface LoginBody {
        username: string;
        password: string;
    }

    interface ResBody {
        success: boolean,
        message: string,
        token?: string
        data?: any,
    }

    interface Item {
        id: number;
        nama: string;
        kategori: string;
        updated_at: Date | string;
        img_address: string
    }


    interface ItemPagination {
        items: Item[]
        pagination: {
            page: number
            limit: number
            totalItem: number
            totalPages: number
        }
    }

    interface Pagination {
        page: number,
        limit: number,
        totalItem: number,
        totalPages: number
    }

    interface ItemLog {
        id: number
        admin_name: string;
        item_id: number;
        action: string;
        old_data: Item | null;
        new_data: Item | null;
        updated_at: Date | string;
    }

    interface ItemLogPagination {
        logs: ItemLog[];
        pagination: {
            page: number;
            limit: number;
            totalItem: number;
            totalPages: number;
        }
    }

    interface ReqParams {
        item_id: number
        id: number
    }


    interface AdminPayload {
        username: string;
    }

    namespace Express {
        interface Request {
            admin: AdminPayload
        }
    }


}

export = {}