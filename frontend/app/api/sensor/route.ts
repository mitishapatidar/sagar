import { NextResponse } from 'next/server';

// ─── In-Memory Storage ───────────────────────────────────────────────────────
// Persists data across hot reloads in dev mode
// History: last 240 readings = 1 hour at 15-second interval

type SensorReading = {
  moisture: number
  temp: number
  humidity: number
  timestamp: number
  time: string
}

// @ts-ignore
if (!globalThis.sensorLatest) {
  // @ts-ignore
  globalThis.sensorLatest = {
    moisture: 45,
    temp: 28,
    humidity: 65,
    timestamp: Date.now(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } as SensorReading;
}

// @ts-ignore
if (!globalThis.sensorHistory) {
  // @ts-ignore
  globalThis.sensorHistory = [] as SensorReading[];
}

// ─── GET — Latest reading + full history ─────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    // @ts-ignore
    latest: globalThis.sensorLatest,
    // @ts-ignore
    history: globalThis.sensorHistory
  });
}

// ─── POST — Receive new reading from ESP32 ───────────────────────────────────
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const newReading: SensorReading = {
      // @ts-ignore
      moisture: data.moisture !== undefined ? Number(data.moisture) : globalThis.sensorLatest.moisture,
      // @ts-ignore
      temp:     data.temp     !== undefined ? Number(data.temp)     : globalThis.sensorLatest.temp,
      // @ts-ignore
      humidity: data.humidity !== undefined ? Number(data.humidity) : globalThis.sensorLatest.humidity,
      timestamp: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update latest
    // @ts-ignore
    globalThis.sensorLatest = newReading;

    // Append to history (keep last 240 = 1 hour at 15s interval)
    // @ts-ignore
    globalThis.sensorHistory.push(newReading);
    // @ts-ignore
    if (globalThis.sensorHistory.length > 240) {
      // @ts-ignore
      globalThis.sensorHistory.shift();
    }

    return NextResponse.json({ success: true, data: newReading });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid data format' }, { status: 400 });
  }
}
