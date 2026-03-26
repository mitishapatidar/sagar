import serial
import requests
import json
import time

# ESP32 ka Serial Port (change this if different, check Arduino IDE)
SERIAL_PORT = 'COM3'  
BAUD_RATE = 115200

# Next.js Server URL
API_URL = 'http://localhost:3000/api/sensor'

def main():
    try:
        # Serial port connect karte hain
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print(f"Connected to ESP32 on {SERIAL_PORT}")
        
    except serial.SerialException as e:
        print(f"Error connecting to {SERIAL_PORT}: {e}")
        print("Bhai, tu ek baar Arduino IDE mein check kar ki ESP32 konsi COM port pe laga hai aur ooper SERIAL_PORT change kar de.")
        return

    while True:
        try:
            if ser.in_waiting > 0:
                # Read line from serial and decode
                line = ser.readline().decode('utf-8').strip()
                
                if line:
                    print(f"Received from ESP32: {line}")
                    
                    try:
                        # JSON parse karte hain
                        data = json.loads(line)
                        
                        # Sirf valid data bhejo backend mein
                        if 'moisture' in data and 'temp' in data and 'humidity' in data:
                            print("Sending to KhetMitra Backend...")
                            
                            # HTTP POST Request to Next.js API
                            response = requests.post(
                                API_URL, 
                                json=data,
                                headers={'Content-Type': 'application/json'}
                            )
                            
                            if response.status_code == 200:
                                print(f"✅ Success! Data sent. Backend reply: {response.text}")
                            else:
                                print(f"❌ Failed to reach backend! Code: {response.status_code}")
                                
                    except json.JSONDecodeError:
                        # Ignore lines that aren't valid JSON (like boot logs)
                        pass
                        
            time.sleep(0.1)
                
        except KeyboardInterrupt:
            print("\nBridge stopped by user.")
            ser.close()
            break
        except Exception as e:
            print(f"An error occurred: {e}")
            time.sleep(2) # Wait before retry

if __name__ == '__main__':
    main()
