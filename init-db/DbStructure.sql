
--General tables 

CREATE TABLE category(
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL  
);



CREATE TABLE user(
    user_id  SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    its_admin BOOLEAN NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE product(
    product_id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    sale_price DECIMAL(10, 2) NOT NULL,
    bought_price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    fk_category_id INT NOT NULL,

    CONSTRAINT fk_category
        FOREIGN KEY (fk_category_id)
        REFERENCES category(category_id)

);

--Stock entering in the inventory 

CREATE TABLE purchase(
    purchase_id SERIAL PRIMARY KEY,
    date DATE 
    
  

);

CREATE TABLE purchase_detail(
    purchase_detail_id SERIAL PRIMARY KEY,
    fk_purchase_id INT NOT NULL,
    fk_product_id INT NOT NULL,
    
    CONSTRAINT fk_purchase
        FOREIGN KEY (fk_purchase_id)
        REFERENCES purchase(purchase_id),

    CONSTRAINT fk_product
        FOREIGN KEY (fk_product_id)
        REFERENCES product(product_id),
    
    quantity INT NOT NULL CHECK (quantity > 0)
);

--Stock leaving the inventory

CREATE TABLE sale(
    sale_id SERIAL PRIMARY KEY,
    date DATE
    
   
);

CREATE TABLE sale_detail(
    sale_detail_id SERIAL PRIMARY KEY,
    fk_sale_id INT NOT NULL,
    fk_product_id INT NOT NULL,
    
    CONSTRAINT fk_sale
        FOREIGN KEY (fk_sale_id)
        REFERENCES sale(sale_id),

    CONSTRAINT fk_product
        FOREIGN KEY (fk_product_id)
        REFERENCES product(product_id),
    
    quantity INT NOT NULL CHECK (quantity > 0)
);









