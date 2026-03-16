import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import UserService from "@/db/repository/user-repository";
import { createUserSchema } from "../route";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const service = new UserService();
        const user = await service.findById(id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const service = new UserService();
        const body = await req.json();

        // Use partial schema for updates
        const updateSchema = createUserSchema.partial();
        const validateData = updateSchema.parse(body);

        const updatedUser = await service.update(id, validateData);

        return NextResponse.json({
            message: "User updated successfully",
            data: updatedUser
        }, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const service = new UserService();
        
        const deleted = await service.delete(id);

        if (!deleted) {
            return NextResponse.json({ message: "User not found or could not be deleted" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
