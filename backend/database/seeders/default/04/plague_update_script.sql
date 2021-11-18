DROP INDEX IF EXISTS "plague.color_unique";

INSERT INTO public.plague ("name",display_name,color, in_use, relevance_order) VALUES
('trepadeira','Trepadeiras','#FFF73B', true, 1);

INSERT INTO public.plague ("name",display_name,color, in_use, relevance_order) VALUES
('gpa','Gramíneas porte alto','#4DF100', true, 3);

INSERT INTO public.plague ("name",display_name,color, in_use, relevance_order) VALUES
('gpb','Gramíneas porte baixo','#97F7FF', true, 4);

INSERT INTO public.plague ("name",display_name,color, in_use, relevance_order) VALUES
('ofl','Outras folhas largas','#FFBCC8', true, 5);

INSERT INTO public.plague ("name",display_name,color, in_use, relevance_order) VALUES
('indefinida','Daninhas indefinidas','#DE81FF', true, 6);

UPDATE public.plague
SET in_use=false
WHERE "name"='mucuna';

UPDATE public.plague
SET in_use=false
WHERE "name"='grama_seda';

UPDATE public.plague
SET in_use=false
WHERE "name"='outros';


