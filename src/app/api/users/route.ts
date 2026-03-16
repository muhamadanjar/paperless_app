import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import UserService from "@/db/repository/user-repository"


export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    emailVerified: z.coerce.date().optional(),
    image: z.string()
});

type CreateUserInput = z.infer<typeof createUserSchema>;

export async function GET(req: NextRequest) {
    const service = new UserService()
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const filters: any = search ? [['name', 'ilike', `%${search}%`]] : undefined;

    const { data, meta } = await service.paginate(filters, { 
        pagination: { page, limit }
    })
    return NextResponse.json({ data, meta }, { status: 200});
}


export async function POST(req: NextRequest) {
    try {
        const service = new UserService()
        const body = await req.json();

        const validateData = createUserSchema.parse(body);

        await service.create(validateData);

        return NextResponse.json({
            message: "Create User Successfuly",
        },{
            status: 200
        })
        

    } catch (error) {
         if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    message: "Validation failed",
                    errors: error.errors,
                },
                { status: 400 }
            );
        }
        console.log(error)

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
        
    }
}
