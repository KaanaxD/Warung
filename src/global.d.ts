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
}

export = {}