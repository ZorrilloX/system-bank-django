import apiClient from "./apiClient";

export class UserService {
  static async getPerfil() {
    const response = await apiClient.get("/usuarios/perfil/");
    return response.data;
  }

  static async updatePerfil(data: any) {
    const response = await apiClient.put("/usuarios/perfil/", data);
    return response.data;
  }
}
