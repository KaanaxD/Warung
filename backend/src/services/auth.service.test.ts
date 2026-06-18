import { describe, beforeEach, afterAll, it, vi, expect } from "vitest"
import { verifyUser } from "./auth.service"

vi.mock("jsonwebtoken", () => ({
    sign: vi.fn(() => "mock-token")
}))

describe("verifyUser", () => {
    const OLD_ENV = process.env

    beforeEach(() => {
        vi.clearAllMocks()
        process.env = { ...OLD_ENV, ADMIN_USERNAME: "admin", ADMIN_PASS: "pass", JWT_SECRET: "secret" }
    })

    afterAll(() => {
        process.env = OLD_ENV
    })

    it("returns token on valid credentials", () => {
        const result = verifyUser("admin", "pass")
        expect(result).toBe("mock-token")
    })

    it("throws 401 on wrong username", () => {
        expect(() => verifyUser("wrong", "pass")).toThrow("username atau password salah")
    })

    it("throws 401 on wrong password", () => {
        expect(() => verifyUser("admin", "wrong")).toThrow("username atau password salah")
    })

    it("throws 401 on both wrong", () => {
        expect(() => verifyUser("wrong", "wrong")).toThrow("username atau password salah")
    })
})
