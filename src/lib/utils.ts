export function getSessionId() {
  if (typeof window === "undefined") return "server";
  let sessionId = localStorage.getItem("rayabiglobal_session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("rayabiglobal_session_id", sessionId);
  }
  return sessionId;
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(amount);
}
