-- ---------------------------------------------------------------------------
-- Real CTP shoot photos — replace the placeholder artwork in Supabase.
--
-- Run this AFTER the code containing /images/gallery/shoot-*.jpg is deployed
-- (otherwise the live site would point at files that are not on the CDN yet).
--
-- Hero (3) + Poster Wall row A (5) + row B photos (3) + Portfolio grid (10)
-- ---------------------------------------------------------------------------

-- 1. Hero — fanned posters
update gallery_items g set src = v.src, title = v.title, category = v.category
from (values
  ('/images/gallery/shoot-03.jpg','Photoshoot','Portraits'),
  ('/images/gallery/shoot-04.jpg','Candid Laugh','Lifestyle'),
  ('/images/gallery/shoot-09.jpg','Moody Café Frames','Portraits')
) as v(src,title,category)
where g.row_key = 'hero'
  and g.sort_order = case v.src
    when '/images/gallery/shoot-03.jpg' then 1
    when '/images/gallery/shoot-04.jpg' then 2
    else 3 end;

-- 2. Poster wall — row A (pure photo row)
update gallery_items g set src = v.src, title = v.title, category = v.category
from (values
  (1,'/images/gallery/shoot-01.jpg','Café Corner Portrait','Portraits'),
  (2,'/images/gallery/shoot-02.jpg','Low-Light Reading','Lifestyle'),
  (3,'/images/gallery/shoot-03.jpg','Window Light Portrait','Portraits'),
  (4,'/images/gallery/shoot-04.jpg','Candid Laugh','Lifestyle'),
  (5,'/images/gallery/shoot-05.jpg','Pages & Coffee','Lifestyle')
) as v(ord,src,title,category)
where g.row_key = 'wall-a' and g.sort_order = v.ord;

-- 3. Poster wall — row B photo slots (reels keep their video posters)
update gallery_items g set src = v.src, title = v.title, category = v.category
from (values
  (4,'/images/gallery/shoot-08.jpg','Table For One','Portraits'),
  (5,'/images/gallery/shoot-06.jpg','Golden Bokeh Portrait','Portraits'),
  (6,'/images/gallery/shoot-10.jpg','Warm Smile Editorial','Portraits')
) as v(ord,src,title,category)
where g.row_key = 'wall-b' and g.sort_order = v.ord;

-- 4. Portfolio grid — 10 real photos (reels keep their positions)
update gallery_items g set src = v.src, title = v.title, category = v.category
from (values
  (1,'/images/gallery/shoot-01.jpg','Café Corner Portrait','Portraits'),
  (2,'/images/gallery/shoot-02.jpg','Low-Light Reading','Lifestyle'),
  (3,'/images/gallery/shoot-03.jpg','Window Light Portrait','Portraits'),
  (4,'/images/gallery/shoot-04.jpg','Candid Laugh','Lifestyle'),
  (5,'/images/gallery/shoot-05.jpg','Pages & Coffee','Lifestyle'),
  (6,'/images/gallery/shoot-06.jpg','Golden Bokeh Portrait','Portraits'),
  (7,'/images/gallery/shoot-07.jpg','Quiet Mornings','Lifestyle'),
  (8,'/images/gallery/shoot-08.jpg','Table For One','Portraits')
) as v(ord,src,title,category)
where g.row_key = 'gallery' and g.sort_order = v.ord;

-- 5. Two extra portraits + push the three reels to the end
update gallery_items set sort_order = sort_order + 10
where row_key = 'gallery' and type = 'reel';

insert into gallery_items
  (type, title, category, media_type, src, row_key, visible, featured, sort_order, created_at)
values
  ('photo','Moody Café Frames','Portraits','image','/images/gallery/shoot-09.jpg','gallery',true,false,9,now()),
  ('photo','Warm Smile Editorial','Portraits','image','/images/gallery/shoot-10.jpg','gallery',true,false,10,now());
