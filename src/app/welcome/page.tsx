"use client";

// import supabase from "@/utils/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    userLogin();
  }, []);

  // const { data } = await supabase.auth.getUser();

  // console.log("data", data);

  async function userLogin() {
    const { data } = await supabase.auth.getUser();
    console.log("data", data);
    setUser(data.user);
  }

  return (
    <div>
      <h1>Welcome to the Welcome Page {user?.email} </h1>
    </div>
  );
}
