import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Chotima Mankit",
    studentId: "660610748",
  });
};
