import { Database, DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");
  const room = (<Database>DB).rooms.find((room)=> room.roomId === roomId);
  if(!room){
    return NextResponse.json(
      {
      ok: false,
      message: "Room is not found",
      }, 
      { status: 404 }
    );
  }

  const message = (<Database>DB).messages.filter((message)=> message.roomId=== roomId);
  return NextResponse.json({
    ok: true,
    messages: message,
   
  })
};

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const {roomId ,messageText} = body;
  const room = (<Database>DB).rooms.find((room) => room.roomId === roomId);
  if(!room){
      return NextResponse.json(
     {
       ok: false,
       message: `Room is not found`,
     },
     { status: 404 }
  );
  }

  const messageId = nanoid();
  (<Database>DB).messages.push({
    roomId,
    messageId,
    messageText,
  })
  
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();

  if(!payload){
    return NextResponse.json(
    {
      ok: false,
      message: "Invalid token",
      },
      { status: 401 }
    );
  }
  
  readDB();

  
  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Message is not found",
  //   },
  //   { status: 404 }
  // );

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
