import jwt ,{sign} from "jsonwebtoken";

import { DB, readDB ,Database } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { username, password } = body;
  const user = (<Database>DB).users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { 
        ok: false, 
        message: "Username or Password is incorrect" 
      }, { status: 400 }
    );
  }

  const payload = {
    username,
    role: user.role,
  }

  const secret = process.env.JWT_SECRET || "This is another secret"

  const token = jwt.sign(
    { username, role: user.role },
    secret,
    { expiresIn: "8h" }
  );

  return NextResponse.json({ ok: true, token });
};
