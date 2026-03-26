"""
KhetMitra - ESP32 Serial Bridge (Backend)
==========================================
Yeh script ESP32 se Serial data read karti hai (via USB cable)
aur automatically Next.js API ko forward karti hai.

Agar ESP32 me WiFi nahi lagaya to yeh use karo.

SETUP:
1.  Run in terminal:  pip install pyserial requests
2.  ESP32 ko USB se PC me connect karo
3.  Apna COM port neeche daalo (Windows: Device Manager me dekho, ya COMx)
4.  Next.js dev server run karo: npm run dev (frontend folder me)
5.  Phir yeh script run karo: python serial_bridge.py
"""

import serial
import requests
import json
import time
import re

# ─── CONFIG ──────────────────────────────────────────────────────────────────

SERIAL_PORT   = "COM3"          # <- Apna COM port yahan likho (e.g., COM3, COM5)
BAUD_RATE     = 115200
API_URL       = "http://localhost:3000/api/sensor"     # Next.js API

# ─────────────────────────────────────────────────────────────────────────────

def parse_sensor_data(lines: list[str]) -> dict | None:
    """Parse a block of serial output into a sensor dict."""
    data = {}
    for line in lines:
        # Match: "Temperature: 27.50 °C"
        temp_match = re.search(r"Temperature[:\s]+([\d.]+)", line)
        hum_match  = re.search(r"Humidity[:\s]+([\d.]+)", line)
        soil_match = re.search(r"Soil Moisture[:\s]+([\d]+)", line)

        if temp_match:
            data["temp"] = float(temp_match.group(1))
        if hum_match:
            data["humidity"] = float(hum_match.group(1))
        if soil_match:
            data["moisture"] = int(soil_match.group(1))

    if len(data) == 3:
        return data
    return None


def send_to_api(payload: dict):
    """POST sensor data to the Next.js API."""
    try:
        res = requests.post(API_URL, json=payload, timeout=5)
        if res.status_code == 200:
            print(f"✅ Sent to API: {payload}")
        else:
            print(f"❌ API Error {res.status_code}: {res.text}")
    except Exception as e:
        print(f"❌ Could not reach API: {e}")


def main():
    print(f"🔌 Connecting to ESP32 on {SERIAL_PORT} at {BAUD_RATE} baud...")
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2)
        print(f"✅ Connected! Listening for sensor data...\n")
    except Exception as e:
        print(f"❌ Could not open serial port: {e}")
        print("   → Check that ESP32 is plugged in and COM port is correct.")
        return

    buffer = []

    while True:
        try:
            line = ser.readline().decode("utf-8", errors="ignore").strip()

            if not line:
                continue

            print(f"  [Serial] {line}")
            buffer.append(line)

            # When we see the end of a data block, try to parse it
            if "---" in line and len(buffer) > 3:
                sensor_data = parse_sensor_data(buffer)
                if sensor_data:
                    send_to_api(sensor_data)
                buffer = []

        except KeyboardInterrupt:
            print("\n🛑 Stopped.")
            ser.close()
            break
        except Exception as e:
            print(f"⚠ Serial read error: {e}")
            time.sleep(1)


if __name__ == "__main__":
    main()
