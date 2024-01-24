"use server";

import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function imageUpload(formData: FormData) {
  console.log(formData.get("file"));
  const res = await axios({
    method: "POST",
    url: `https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_IMAGE_ACCOUNT_ID}/images/v1`,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTHORIZATION}`,
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  // console.log("res", res);

  const resultData = {
    cloudflare_id: res.data.result.id,
    image_url: `https://imagedelivery.net/${process.env.NEXT_PUBLIC_IMAGE_HASH_KEY}/${res.data.result.id}`,
  };
  // url/middle
  console.log("resultData", resultData);

  return resultData;
}
