const APP_URL = "https://coupang-growth-inbound-automation.vercel.app";
const APP_HOST = "coupang-growth-inbound-automation.vercel.app";

const statusEl = document.getElementById("status");
const btn = document.getElementById("send");

function setStatus(msg, kind) {
  statusEl.textContent = msg;
  statusEl.className = kind || "";
}

function mapSameSite(value) {
  switch (value) {
    case "no_restriction":
      return "None";
    case "strict":
      return "Strict";
    case "lax":
      return "Lax";
    default:
      return "Lax";
  }
}

async function collectShoplingCookies() {
  const cookies = await chrome.cookies.getAll({ domain: "shopling.co.kr" });
  return cookies.map((c) => ({
    name: c.name,
    value: c.value,
    domain: c.domain,
    path: c.path || "/",
    expires: typeof c.expirationDate === "number" ? c.expirationDate : -1,
    httpOnly: !!c.httpOnly,
    secure: !!c.secure,
    sameSite: mapSameSite(c.sameSite),
  }));
}

function base64UrlDecodeToString(b64url) {
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}

// 앱 도메인의 모든 sb-*-auth-token(청크 포함) 쿠키에서 access_token 추출.
// 진단을 위해 { token, diag } 반환.
async function getAppAccessToken() {
  const all = await chrome.cookies.getAll({ domain: APP_HOST });
  const auth = all.filter((c) => /^sb-.*-auth-token(\.\d+)?$/.test(c.name));
  const diag = {
    appCookieCount: all.length,
    authCookieNames: auth.map((c) => c.name),
  };
  if (auth.length === 0) return { token: null, diag };

  auth.sort((a, b) => {
    const pa = a.name.split(".");
    const pb = b.name.split(".");
    const na = /^\d+$/.test(pa[pa.length - 1]) ? Number(pa[pa.length - 1]) : -1;
    const nb = /^\d+$/.test(pb[pb.length - 1]) ? Number(pb[pb.length - 1]) : -1;
    return na - nb;
  });

  let raw = auth.map((c) => c.value).join("");
  try {
    raw = decodeURIComponent(raw);
  } catch {
    /* ignore */
  }

  let jsonStr = raw;
  if (raw.startsWith("base64-")) {
    try {
      jsonStr = base64UrlDecodeToString(raw.slice("base64-".length));
    } catch (e) {
      diag.decodeError = "base64 decode 실패";
      return { token: null, diag };
    }
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    diag.decodeError = "JSON parse 실패";
    return { token: null, diag };
  }
  const token = Array.isArray(parsed)
    ? parsed[0] || null
    : parsed.access_token || null;
  diag.tokenFound = !!token;
  return { token, diag };
}

async function run() {
  btn.disabled = true;
  setStatus("세션 수집 중...");
  try {
    const { token, diag } = await getAppAccessToken();
    const shoplingCookies = await collectShoplingCookies();

    if (!token) {
      setStatus(
        "앱 로그인 토큰을 못 찾았습니다.\n진단: " +
          JSON.stringify(diag) +
          "\n(앱에 로그인했는지, 같은 크롬 프로필인지 확인)",
        "err",
      );
      return;
    }
    if (shoplingCookies.length === 0) {
      setStatus(
        "샵플링 쿠키가 없습니다. 샵플링 WMS에 로그인했는지 확인해 주세요.",
        "err",
      );
      return;
    }

    setStatus(
      `전송 중... (앱 토큰 OK, 샵플링 쿠키 ${shoplingCookies.length}개)`,
    );
    const res = await fetch(
      `${APP_URL}/api/automation/shopling-negative-stock/session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storageState: { cookies: shoplingCookies, origins: [] },
        }),
      },
    );
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      const exp = data.data?.expiresAt
        ? new Date(data.data.expiresAt).toLocaleString("ko-KR")
        : "";
      setStatus(`✅ 세션 전송 완료. 만료: ${exp}`, "ok");
    } else {
      setStatus(
        `❌ 서버 응답 ${res.status}: ${data.error || "알 수 없는 오류"}`,
        "err",
      );
    }
  } catch (e) {
    setStatus(`❌ 오류: ${e.message}`, "err");
  } finally {
    btn.disabled = false;
  }
}

btn.addEventListener("click", run);
