import { createError } from "../middlewares/errorHandler";
import { deleteItemQuery, getAllQuery, getItemQuery, postItemQuery, putItemQuery } from "../models/itemModel";

export async function getAllItem(page:number = 1,limit:number = 10){
    const data = await getAllQuery(page,limit)
    return data
}

export async function findItemById(id:number){
    const data = await getItemQuery(id)
    if(data.length===0){
        throw createError(404,"item tidak ditemukan")
    }
    return data[0]
}

export async function insertItem(nama:string, kategori:string){
    const data = await postItemQuery(nama,kategori)
    return data[0]
}

export async function updateItem(id:number,nama?:string, kategori?:string){
    if(!nama && !kategori){
        throw createError(400,"tidak ada data yang diubah")
    }
    const data = await putItemQuery(id,nama,kategori)
    if(data.length===0){
        throw createError(404,"item tidak ditemukan")
    }
    return data[0]
}

export async function removeItem(id:number){
    const data = await deleteItemQuery(id)
    if(data.length===0){
        throw createError(404,"item tidak ditemukan")
    }
    return data[0]
}