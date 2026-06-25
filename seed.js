const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

let supabaseUrl = "https://syftgzszmxtlnukvhdub.supabase.co";
let supabaseKey = "sb_publishable_tv707YP5H0eLFvHGCfRW3g_qlkwdGFF";

try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*([^\r\n]+)/);
  const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*([^\r\n]+)/);
  if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1].trim();
  if (keyMatch && keyMatch[1]) supabaseKey = keyMatch[1].trim();
} catch (e) {
  console.log("Using default fallback credentials for seeding.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_COLORS = [
  { name: 'Gold', slug: 'gold', color_code: '#E5A93B' },
  { name: 'Silver', slug: 'silver', color_code: '#C0C0C0' },
  { name: 'Pearl White', slug: 'pearl-white', color_code: '#FDFDFD' },
  { name: 'Silver-Gold', slug: 'silver-gold', color_code: '#D4AF37' },
  { name: 'Turquoise Blue', slug: 'turquoise-blue', color_code: '#40E0D0' },
  { name: 'Platinum', slug: 'platinum', color_code: '#E5E4E2' }
];

const SEED_SIZES = [
  { name: 'S' },
  { name: 'M' },
  { name: 'L' }
];

const SEED_BRANDS = [
  { name: 'Mojuri', slug: 'mojuri', logo: 'media/brand/1.jpg' }
];

const SEED_CATEGORIES = [
  { name: 'Rings', slug: 'rings', description: 'Handcrafted luxury rings' },
  { name: 'Necklaces', slug: 'necklaces', description: 'Fine chains and pendants' },
  { name: 'Earrings', slug: 'earrings', description: 'Stunning hoops and drops' },
  { name: 'Bracelets', slug: 'bracelets', description: 'Elegant cuffs and link chains' }
];

const SEED_PRODUCTS = [
  {
    category_slug: 'earrings',
    name: 'Medium Flat Hoops',
    slug: 'medium-flat-hoops',
    description: 'Beautiful handcrafted gold medium flat hoop earrings, lightweight and suitable for daily wear.',
    thumbnail: 'media/product/1.jpg',
    gallery: ['media/product/1.jpg', 'media/product/1-2.jpg'],
    price: 150.00,
    sale_price: 100.00,
    stock_quantity: 15,
    status: 'in_stock',
    color: 'Gold',
    size: 'M',
    brand: 'Mojuri'
  },
  {
    category_slug: 'earrings',
    name: 'Bold Pearl Hoop Earrings',
    slug: 'bold-pearl-hoop-earrings',
    description: 'Statement hoops adorned with elegant freshwater pearls. A perfect blend of modern and classic aesthetics.',
    thumbnail: 'media/product/2.jpg',
    gallery: ['media/product/2.jpg', 'media/product/2-2.jpg'],
    price: 200.00,
    sale_price: 120.00,
    stock_quantity: 8,
    status: 'in_stock',
    color: 'Pearl White',
    size: 'L',
    brand: 'Mojuri'
  },
  {
    category_slug: 'earrings',
    name: 'Twin Hoops',
    slug: 'twin-hoops',
    description: 'Double loop design crafted in high-quality 925 sterling silver with a gold vermeil plating.',
    thumbnail: 'media/product/3.jpg',
    gallery: ['media/product/3.jpg', 'media/product/3-2.jpg'],
    price: 100.00,
    sale_price: 90.00,
    stock_quantity: 12,
    status: 'in_stock',
    color: 'Silver-Gold',
    size: 'S',
    brand: 'Mojuri'
  },
  {
    category_slug: 'earrings',
    name: 'Yilver And Turquoise Earrings',
    slug: 'yilver-and-turquoise-earrings',
    description: 'Sterling silver drop earrings set with premium natural turquoise gemstones.',
    thumbnail: 'media/product/4.jpg',
    gallery: ['media/product/4.jpg', 'media/product/4-2.jpg'],
    price: 150.00,
    sale_price: 100.00,
    stock_quantity: 0,
    status: 'out_of_stock',
    color: 'Turquoise Blue',
    size: 'M',
    brand: 'Mojuri'
  },
  {
    category_slug: 'necklaces',
    name: 'Gold Chain Pendant',
    slug: 'gold-chain-pendant',
    description: 'Delicate 18k gold chain necklace featuring an elegant minimalist geometric pendant.',
    thumbnail: 'media/product/5.jpg',
    gallery: ['media/product/5.jpg'],
    price: 350.00,
    sale_price: 300.00,
    stock_quantity: 5,
    status: 'in_stock',
    color: 'Gold',
    size: 'M',
    brand: 'Mojuri'
  },
  {
    category_slug: 'rings',
    name: 'Minimalist Diamond Ring',
    slug: 'minimalist-diamond-ring',
    description: 'Fine ring crafted in 14k gold, centered with a small ethical solitaire diamond.',
    thumbnail: 'media/product/cat-5.jpg',
    gallery: ['media/product/cat-5.jpg'],
    price: 500.00,
    sale_price: null,
    stock_quantity: 20,
    status: 'in_stock',
    color: 'Gold',
    size: 'S',
    brand: 'Mojuri'
  },
  {
    category_slug: 'bracelets',
    name: 'Silver Link Bracelet',
    slug: 'silver-link-bracelet',
    description: 'Classic link chain bracelet made with premium sterling silver and adjustable clasp.',
    thumbnail: 'media/product/cat-1.jpg',
    gallery: ['media/product/cat-1.jpg'],
    price: 120.00,
    sale_price: 90.00,
    stock_quantity: 10,
    status: 'in_stock',
    color: 'Silver',
    size: 'M',
    brand: 'Mojuri'
  },
  {
    category_slug: 'bracelets',
    name: 'Diamond Bracelet',
    slug: 'diamond-bracelet',
    description: 'Stunning luxury diamond chain bracelet set with beautiful brilliant-cut diamonds.',
    thumbnail: 'media/product/7.jpg',
    gallery: ['media/product/7.jpg', 'media/product/7-2.jpg'],
    price: 79.00,
    sale_price: 50.00,
    stock_quantity: 4,
    status: 'in_stock',
    color: 'Platinum',
    size: 'M',
    brand: 'Mojuri'
  },
  {
    category_slug: 'earrings',
    name: 'X Hoop Earrings',
    slug: 'x-hoop-earrings',
    description: 'Chic crisscross hoop design earrings plated with high-polish rhodium.',
    thumbnail: 'media/product/8.jpg',
    gallery: ['media/product/8.jpg', 'media/product/8-2.jpg'],
    price: 200.00,
    sale_price: 180.00,
    stock_quantity: 10,
    status: 'in_stock',
    color: 'Silver',
    size: 'M',
    brand: 'Mojuri'
  },
  {
    category_slug: 'necklaces',
    name: 'Vintage Medallion Necklace',
    slug: 'vintage-medallion-necklace',
    description: 'Carved gold vermeil coin medallion suspended on an ornate vintage style rope chain.',
    thumbnail: 'media/product/9.jpg',
    gallery: ['media/product/9.jpg', 'media/product/9-2.jpg'],
    price: 140.00,
    sale_price: null,
    stock_quantity: 7,
    status: 'in_stock',
    color: 'Gold',
    size: 'L',
    brand: 'Mojuri'
  }
];

const SEED_ORDERS = [
  {
    customer_name: 'Nguyễn Văn A',
    customer_email: 'vana@gmail.com',
    customer_phone: '0912345678',
    shipping_address: '123 Đường Lê Lợi, Quận 1, TP. HCM',
    subtotal: 380,
    shipping_fee: 30,
    total: 410,
    status: 'delivered',
    created_at: '2026-06-20T10:00:00Z',
    items: [
      {
        product_slug: 'medium-flat-hoops',
        quantity: 2,
        price: 100
      },
      {
        product_slug: 'bold-pearl-hoop-earrings',
        quantity: 1,
        price: 180
      }
    ]
  },
  {
    customer_name: 'Trần Thị B',
    customer_email: 'thib@yahoo.com',
    customer_phone: '0987654321',
    shipping_address: '456 Đường Nguyễn Trãi, Thanh Xuân, Hà Nội',
    subtotal: 150,
    shipping_fee: 30,
    total: 180,
    status: 'pending',
    created_at: '2026-06-23T15:30:00Z',
    items: [
      {
        product_slug: 'twin-hoops',
        quantity: 1,
        price: 150
      }
    ]
  }
];

const SEED_CONTACTS = [
  {
    name: 'Phạm Minh Hoàng',
    email: 'hoangpm@gmail.com',
    title: 'Tư vấn chọn size nhẫn',
    message: 'Xin chào, tôi muốn mua nhẫn Minimalist Diamond Ring tặng bạn gái nhưng chưa rõ cách đo size tay. Nhờ shop hướng dẫn giúp ạ.',
    status: 'unread',
    created_at: '2026-06-24T07:15:00Z'
  },
  {
    name: 'Nguyễn Thị Mai',
    email: 'mainguyen@gmail.com',
    title: 'Hỏi về chính sách bảo hành bạc',
    message: 'Sản phẩm lắc tay bạc mua tại cửa hàng có được hỗ trợ đánh bóng và làm sáng miễn phí trọn đời không ạ?',
    status: 'read',
    created_at: '2026-06-23T14:20:00Z'
  }
];

async function seed() {
  console.log("Starting database seeding...");
  try {
    // 1. Delete existing records (cascade delete on products, reviews, order_items via schema constraints)
    console.log("Cleaning database tables...");
    await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('contacts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('colors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('sizes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('brands').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insert Categories
    console.log("Inserting categories...");
    const { data: insertedCategories, error: catError } = await supabase
      .from('categories')
      .insert(SEED_CATEGORIES)
      .select('id, slug');

    if (catError) throw new Error("Error inserting categories: " + catError.message);
    
    // Create mapping of category_slug -> category_id
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });
    console.log("Categories seeded successfully:", Object.keys(categoryMap));

    // 3. Insert Products
    console.log("Inserting products...");
    const productsToInsert = SEED_PRODUCTS.map(p => {
      const { category_slug, ...rest } = p;
      return {
        ...rest,
        category_id: categoryMap[category_slug]
      };
    });

    const { data: insertedProducts, error: prodError } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select('id, slug');

    if (prodError) throw new Error("Error inserting products: " + prodError.message);
    
    // Create mapping of product_slug -> product_id
    const productMap = {};
    insertedProducts.forEach(prod => {
      productMap[prod.slug] = prod.id;
    });
    console.log("Products seeded successfully. Total inserted:", insertedProducts.length);

    // 4. Insert Contacts
    console.log("Inserting contact messages...");
    const { error: contactError } = await supabase
      .from('contacts')
      .insert(SEED_CONTACTS);

    if (contactError) throw new Error("Error inserting contacts: " + contactError.message);
    console.log("Contact messages seeded successfully.");

    // 5. Insert Orders and Order Items
    console.log("Inserting orders...");
    for (const orderInfo of SEED_ORDERS) {
      const { items, ...orderData } = orderInfo;
      const { data: insertedOrder, error: orderInsertError } = await supabase
        .from('orders')
        .insert([orderData])
        .select('id')
        .single();

      if (orderInsertError) throw new Error("Error inserting order: " + orderInsertError.message);

      const orderItemsToInsert = items.map(item => ({
        order_id: insertedOrder.id,
        product_id: productMap[item.product_slug],
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) throw new Error("Error inserting order items: " + itemsError.message);
    }
    console.log("Orders and Order Items seeded successfully.");

    // 6. Insert Colors, Sizes, Brands
    console.log("Inserting colors...");
    const { error: colorErr } = await supabase.from('colors').insert(SEED_COLORS);
    if (colorErr) throw new Error("Error inserting colors: " + colorErr.message);

    console.log("Inserting sizes...");
    const { error: sizeErr } = await supabase.from('sizes').insert(SEED_SIZES);
    if (sizeErr) throw new Error("Error inserting sizes: " + sizeErr.message);

    console.log("Inserting brands...");
    const { error: brandErr } = await supabase.from('brands').insert(SEED_BRANDS);
    if (brandErr) throw new Error("Error inserting brands: " + brandErr.message);

    console.log("Colors, Sizes and Brands seeded successfully.");
    console.log("Database seeding completed successfully!");
  } catch (err) {
    console.error("Seeding failed:", err.message || err);
  }
}

seed();
