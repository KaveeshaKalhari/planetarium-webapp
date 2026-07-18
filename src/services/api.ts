import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle 401 unauthorized responses (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ============= INTERFACES =============

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string | null;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  role: "USER" | "ADMIN" | string | null;
  success: boolean;
  message: string;
  user: User | null;
  token: string | null;
}

// ============= AUTH FUNCTIONS =============

export const signUp = async (userData: SignUpData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      message: "Network error occurred",
      role: null,
      user: null,
      token: null,
    };
  }
};

export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Network error occurred",
      role: null,
      user: null,
      token: null,
    };
  }
};

export const googleAuth = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    return await response.json();
  } catch (error) {
    console.error("Google auth error:", error);
    return {
      success: false,
      message: "Google authentication failed",
      role: null,
      user: null,
      token: null,
    };
  }
};

// ─── BLOG INTERFACES ──────────────────────────────────────────────────────────

export interface BlogResponse {
  id: number;
  title: string;
  category: string;
  content: string;
  excerpt: string;
  imageUrl: string | null;
  status: string;
  authorName: string;
  authorEmail: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface BlogRequest {
  title: string;
  category: string;
  content: string;
  imageUrl?: string | null;
}

// ─── BLOG API FUNCTIONS ───────────────────────────────────────────────────────

export const submitBlog = async (
  request: BlogRequest,
): Promise<BlogResponse> => {
  const res = await api.post("/blogs", request);
  return res.data;
};

export const getApprovedBlogs = async (): Promise<BlogResponse[]> => {
  const res = await api.get("/blogs");
  return res.data;
};

export const getMyBlogs = async (): Promise<BlogResponse[]> => {
  const res = await api.get("/blogs/my");
  return res.data;
};

export const getPendingBlogs = async (): Promise<BlogResponse[]> => {
  const res = await api.get("/blogs/admin/pending");
  return res.data;
};

export const approveBlog = async (blogId: number): Promise<BlogResponse> => {
  const res = await api.put(`/blogs/admin/${blogId}/approve`);
  return res.data;
};

export const rejectBlog = async (
  blogId: number,
  reason?: string,
): Promise<BlogResponse> => {
  const res = await api.put(`/blogs/admin/${blogId}/reject`, {
    reason: reason || "",
  });
  return res.data;
};

export const deleteBlog = async (blogId: number): Promise<void> => {
  await api.delete(`/blogs/admin/${blogId}`);
};

// ── SHOW / AVAILABILITY ──────────────────────────────────────────────────────

export interface ShowDTO {
  id: number;
  title: string;
  description: string;
  showDate: string; // "2026-07-10"
  showTime: string; // "morning" | "afternoon"
  audienceType: string; // "School Program" | "Public Program"
  sessionType?: string;
  programType: string;
  language: string;
  grade: string | null;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  status: string;
  duration: number;
  bookedSeatIds: string[] | null;
}

export const getUpcomingShows = async (): Promise<ShowDTO[]> => {
  const res = await api.get("/shows");
  return res.data;
};

export const getShowById = async (id: number): Promise<ShowDTO> => {
  const res = await api.get(`/shows/${id}`);
  return res.data;
};

// Admin
export const getAllShowsAdmin = async (): Promise<ShowDTO[]> => {
  const res = await api.get("/shows/admin/all");
  return res.data;
};

export const createShow = async (show: Partial<ShowDTO>): Promise<ShowDTO> => {
  const res = await api.post("/shows/admin", show);
  return res.data;
};

export const updateShow = async (
  id: number,
  show: Partial<ShowDTO>,
): Promise<ShowDTO> => {
  const res = await api.put(`/shows/admin/${id}`, show);
  return res.data;
};

export const deleteShow = async (id: number): Promise<void> => {
  await api.delete(`/shows/admin/${id}`);
};

// ── SEATS ────────────────────────────────────────────────────────────────────

export interface SeatResponse {
  id: number;
  row: string;
  seatNumber: string;
  seatId: string; // e.g. "A5"
  status: "AVAILABLE" | "HELD" | "BOOKED";
  heldUntil: string | null;
}

export const getSeatsForShow = async (
  showId: number,
): Promise<SeatResponse[]> => {
  const res = await api.get(`/seats/show/${showId}`);
  return res.data;
};

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  eventDate: string; // "July 6, 2024"
  startTime: string; // "1:00 PM"
  endTime: string; // "3:00 PM"
  type: "yellow" | "blue" | "red";
  icon: string;
  badge?: string | null;
  status: string;
}

export const getUpcomingEvents = async (): Promise<EventDTO[]> => {
  const res = await api.get("/events");
  return res.data;
};

export const getAllEventsAdmin = async (): Promise<EventDTO[]> => {
  const res = await api.get("/events/admin/all");
  return res.data;
};

export const createEvent = async (e: Partial<EventDTO>): Promise<EventDTO> => {
  const res = await api.post("/events/admin", e);
  return res.data;
};

export const updateEvent = async (
  id: number,
  e: Partial<EventDTO>,
): Promise<EventDTO> => {
  const res = await api.put(`/events/admin/${id}`, e);
  return res.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/admin/${id}`);
};

// Bookings
export const createBooking = async (req: {
  showId: number;
  selectedSeatIds: string[];
}) => (await api.post("/bookings", req)).data;

export const getMyBookings = async () => (await api.get("/bookings/my")).data;

export const getAllBookingsAdmin = async () =>
  (await api.get("/bookings/admin/all")).data;

export const cancelBooking = async (id: number) =>
  (await api.put(`/bookings/${id}/cancel`)).data;

// Payments
export const processPayment = async (req: {
  bookingId: number;
  paymentMethod: string;
  cardLastFour?: string;
  cardHolderName?: string;
}) => (await api.post("/payments/process", req)).data;

export const refundPayment = async (bookingId: number) =>
  (await api.post(`/payments/refund/${bookingId}`)).data;

// Analytics
export const getDashboardSummary = async () =>
  (await api.get("/analytics/dashboard")).data;

export const getBookingAnalytics = async (days = 7) =>
  (await api.get(`/analytics/bookings?days=${days}`)).data;

export const getRevenueAnalytics = async () =>
  (await api.get("/analytics/revenue")).data;

// ── CHAT ─────────────────────────────────────────────────────────────────────

export interface ChatMessageDTO {
  id?: number;
  sender: "user" | "admin";
  text: string;
  sentAt?: string;
  username?: string;
  bookingDate?: string;
  bookingTime?: string;
  bookingLanguage?: string;
}

/** Send a message from the logged-in user */
export const sendChatMessage = async (
  dto: Omit<ChatMessageDTO, "id" | "sentAt" | "sender">,
): Promise<ChatMessageDTO> => (await api.post("/chat/send", dto)).data;

/** Get the logged-in user's conversation thread */
export const getMyChatMessages = async (): Promise<ChatMessageDTO[]> =>
  (await api.get("/chat/messages")).data;

/** Admin: reply to a user's thread */
export const adminReplyToUser = async (
  username: string,
  text: string,
): Promise<ChatMessageDTO> =>
  (await api.post(`/chat/admin/reply/${username}`, { text })).data;

/** Admin: get a specific user's thread */
export const adminGetUserMessages = async (
  username: string,
): Promise<ChatMessageDTO[]> =>
  (await api.get(`/chat/admin/messages/${username}`)).data;

/** Admin: list all usernames with chat threads */
export const adminGetChatUsers = async (): Promise<string[]> =>
  (await api.get("/chat/admin/users")).data;

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────

export interface NotificationItem {
  id: number;
  type: string; // "BLOG_APPROVED" | "BLOG_REJECTED" | etc.
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const getMyNotifications = async (): Promise<NotificationItem[]> =>
  (await api.get("/notifications")).data;

export const markNotificationRead = async (id: number): Promise<void> =>
  (await api.put(`/notifications/${id}/read`)).data;

export const markAllNotificationsRead = async (): Promise<void> =>
  (await api.put("/notifications/read-all")).data;

//PayHere Payment Integration

export const initiatePayHerePayment = async (bookingId: number) =>
  (await api.post("/payments/payhere/initiate", { bookingId })).data;

export default api;
