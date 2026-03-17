export type User = {
  id: number;
  name: string;
  role: string;
  title: string;
  status: "ACTIVE" | "INACTIVE";
  joined: string;
};

export async function loadUsers(): Promise<User[]> {
  try {
    const response = await fetch("/api/members?order=role&direction=asc", {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? (data as User[]) : [];
  } catch {
    return [];
  }
}
