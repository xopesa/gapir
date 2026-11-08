"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/src/components/ui";
import type { AppUser } from "@/src/types/app";

interface UserRow { id: string; name: string; email: string; role: "USER"|"CONTENT_EDITOR"|"ADMIN"|"OWNER"; locale: string; xp: number }

export function UsersTable({ users, currentUser }: { users: UserRow[]; currentUser: AppUser }) {
  const router = useRouter(); const [message, setMessage] = useState("");
  const changeRole = async (userId: string, role: UserRow["role"]) => {
    const response = await fetch(`/api/admin/users/${userId}/role`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    setMessage(response.ok ? "Роль обновлена" : "Не удалось изменить роль"); if (response.ok) router.refresh();
  };
  return <>{message && <p className="admin-message">{message}</p>}<Card className="admin-table-card"><div className="admin-users-table"><div className="table-head"><span>Имя</span><span>Email</span><span>Роль</span><span>Язык</span><span>XP</span></div>{users.map((user) => <div key={user.id}><strong>{user.name}</strong><span>{user.email}</span>{currentUser.role === "OWNER" && user.id !== currentUser.id ? <select value={user.role} onChange={(event) => void changeRole(user.id, event.target.value as UserRow["role"])} aria-label={`Роль ${user.name}`}><option value="USER">USER</option><option value="CONTENT_EDITOR">CONTENT_EDITOR</option><option value="ADMIN">ADMIN</option><option value="OWNER">OWNER</option></select> : <span>{user.role}</span>}<span>{user.locale.toUpperCase()}</span><span>{user.xp}</span></div>)}</div></Card></>;
}
