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
      <Dashboard />
    </>
  );
}

export default DashboardPage;
