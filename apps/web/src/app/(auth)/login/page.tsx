"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginSchema } from "@nexio/validations";
import { authApi, apiClient } from "@/lib/api";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[String(err.path[0])] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login(result.data);
      apiClient.setToken(response.accessToken);
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      router.push("/dashboard");
    } catch (err) {
      setError("Credenciales inválidas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Iniciar sesión
      </h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          textAlign: "center",
          marginBottom: 24,
          fontSize: 14,
        }}
      >
        Ingresa a tu panel de coaching
      </p>

      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "var(--radius-input)",
              border: `1px solid ${fieldErrors.email ? "var(--color-danger)" : "var(--color-border)"}`,
              fontSize: 14,
              outline: "none",
            }}
          />
          {fieldErrors.email && (
            <span
              style={{
                color: "var(--color-danger)",
                fontSize: 12,
                marginTop: 4,
                display: "block",
              }}
            >
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "var(--radius-input)",
              border: `1px solid ${fieldErrors.password ? "var(--color-danger)" : "var(--color-border)"}`,
              fontSize: 14,
              outline: "none",
            }}
          />
          {fieldErrors.password && (
            <span
              style={{
                color: "var(--color-danger)",
                fontSize: 12,
                marginTop: 4,
                display: "block",
              }}
            >
              {fieldErrors.password}
            </span>
          )}
        </div>

        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <Link
            href="/forgot-password"
            style={{ fontSize: 13, color: "var(--color-primary)", textDecoration: "none" }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "var(--color-primary)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-button)",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: 16,
          fontSize: 14,
          color: "var(--color-text-secondary)",
        }}
      >
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          style={{ color: "var(--color-primary)", textDecoration: "none" }}
        >
          Regístrate
        </Link>
      </p>
    </>
  );
}
