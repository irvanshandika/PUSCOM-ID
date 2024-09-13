"use client";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/src/config/FirebaseConfig";
import { Spinner } from "@nextui-org/spinner";
import Dashboard from "@/src/servercomponents/Dashboard/Dashboard";

function DashboardPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/forbidden");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Loading" color="primary" labelColor="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <main className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">PUSCOM Dashboard</h1>
        <Dashboard />
      </main>
    </>
  );
}

export default DashboardPage;
