"use server";

import { NextResponse, NextRequest } from "next/server";

export async function imageUpload(formData: FormData) {
  console.log("file", formData);
  console.log("2222");
  return true;
}
