import { describe, it, vi, expect } from "vitest"
import { webpConvert } from "./imgConvert"

vi.mock("sharp", () => ({
    default: vi.fn(() => ({
        resize: vi.fn(() => ({
            webp: vi.fn(() => ({
                toFile: vi.fn().mockResolvedValue(undefined)
            }))
        }))
    }))
}))

vi.mock("fs-extra", () => ({
    default: { removeSync: vi.fn() }
}))

vi.mock("../middlewares/errorHandler", () => ({
    createError: vi.fn((status, message) => {
        const err: any = new Error(message)
        err.status = status
        throw err
    })
}))

import sharp from "sharp"
import fs from "fs-extra"

describe("webpConvert", () => {
    it("converts .jpg to .webp and removes original", async () => {
        const result = await webpConvert("uploads\\test.jpg")

        expect(sharp).toHaveBeenCalledWith("uploads\\test.jpg")
        expect(fs.removeSync).toHaveBeenCalledWith("uploads\\test.jpg")
        expect(result).toBe("test.webp")
    })

    it("converts .png to .webp", async () => {
        const result = await webpConvert("uploads\\test.png")

        expect(sharp).toHaveBeenCalledWith("uploads\\test.png")
        expect(result).toBe("test.webp")
    })

    it("converts .jpeg to .webp", async () => {
        const result = await webpConvert("uploads\\test.jpeg")

        expect(sharp).toHaveBeenCalledWith("uploads\\test.jpeg")
        expect(result).toBe("test.webp")
    })

    it("throws 400 for unsupported format and removes file", async () => {
        await expect(webpConvert("uploads\\test.gif")).rejects.toMatchObject({
            status: 400,
            message: "format lu salah"
        })
        expect(fs.removeSync).toHaveBeenCalledWith("uploads\\test.gif")
    })

    it("throws error when sharp fails", async () => {
        const mockSharp = vi.mocked(sharp)
        ;(mockSharp as unknown as Mock).mockImplementationOnce(() => ({
            resize: vi.fn(() => ({
                webp: vi.fn(() => ({
                    toFile: vi.fn().mockRejectedValue(new Error("sharp error"))
                }))
            }))
        }))

        await expect(webpConvert("uploads\\test.jpg")).rejects.toThrow("sharp error")
    })
})
