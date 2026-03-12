import requests
import os

NCERT_URLS = {
    'physics_11_part1': 'https://ncert.nic.in/textbook/pdf/keph101.pdf',
    'physics_11_part2': 'https://ncert.nic.in/textbook/pdf/keph102.pdf',
    'physics_12_part1': 'https://ncert.nic.in/textbook/pdf/keph201.pdf',
    'physics_12_part2': 'https://ncert.nic.in/textbook/pdf/keph202.pdf',
}

def download_ncert():
    os.makedirs('knowledge-base/ncert', exist_ok=True)
    
    for name, url in NCERT_URLS.items():
        print(f"Downloading {name}...")
        try:
            response = requests.get(url, timeout=60)
            response.raise_for_status()  # Raise an error for bad status codes
            filepath = f'knowledge-base/ncert/{name}.pdf'
            with open(filepath, 'wb') as f:
                f.write(response.content)
            file_size = len(response.content) / (1024 * 1024)  # Size in MB
            print(f"Saved: {filepath} ({file_size:.2f} MB)")
        except Exception as e:
            print(f"Error downloading {name}: {e}")

if __name__ == "__main__":
    download_ncert()
