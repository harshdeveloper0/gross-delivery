export function api(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-phone": typeof window !== "undefined"
        ? localStorage.getItem("phone")
        : "",
      ...(options.headers || {}),
    },
  });
}