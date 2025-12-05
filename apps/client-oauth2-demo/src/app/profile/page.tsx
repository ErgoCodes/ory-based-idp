"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogout = () => signOut({ callbackUrl: "/" });

  if (status === "loading") {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center" }}>
          <div style={styles.spinner}></div>
          <p style={{ marginTop: "1rem", color: "#444" }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const initials =
    session.user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    session.user.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={styles.title}>User Profile</h1>
          <p style={styles.subtitle}>Your information from NextAuth + Hydra OAuth2</p>
        </div>

        {/* USER BOX */}
        <div style={styles.profileBox}>
          <div style={styles.avatarWrapper}>
            <div style={styles.avatar}>{initials}</div>
            <div>
              <h2 style={styles.name}>{session.user.name || "User"}</h2>
              <p style={styles.email}>{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div style={styles.detailsBox}>
          <h3 style={styles.sectionTitle}>Profile Details</h3>

          <div style={styles.detailsList}>
            <div>
              <p style={styles.label}>Subject ID</p>
              <p style={styles.value}>{session.user.id}</p>
            </div>

            {session.user.email && (
              <div>
                <p style={styles.label}>Email</p>
                <div style={styles.emailRow}>
                  <p style={styles.value}>{session.user.email}</p>
                  {session.user.emailVerified && (
                    <span style={styles.verifiedBadge}>✓ Verified</span>
                  )}
                </div>
              </div>
            )}

            {session.user.name && (
              <div>
                <p style={styles.label}>Full Name</p>
                <p style={styles.value}>{session.user.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div style={styles.buttonColumn}>
          <button
            onClick={() => router.push("/protected")}
            style={styles.primaryButton}
          >
            Go to Protected Page
          </button>

          <button
            onClick={() => router.push("/")}
            style={styles.secondaryButton}
          >
            Back to Home
          </button>

          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>

        {/* FOOTER INFO */}
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            <strong>💡 NextAuth Integration:</strong> This profile uses NextAuth.js session
            management with automatic token refresh using your provider's refresh token.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   ESTILOS PROFESIONALES (MATCH CON PROTECTED PAGE)
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
    background: "white",
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "620px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.07)",
    border: "1px solid #e5e7eb",
  },

  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    color: "#111827",
  },

  subtitle: {
    fontSize: "0.9rem",
    color: "#6b7280",
  },

  profileBox: {
    padding: "1.5rem",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    marginBottom: "2rem",
  },

  avatarWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  avatar: {
    width: "4rem",
    height: "4rem",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: 700,
    fontSize: "1.4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "0.25rem",
    color: "#111827",
  },

  email: {
    fontSize: "0.9rem",
    color: "#166534",
  },

  detailsBox: {
    padding: "1.5rem",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    marginBottom: "2rem",
  },

  sectionTitle: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  detailsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  label: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginBottom: "0.25rem",
  },

  value: {
    fontSize: "0.9rem",
    color: "#111827",
    fontFamily: "monospace",
    wordBreak: "break-all",
  },

  emailRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },

  verifiedBadge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "0.15rem 0.6rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 500,
  },

  buttonColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
    marginBottom: "2rem",
  },

  primaryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
  },

  secondaryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
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

  infoBox: {
    padding: "1.2rem",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "10px",
  },

  infoText: {
    fontSize: "0.8rem",
    color: "#1e40af",
    lineHeight: 1.5,
  },

  spinner: {
    display: "inline-block",
    width: "2rem",
    height: "2rem",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
