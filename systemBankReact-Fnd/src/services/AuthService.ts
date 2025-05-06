import apiClient from "./apiClient";

export class AuthService {
  static async login(username: string, password: string): Promise<unknown> {
    try {
      const response = await apiClient.post("token/", { username, password });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error("Error al iniciar sesión: " + error.message);
      }
      throw new Error("Error al iniciar sesión: An unknown error occurred");
    }
  }

  static logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  }
}
