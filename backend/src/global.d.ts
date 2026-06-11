import { JwtPayload } from "jsonwebtoken";

declare global {
    interface LoginBody {
        username: string;
        password: string;
    }

    interface ResBody{
        success: boolean,
        message: string,
        token?: string
        data?: any,
    }

    interface Item{
        id:number;
        nama:string;
        kategori:string;
        updated_at:Date | string;
        img_address:string
    }

    interface ItemPagination{
        items: Item[]
        pagination : {
            page:number
            limit: number
            totalItem: number
            totalPages: number
        }
    }

    interface ReqParams{
        id:number
    }   

    interface AdminPayload extends JwtPayload{
        username: string
    }

    namespace Express{
        interface Request{
            admin?: AdminPayload
        }
    }


}

export = {}