import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, Project } from "@/types/models";

const inMemory: Project[] = [
  {
    id: "demo-1",
    title: "Beispielprojekt",
    description: "Erster Dummy-Eintrag",
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  const response: ApiResponse<Project[]> = { success: true, data: inMemory };
  return NextResponse.json(response, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Pick<Project, "title" | "description">;
    const item: Project = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      createdAt: new Date().toISOString(),
    };
    inMemory.push(item);
    const response: ApiResponse<Project> = { success: true, data: item };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Ungültige Anfrage",
    };
    return NextResponse.json(response, { status: 400 });
  }
}


