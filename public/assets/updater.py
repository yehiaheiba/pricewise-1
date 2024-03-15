import requests
from bs4 import BeautifulSoup
from typing import List
import re

def extract_price(soup: BeautifulSoup, *selectors: str) -> str:
    for selector in selectors:
        element = soup.select_one(selector)
        if element:
            price_text = element.get_text(strip=True)
            if price_text:
                clean_price = re.sub(r'[^\d.]', '', price_text)
                first_price_match = re.search(r'\d+\.\d{2}', clean_price)
                first_price = first_price_match.group(0) if first_price_match else None
                return first_price or clean_price
    return ''

# Example usage with BeautifulSoup
# from bs4 import BeautifulSoup
# soup = BeautifulSoup(html_content, 'html.parser')
# elements = soup.select('your_selector_here')
# price = extract_price(*elements)
# print(price)
def scrape_amazon_product(url: str):
    try:
        # Fetch the product page
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        print(soup)

        # Extract prices using the provided selectors
        current_price_selectors = [
            '.priceToPay span.a-price-whole',
            '.a.size.base.a-color-price',
            '.a-button-selected .a-color-base'
        ]
        original_price_selectors = [
            '#priceblock_ourprice',
            '.a-price.a-text-price span.a-offscreen',
            '#listPrice',
            '#priceblock_dealprice',
            '.a-size-base.a-color-price'
        ]

        current_price = extract_price(soup, *current_price_selectors)
        original_price = extract_price(soup, *original_price_selectors)
        print("price", current_price, original_price)
        if current_price:
            return current_price,
            
        else:
            return original_price
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    
def get_product_data():
    # Send a GET request to the API endpoint
    response = requests.get("http://localhost:3000/api/products/update", verify=False)
    if response.status_code != 200:
        print("Failed to retrieve products")
        return

    # Parse the JSON response
    data = response.json()
    products = data.get("data", [])
    print(products)
    # Iterate over each product
    
    for product in products[-1:]:
        updated_product = {}
        product_url = product.get("url")
        product_id = product.get("_id")  # Assuming the product ID key is "_id"
        
        price = scrape_amazon_product(product_url)
        print(price)
        if price:
            updated_products={"id":product_id,"price":price}
            update_response = requests.post("http://localhost:3000/api/products/update", json=updated_products)
        
    # Send a POST request with the updated product data

        if update_response.status_code == 200:
            print("Products updated successfully")
        else:
            print("Failed to update products")

if __name__ == "__main__":
    get_product_data()
