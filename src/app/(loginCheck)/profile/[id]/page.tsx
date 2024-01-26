import { Database } from "@/type/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import ProfileForm from "@/components/base/ProfileForm";

export default async function ProfilePage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  // console.log("supabase", supabase);
  const { data, error } = await supabase.auth.getSession();
  // console.log("data", data);

  if (data.session?.user) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", data.session.user.id)
      .single();
    if (profileData) {
      return <ProfileForm data={profileData} />;
    }
  }
}
