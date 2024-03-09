export default function authHeader(type: string | null = null) {
  // @ts-ignore
  let user = JSON.parse(localStorage.getItem("user"));
  // const user = JSON.parse(localStorage.getItem("user") ?? "");
  // const userJson = localStorage.getItem("user");
  // const user = userJson !== null ? JSON.parse(userJson) : null;

  if (user && user.token) {
    if (type === "multipart") {
      return { Authorization: "Bearer " + user.token, "Content-Type": "multipart" };
    }
    return { Authorization: "Bearer " + user.token };
  } else {
    return {};
  }
}
