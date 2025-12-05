"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  const handleLogin = () => signIn("hydra");
  const handleLogout = () => signOut({ callbackUrl: "/" });

  if (status === "loading") {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center" }}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: "1rem", color: "#444" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>OAuth2 Client Demo with NextAuth</h1>

        {session ? (
          <div style={{ width: "100%", textAlign: "center" }}>
            <div style={styles.sessionBox}>
              <p style={styles.sessionHeader}>✓ Authenticated with NextAuth</p>

              {session.user?.name && (
                <p style={styles.sessionText}>Name: {session.user.name}</p>
              )}
              {session.user?.email && (
                <p style={styles.sessionText}>Email: {session.user.email}</p>
              )}

              {"id" in session.user && (
                <p style={styles.sessionId}>ID: {session.user.id}</p>
              )}

              {(session as any).error && (
                <p style={styles.error}>
                  ⚠️{" "}
                  {(session as any).error === "RefreshAccessTokenError"
                    ? "Session expired. Please log in again."
                    : (session as any).error}
                </p>
              )}
            </div>

            <div style={styles.buttonColumn}>
              <a href="/profile" style={styles.primaryButton}>
                View Profile
              </a>

              <a href="/protected" style={styles.secondaryButton}>
                Protected Page (Test Refresh)
              </a>

              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <button onClick={handleLogin} style={styles.primaryButton}>
              Login with OAuth2
            </button>

            <a href="/login" style={styles.link}>
              Or go to login page
            </a>
          </>
        )}

        <p style={styles.footerText}>
          This demo uses NextAuth.js with a custom Hydra OAuth2 provider.
          <br />
          Includes automatic token refresh and PKCE support.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   ESTILOS PROFESIONALES
--------------------------------------------------- */

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#f4f5f7",
    padding: "2rem",
  },

  card: {
    background: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.2rem",
    boxShadow:
      "0 4px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)",
    border: "1px solid #e5e7eb",
  },

  title: {
    fontSize: "1.7rem",
    fontWeight: 700,
    color: "#111827",
    textAlign: "center",
    margin: 0,
  },

  sessionBox: {
    padding: "1.2rem",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    marginBottom: "1rem",
  },

  sessionHeader: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#166534",
    marginBottom: "0.5rem",
  },

  sessionText: {
    fontSize: "0.9rem",
    color: "#374151",
    margin: "0.25rem 0",
  },

  sessionId: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.5rem",
    wordBreak: "break-all",
  },

  error: {
    fontSize: "0.8rem",
    color: "#dc2626",
    marginTop: "0.5rem",
  },

  buttonColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },

  primaryButton: {
    padding: "0.7rem 1.2rem",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "6px",
    textDecoration: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
    border: "none",
    textAlign: "center",
    transition: "background-color 0.2s",
  },

  secondaryButton: {
    padding: "0.7rem 1.2rem",
    backgroundColor: "#f9fafb",
    color: "#374151",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    textDecoration: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
    textAlign: "center",
    transition: "background-color 0.2s",
  },

  logoutButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "white",
    color: "#dc2626",
    border: "1px solid #fca5a5",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
  },

  link: {
    fontSize: "0.9rem",
    color: "#2563eb",
    textDecoration: "none",
  },

  footerText: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "1rem",
    textAlign: "center",
  },

  spinner: {
    display: "inline-block",
    width: "2rem",
    height: "2rem",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
