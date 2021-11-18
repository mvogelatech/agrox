INSERT INTO public.plague ("name",display_name,color, in_use, relevance_order) VALUES
('capins','Capins','#97F7FF', false, 12);

UPDATE public.plague
SET display_name='Trepadeiras', color='#FFF73B', in_use=false, relevance_order=11
WHERE "name"='mucuna';

UPDATE public.plague
SET display_name='Gramas', color='#4DF100', in_use=false, relevance_order=10
WHERE "name"='grama_seda';

UPDATE public.plague
SET color='#FEBDFB', in_use=true, relevance_order=3
WHERE "name"='outros';

UPDATE public.plague
SET color='#FFBA52', in_use=true, relevance_order=2
WHERE "name"='mamona';

UPDATE public.plague
SET in_use=false, relevance_order=7
WHERE "name"='fedegoso';

UPDATE public.plague
SET in_use=false, relevance_order=8
WHERE "name"='coloniao';

UPDATE public.plague
SET in_use=false, relevance_order=9
WHERE "name"='corda_de_viola';



