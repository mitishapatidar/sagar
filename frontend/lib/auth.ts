export function isLoggedIn() {
  if (typeof window === "undefined") {
    return false
  }

  return localStorage.getItem("auth") === "true"
}

export function login() {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth", "true")
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth")
  }
}