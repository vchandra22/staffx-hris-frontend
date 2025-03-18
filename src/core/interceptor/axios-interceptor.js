import axios from 'axios';
import { showErrorToast, showConfirmationDialog } from '@/helpers/alert';
import { useAuthStore } from "@/state/pinia";
import app from "../main"; // import the instance
export function axiosInterceptors() {
  const auth = useAuthStore();

  axios.interceptors.request.use(config => {
      const token = auth.getToken();

      if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
      }

      if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json';
      }

      config.headers['Accept'] = 'application/json';

      app.$Progress.start(); // Memulai progress bar sebelum request dikirim

      return config;
  }, error => {
      app.$Progress.fail(); // Progress merah jika request error
      showErrorToast('Request Error', 'Terjadi kesalahan pada request');
      return Promise.reject(error);
  });

  axios.interceptors.response.use(response => {
      app.$Progress.finish(); // Selesaikan progress jika request berhasil
      return response;
  }, async error => {
      app.$Progress.fail(); // Progress merah jika response error

      if (error.response && [403, 401].includes(error.response.status)) {
          const confirmed = await showConfirmationDialog(
              'Ooops',
              error.response.data.errors[0] || 'Terjadi kesalahan pada response'
          );
          if (confirmed) {
              await auth.logout();
              window.location.reload();
          }
      } else {
          showErrorToast('Error', 'Terjadi kesalahan pada response');
      }

      return Promise.reject(error);
  });
}
