let API_URL = "http://54.205.32.110:8888/api/"; // replace this your deployment address and port

if (import.meta.env.MODE === "development") {
  API_URL = "http://127.0.0.1:8000/api/";
}

export default API_URL;

// 54.205.32.110
//
