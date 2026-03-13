import { NextRequest, NextResponse } from "next/server";

const VEHICLE_MAP = [
  { merk: "VOLKSWAGEN", pattern: "UP", brand: "volkswagen" },
  { merk: "SEAT", pattern: "MII", brand: "seat" },
  { merk: "SKODA", pattern: "CITIGO", brand: "skoda" },
];

const MIN_YEAR = 2011;
const MAX_YEAR = 2023;

export async function GET(request: NextRequest) {
  const plate = request.nextUrl.searchParams.get("plate");
  if (!plate) {
    return NextResponse.json({ error: "invalid_plate" }, { status: 400 });
  }

  const cleanPlate = plate.replace(/[\s\-\.]/g, "").toUpperCase();
  if (cleanPlate.length < 4 || cleanPlate.length > 8) {
    return NextResponse.json({ error: "invalid_plate" }, { status: 400 });
  }

  try {
    const rdwUrl = `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${encodeURIComponent(cleanPlate)}`;
    const rdwResponse = await fetch(rdwUrl, { next: { revalidate: 86400 } }); // cache 24h

    if (!rdwResponse.ok) {
      return NextResponse.json({ error: "api_error" }, { status: 502 });
    }

    const data = await rdwResponse.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const vehicle = data[0];
    const merk = (vehicle.merk || "").toUpperCase();
    const handelsbenaming = (vehicle.handelsbenaming || "").toUpperCase();
    const dateStr = vehicle.datum_eerste_toelating || "";
    const year = parseInt(dateStr.substring(0, 4), 10);

    if (isNaN(year)) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    // Find matching vehicle in our catalog
    const match = VEHICLE_MAP.find(
      (entry) => merk === entry.merk && handelsbenaming.includes(entry.pattern)
    );

    if (!match) {
      return NextResponse.json({ error: "unsupported" }, { status: 404 });
    }

    if (year < MIN_YEAR || year > MAX_YEAR) {
      return NextResponse.json({ error: "unsupported" }, { status: 404 });
    }

    return NextResponse.json({ brand: match.brand, year });
  } catch {
    return NextResponse.json({ error: "api_error" }, { status: 502 });
  }
}
