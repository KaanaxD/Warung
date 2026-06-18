import { describe, beforeEach, it, vi, Mock, expect } from "vitest"
import logService from "./logs.service"

vi.mock("../repository/logs.repository", () => ({
    default: vi.fn()
}))

import logRepository from "../repository/logs.repository"

const mockGetAllLogs = vi.fn()
const mockGetLogsById = vi.fn()
const mockGetLogsByItemId = vi.fn()

function mockRepo() {
    ;(logRepository as Mock).mockReturnValue({
        getAllLogs: mockGetAllLogs,
        getLogsById: mockGetLogsById,
        getLogsByItemId: mockGetLogsByItemId,
    })
}

describe("logService", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockRepo()
    })

    describe("allLog", () => {
        it("returns paginated logs", async () => {
            const expected = { logs: [], pagination: { page: 1, limit: 10, totalItem: 0, totalPages: 0 } }
            mockGetAllLogs.mockResolvedValue(expected)

            const result = await (await logService()).allLog(1, 10)

            expect(mockGetAllLogs).toHaveBeenCalledWith(1, 10)
            expect(result).toEqual(expected)
        })
    })

    describe("log", () => {
        it("returns log when found", async () => {
            const log = { id: 1, admin_name: "admin", item_id: 1, action: "CREATE", old_data: null, new_data: null, updated_at: "" }
            mockGetLogsById.mockResolvedValue([log])

            const result = await (await logService()).log(1)

            expect(mockGetLogsById).toHaveBeenCalledWith(1)
            expect(result).toEqual(log)
        })

        it("throws 404 when not found", async () => {
            mockGetLogsById.mockResolvedValue(null)

            await expect((await logService()).log(999)).rejects.toMatchObject({
                status: 404,
                message: "log tidak ditemukan"
            })
        })
    })

    describe("itemLog", () => {
        it("returns log for item id", async () => {
            const log = { id: 1, admin_name: "admin", item_id: 1, action: "CREATE", old_data: null, new_data: null, updated_at: "" }
            mockGetLogsByItemId.mockResolvedValue([log])

            const result = await (await logService()).itemLog(1)

            expect(mockGetLogsByItemId).toHaveBeenCalledWith(1)
            expect(result).toEqual(log)
        })

        it("throws 404 when not found", async () => {
            mockGetLogsByItemId.mockResolvedValue(null)

            await expect((await logService()).itemLog(999)).rejects.toMatchObject({
                status: 404,
                message: "log tidak ditemukan"
            })
        })
    })
})
