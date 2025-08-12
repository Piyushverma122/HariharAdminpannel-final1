// services/apiService.ts

import { getApiBaseUrl } from '../config/apiConfig';

// Base API configuration
const API_BASE_URL = getApiBaseUrl();

// Generic API response interface
interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request function
async function makeApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP error! Status: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors or other issues
    throw new ApiError(
      'Network error. Please check your connection and try again.',
      0,
      error
    );
  }
}

// Admin login interface
export interface AdminLoginRequest {
  admin_id: string;
  password: string;
}

export interface AdminLoginResponse {
  admin_id: number;
}

// Student interface (based on database schema)
export interface Student {
  name: string;
  employee_id: string;
  school_name: string;
  class: string;
  name_of_tree: string;
  plant_image: string;
  certificate: string;
  date_time: string;
  udise_code: string;
}

// School interface (based on database schema)
export interface School {
  sno: number;
  district_code: string;
  district_name: string;
  block_name: string;
  block_code: string;
  cluster_code: string;
  cluster_name: string;
  udise_code: string;
  school_name: string;
  password: string;
}

// API Service class
export class ApiService {
  // Admin Authentication
  static async adminLogin(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await makeApiRequest<AdminLoginResponse>('/admin_login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (!response.status) {
      throw new ApiError(response.message, 401);
    }

    return response.data!;
  }

  // School Management
  static async getAllSchools(): Promise<School[]> {
    const response = await makeApiRequest<School[]>('/fetch_school', {
      method: 'GET',
    });

    if (!response.status) {
      throw new ApiError(response.message, 400);
    }

    return response.data || [];
  }

  // Student Management
  static async getAllStudents(): Promise<Student[]> {
    const response = await makeApiRequest<Student[]>('/fetch_student', {
      method: 'GET',
    });

    if (!response.status) {
      throw new ApiError(response.message, 400);
    }

    return response.data || [];
  }

  static async getStudentsByUdiseCode(udiseCode: string): Promise<Student[]> {
    const response = await makeApiRequest<Student[]>('/fetch_student', {
      method: 'POST',
      body: JSON.stringify({ udise_code: udiseCode }),
    });

    if (!response.status) {
      throw new ApiError(response.message, 400);
    }

    return response.data || [];
  }

  // Get student count for a specific UDISE code
  static async getStudentCountByUdiseCode(udiseCode: string): Promise<{ count: number; school_name: string | null }> {
    const response = await makeApiRequest<{ COUNT: number; school_name: string | null }>('/teacher_dashboard', {
      method: 'POST',
      body: JSON.stringify({ udise_code: udiseCode }),
    });

    if (!response.status) {
      throw new ApiError(response.message, 400);
    }

    return {
      count: response.data?.COUNT || 0,
      school_name: response.data?.school_name || null,
    };
  }

  // File Management
  static getImageUrl(filename: string): string {
    // Handle empty/undefined values safely
    if (!filename) return '';

    // Normalize path:
    // 1) Convert backslashes to forward slashes (Windows paths)
    // 2) Remove leading 'uploads/' if present (case-insensitive)
    // 3) Ensure we only send the base filename since backend route doesn't accept slashes
    let clean = filename.trim().replace(/\\/g, '/');
    clean = clean.replace(/^uploads\//i, '');

    // Extract just the basename (in case any subpath remains)
    const baseName = (clean.split('/').pop() || clean).trim();

    // Build the final URL to the Flask uploads endpoint
    return `${API_BASE_URL}/uploads/${encodeURIComponent(baseName)}`;
  }

  static async getUploadedFile(filename: string): Promise<Blob> {
    // Remove 'uploads/' prefix if it exists in the filename since the endpoint already includes it
    const cleanFilename = filename.startsWith('uploads/') ? filename.substring(8) : filename;
    const response = await fetch(`${API_BASE_URL}/uploads/${cleanFilename}`);
    
    if (!response.ok) {
      throw new ApiError(`Failed to fetch file: ${filename}`, response.status);
    }

    return response.blob();
  }

  // Dashboard/Statistics
  static async getDashboardStats(): Promise<{
    totalStudents: number;
    totalSchools: number;
    totalBlocks: number;
    totalClusters: number;
  }> {
    try {
      const response = await makeApiRequest<{
        total_students: number;
        total_schools: number;
        total_blocks: number;
        total_clusters: number;
      }>('/web_dashboard', {
        method: 'GET',
      });

      if (!response.status) {
        throw new ApiError(response.message, 400);
      }

      // Backend returns data at root level, not nested in 'data' field
      const data = response as any; // Cast to access root level properties
      
      return {
        totalStudents: data.total_students || 0,
        totalSchools: data.total_schools || 0,
        totalBlocks: data.total_blocks || 0,
        totalClusters: data.total_clusters || 0,
      };
    } catch (error) {
      throw new ApiError('Failed to fetch dashboard statistics', 500, error);
    }
  }

  // Re-upload Statistics
  static async getReuploadStats(): Promise<{
    neverReuploaded: number;
    pendingReupload: number;
    reuploadDue: number;
  }> {
    try {
      const response = await makeApiRequest<{
        never_reuploaded_count: number;
        pending_reupload_count: number;
        reupload_due_count: number;
      }>('/reupload_stats', {
        method: 'GET',
      });

      if (!response.status) {
        throw new ApiError(response.message, 400);
      }

      const data = response as any;
      
      return {
        neverReuploaded: data.never_reuploaded_count || 0,
        pendingReupload: data.pending_reupload_count || 0,
        reuploadDue: data.reupload_due_count || 0,
      };
    } catch (error) {
      throw new ApiError('Failed to fetch reupload statistics', 500, error);
    }
  }

  // Utility function to validate UDISE code format (if needed)
  static validateUdiseCode(udiseCode: string): boolean {
    // Basic validation - adjust according to your UDISE code format
    return Boolean(udiseCode && udiseCode.trim().length > 0);
  }
}

export default ApiService;
