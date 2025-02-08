# Pharmacy Management System API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Pharmacy Item Details
#### Get All Pharmacy Item Details
**Endpoint:**
```
GET /pharmacy_details
```
**Response:**
```json
[
    {
        "id_product": "67a630a2e55658def549d5c7",
        "product_name": "Paracetamol",
        "total_quantity": 20,
        "sell_price": 15000,
        "buy_price": 12000
    }
]
```

---

### 2. Products
#### Add Product
**Endpoint:**
```
POST /product/add
```
**Request Body:**
```json
{
    "product_name": "Ibuprofen",
    "sell_price": 18000
}
```
**Response:**
```json
{
    "message": "Product added successfully",
    "product": {
        "product_name": "Ibuprofen",
        "sell_price": 18000
    }
}
```

#### Get All Products
**Endpoint:**
```
GET /product
```
**Response:**
```json
[
    {
        "product_name": "Paracetamol",
        "sell_price": 15000
    },
    {
        "product_name": "Ibuprofen",
        "sell_price": 18000
    }
]
```

---

### 3. Suppliers
#### Get All Suppliers
**Endpoint:**
```
GET /supplier
```
**Response:**
```json
[
    {
        "supplier_name": "XYZ Pharma",
        "address": "Jl. Sudirman No. 10",
        "phone_number": "08123456789"
    }
]
```

#### Add Supplier
**Endpoint:**
```
POST /supplier/add-supplier
```
**Request Body:**
```json
{
    "supplier_name": "XYZ Pharma",
    "address": "Jl. Sudirman No. 10",
    "phone_number": "08123456789"
}
```
**Response:**
```json
{
    "message": "Supplier added successfully",
    "supplier": {
        "supplier_name": "XYZ Pharma",
        "address": "Jl. Sudirman No. 10",
        "phone_number": "08123456789"
    }
}
```

#### Get Supplier with Products
**Endpoint:**
```
GET /supplier/product
```
**Response:**
```json
[
    {
        "supplier_name": "XYZ Pharma",
        "address": "Jl. Sudirman No. 10",
        "phone_number": "08123456789",
        "products": [
            {
                "product_name": "Paracetamol",
                "sell_price": 15000
            }
        ]
    }
]
```

---

### 4. Transactions
#### Create Transaction
**Endpoint:**
```
POST /transaction
```
**Request Body:**
```json
{
    "id_supplier": "67a7be8e63722172f077aed6",
    "products": [
        {
            "id_product": "67a630a2e55658def549d5c7",
            "quantity": 10,
            "price_per_unit": 12000
        }
    ],
    "amount_paid": 120000
}
```
**Response:**
```json
{
    "message": "Transaction created successfully",
    "transaction": {
        "id_supplier": "67a7be8e63722172f077aed6",
        "products": [
            {
                "id_product": "67a630a2e55658def549d5c7",
                "quantity": 10,
                "price_per_unit": 12000
            }
        ],
        "amount_paid": 120000,
        "total_transaction_price": 120000,
        "is_completed": true
    }
}
```

#### Get All Transactions
**Endpoint:**
```
GET /transaction
```
**Response:**
```json
[
    {
        "id_supplier": "67a7be8e63722172f077aed6",
        "supplier_name": "XYZ Pharma",
        "amount_paid": 120000,
        "total_transaction_price": 120000,
        "is_completed": true
    }
]
```

#### Get Transaction by ID
**Endpoint:**
```
GET /transaction/:id
```
**Response:**
```json
{
    "id_supplier": "67a7be8e63722172f077aed6",
    "supplier_name": "XYZ Pharma",
    "amount_paid": 120000,
    "total_transaction_price": 120000,
    "is_completed": true
}
```

#### Update Amount Paid in Transaction
**Endpoint:**
```
PUT /transaction/:id/amount-paid
```
**Request Body:**
```json
{
    "amount_paid": 150000
}
```
**Response:**
```json
{
    "message": "Amount paid updated successfully",
    "transaction": {
        "amount_paid": 150000,
        "total_transaction_price": 120000,
        "is_completed": true
    }
}
```

---

## Notes
- All endpoints return JSON responses.
- Use valid IDs when making requests that require `id_product`, `id_supplier`, or `transaction ID`.
- `buy_price` is derived from `sell_price` of the related product.


