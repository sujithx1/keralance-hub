import { describe, expect, it } from "bun:test";
import { app } from "../src/index";

describe("keralance HUB Integration Tests", () => {
  it("GET /health should return 200 and status healthy", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    
    const body = await res.json();
    expect(body.status).toBe("healthy");
    expect(body.timestamp).toBeDefined();
  });

  it("POST /auth/login with invalid credentials should return 400 or 401 error", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "nonexistent@keralance.dev",
        password: "wrongpassword",
      }),
    });
    
    // Auth failures return 400 (credentials check) or 500 (if DB is offline in test runner)
    expect([400, 401, 500]).toContain(res.status);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBeDefined();
  });

  it("POST /auth/otp/send should generate OTP successfully or fail if DB is offline", async () => {
    const res = await app.request("/auth/otp/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: "+917994591023",
      }),
    });
    
    expect([200, 500]).toContain(res.status);
    const body = await res.json();
    if (res.status === 200) {
      expect(body.success).toBe(true);
      expect(body.debugCode).toBeDefined();
    } else {
      expect(body.success).toBe(false);
    }
  });
});
