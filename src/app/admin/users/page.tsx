"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  balance: number;
  status: string;
  _count: { orders: number };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  async function load() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function patch(id: string, body: object) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Users</h1>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="px-3 py-3">User</th>
              <th className="px-3 py-3">Balance (NGN)</th>
              <th className="px-3 py-3">Orders</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/8">
                <td className="px-3 py-3">
                  <p>{u.username}</p>
                  <p className="text-xs text-white/40">{u.email}</p>
                </td>
                <td className="px-3 py-3">
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      patch(u.id, { balance: Number(fd.get("balance")) });
                    }}
                  >
                    <Input name="balance" defaultValue={u.balance} className="w-28 py-1" />
                    <Button className="rounded-lg px-3 py-1 text-xs">Set</Button>
                  </form>
                </td>
                <td className="px-3 py-3">{u._count.orders}</td>
                <td className="px-3 py-3">{u.status}</td>
                <td className="px-3 py-3">
                  <Button
                    variant="outline"
                    className="rounded-lg px-3 py-1 text-xs"
                    onClick={() =>
                      patch(u.id, { status: u.status === "active" ? "disabled" : "active" })
                    }
                  >
                    {u.status === "active" ? "Disable" : "Enable"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
