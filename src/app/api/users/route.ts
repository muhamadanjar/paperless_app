import { NextResponse } from "next/server";

export async function GET(req: Request) {
    return NextResponse.json({ message: "OK", agent: req.headers.get('user-agent')}, { status: 200});
}