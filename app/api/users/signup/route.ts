import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { hash } from 'bcrypt';
import { undefined, z } from "zod";

const userSchema = z.object({
    name:z.string().min(1, { message: "Name is required" }),
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    username: z.string().min(1, { message: "Username is required" }).max(100),
    password: z.string().min(1, { message: "Password is required" }).min(8, { message: "Password must be at least 8 characters long" }),
    otp: z.string().min(6,{message:"OTP is required"})
});

export async function POST(req: Request) {
    try { 
        const body = await req.json();
        console.log("incoming",body);
      //  const {email,password,name,username} =body.data;
        const {name,email,username,password,otp} = userSchema.parse(body.data);

        // Check if username already exists
        const existingUserName = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if (existingUserName) {
            return NextResponse.json({ user: null, message: "Username already exists" }, { status: 409 });
        }

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingEmail) {
            return NextResponse.json({ user: null, message: "Email already exists" }, { status: 409 });
        }
       

        const latestOTP = await prisma.otp.findFirst({
            where: {
              email: email,
            },
            orderBy: {
                createdAt: 'desc', // Assuming 'createdAt' is the timestamp field in your OTP model
              },
          });
        
       
        if(latestOTP){
        console.log(latestOTP)
        if(latestOTP.otp!=otp){
             return NextResponse.json({ user: null, message: "OTP did not matched" }, { status: 409 });
        }
         
        // Hash the password
        const hashedPassword = await hash(password, 10);
        console.log("creating")
        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                name:name,
                email:email,
                username:username,
                password: hashedPassword
            }
        });

        // Return the new user
        return NextResponse.json({ user: newUser, message: "User created successfully" }, { status: 201 });
    }

    else{
        return NextResponse.json({ user: null, message: "OTP did not found" }, { status: 409 });
      }
    } 
    catch (error){
        console.error('Error creating user:', error);
        return NextResponse.json({ user: null, message: "Internal Server Error" }, { status: 500 });
    }
}
