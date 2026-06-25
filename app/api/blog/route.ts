import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

const DEFAULT_CATEGORIES = [
  { name: 'Bracelets', slug: 'bracelets' },
  { name: 'Earrings', slug: 'earrings' },
  { name: 'Necklaces', slug: 'necklaces' },
  { name: 'News', slug: 'news' },
  { name: 'Wedding & Bridal', slug: 'wedding-bridal' }
];

const DEFAULT_POSTS = [
  {
    title: 'Bridial Fair Collections 2023',
    slug: 'bridial-fair-collections-2023',
    summary: 'Discover the highlights and gorgeous layouts from our annual Bridal Fair, showcasing fine gold bands, diamond settings and handcrafted luxury.',
    content: 'Our annual Bridal Fair brings together the finest craftsmanship and most romantic designs. From solitaire engagement rings to matching wedding bands, each piece is handcrafted using ethically sourced metals and certified diamonds. Discover our new season bridal collections today.',
    cover_image: 'media/blog/1.jpg',
    status: 'published',
    created_at: '2023-07-24T10:00:00Z',
    category_slug: 'wedding-bridal'
  },
  {
    title: 'Our Sterling Silver',
    slug: 'our-sterling-silver',
    summary: 'A look behind the scenes at how we craft our high-quality 925 sterling silver bracelets, necklaces and earrings for everyday elegance.',
    content: 'Sterling silver has long been a staple of elegant, daily-wear jewelry. At Mojuri, we use only premium 925 sterling silver, coated with a layer of rhodium or gold vermeil to prevent tarnish and ensure long-lasting luster. Explore our collection of silver cuffs, hoops, and fine pendants.',
    cover_image: 'media/blog/2.jpg',
    status: 'published',
    created_at: '2023-08-16T10:00:00Z',
    category_slug: 'wedding-bridal'
  },
  {
    title: 'New Season Modern Gold Earrings',
    slug: 'new-season-modern-gold-earrings',
    summary: 'Bold shapes, lightweight hoops and delicate studs define our new season gold earrings collection. Designed for versatility and sparkle.',
    content: 'Gold earrings are the ultimate accessory for framing the face and adding instant polish to any outfit. This season, we are focusing on clean geometric shapes, bold chunky hoops that remain lightweight, and delicate studs set with natural gemstones. Find your perfect pair.',
    cover_image: 'media/blog/3.jpg',
    status: 'published',
    created_at: '2023-10-04T10:00:00Z',
    category_slug: 'wedding-bridal'
  },
  {
    title: 'Glossary of Jewelry Terms',
    slug: 'glossary-of-jewelry-terms',
    summary: 'Do you know the difference between gold plated, gold filled, and gold vermeil? Read our guide to become a jewelry shopping expert.',
    content: 'Understanding jewelry terminology is key to making smart investments. In this comprehensive glossary, we break down essential concepts including carat weight, metal alloys, setting styles, and gem grading. Expand your knowledge and shop with confidence.',
    cover_image: 'media/blog/4.jpg',
    status: 'published',
    created_at: '2023-10-20T10:00:00Z',
    category_slug: 'wedding-bridal'
  },
  {
    title: 'Unique First Anniversary Gift Ideas',
    slug: 'unique-first-anniversary-gift-ideas',
    summary: 'Paper is the traditional first anniversary gift, but jewelry is the one that lasts forever. See our top picks for celebrating one year together.',
    content: 'Marking one year of marriage is a beautiful milestone. While tradition suggests paper, modern couples love gifting heirloom-quality jewelry that represents eternal love. From custom initial necklaces to delicate diamond eternity bands, find an unforgettable gift.',
    cover_image: 'media/blog/5.jpg',
    status: 'published',
    created_at: '2023-12-11T10:00:00Z',
    category_slug: 'wedding-bridal'
  },
  {
    title: 'Hypoallergenic Wedding Bands',
    slug: 'hypoallergenic-wedding-bands',
    summary: 'If you have sensitive skin, choosing the right metal for your wedding band is crucial. Learn which metals are safe and comfortable for daily wear.',
    content: 'Metal allergies can turn a symbol of love into a source of discomfort. Fortunately, premium materials like platinum, high-karat gold, and titanium are naturally hypoallergenic. Learn what to look for and how to choose a ring you can wear comfortably every day.',
    cover_image: 'media/blog/6.jpg',
    status: 'published',
    created_at: '2023-02-07T10:00:00Z',
    category_slug: 'wedding-bridal'
  },
  {
    title: 'Guide to Engagement Ring Styles',
    slug: 'guide-to-engagement-ring-styles',
    summary: 'From classic solitaires and vintage halos to modern three-stone designs, we explore the most popular engagement ring styles of the year.',
    content: 'Selecting an engagement ring style is a deeply personal decision. We break down the most popular settings—including solitaire, halo, bezel, three-stone, and pavé—helping you find the design that perfectly matches your partner’s style and story.',
    cover_image: 'media/blog/7.jpg',
    status: 'published',
    created_at: '2023-07-24T12:00:00Z',
    category_slug: 'wedding-bridal'
  }
];

async function ensureBlogData() {
  try {
    const { data: existingCats } = await supabase.from('blog_categories').select('id');
    if (!existingCats || existingCats.length === 0) {
      const { data: insertedCats, error: catError } = await supabase
        .from('blog_categories')
        .insert(DEFAULT_CATEGORIES)
        .select();
      
      if (catError) throw new Error(catError.message);

      const catMap: Record<string, string> = {};
      insertedCats.forEach(cat => {
        catMap[cat.slug] = cat.id;
      });

      const postsToInsert = DEFAULT_POSTS.map(p => {
        const { category_slug, ...postData } = p;
        return {
          ...postData,
          category_id: catMap[category_slug]
        };
      });

      const { error: postError } = await supabase.from('blog_posts').insert(postsToInsert);
      if (postError) throw new Error(postError.message);
      console.log('Seeded blog categories and posts successfully!');
    }
  } catch (err: any) {
    console.error('Error seeding blog data:', err.message);
  }
}

export async function GET(request: Request) {
  try {
    await ensureBlogData();

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const limit = searchParams.get('limit');
    const all = searchParams.get('all') === 'true';

    let query = supabase.from('blog_posts').select('*, blog_categories(*)');
    
    if (!all) {
      query = query.eq('status', 'published');
    }

    if (categorySlug && categorySlug !== 'all') {
      const { data: catData } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();
      
      if (catData) {
        query = query.eq('category_id', catData.id);
      }
    }

    query = query.order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: posts, error } = await query;

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(posts || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// POST /api/blog (Create or Update)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, category_id, title, slug, summary, content, cover_image, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ message: 'Title, slug, and content are required' }, { status: 400 });
    }

    const postData = {
      category_id: category_id || null,
      title,
      slug,
      summary: summary || null,
      content,
      cover_image: cover_image || null,
      status: status || 'draft'
    };

    if (id) {
      // Update
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          ...postData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(data, { status: 200 });
    } else {
      // Create
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }
      return NextResponse.json(data, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// DELETE /api/blog
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Blog Post ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
