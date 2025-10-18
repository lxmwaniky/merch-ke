import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor - add auth token and session ID
    this.client.interceptors.request.use(
      (config) => {
        // Add JWT token if available
        const token = this.getToken();
        console.log("🔑 Request to:", config.url, "| Token:", token ? "EXISTS" : "MISSING");
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("✅ Added Authorization header");
        }

        // Add session ID for guest users (if no token)
        if (!token) {
          const sessionId = this.getSessionId();
          if (sessionId) {
            config.headers["X-Session-ID"] = sessionId;
            console.log("✅ Added Session ID header");
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          const requestUrl = error.config?.url || '';
          console.log("❌ 401 Error on:", requestUrl);
          
          // Only clear token for authentication-related endpoints
          // Don't clear token for optional operations like cart migration
          const authEndpoints = ['/api/auth/login', '/api/auth/register', '/api/auth/profile'];
          const isAuthEndpoint = authEndpoints.some(endpoint => requestUrl.includes(endpoint));
          
          if (isAuthEndpoint) {
            console.log("🗑️ Auth endpoint failed - clearing token and redirecting");
            this.clearToken();
            if (typeof window !== "undefined") {
              const currentPath = window.location.pathname;
              if (!currentPath.startsWith("/auth/")) {
                window.location.href = "/auth/login";
              }
            }
          } else {
            console.log("⚠️ Non-auth endpoint failed with 401 - keeping token");
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  // Session ID management for guest users
  getSessionId(): string | null {
    if (typeof window === "undefined") return null;
    let sessionId = localStorage.getItem("guest_session_id");
    
    // Generate session ID if it doesn't exist
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem("guest_session_id", sessionId);
    }
    
    return sessionId;
  }

  clearSessionId(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("guest_session_id");
    }
  }

  private generateSessionId(): string {
    return `guest-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  // Get the axios instance for making requests
  getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export default apiClient.getInstance();
