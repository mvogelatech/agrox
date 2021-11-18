-- populate the company table

with C2 as (
	INSERT INTO public.address (street,city,"number",km,postal_code,complement,neighborhood,phone_number,contact_name,state_id,mobile_number,email) VALUES
	 ('Rod. Comdte Joao Ribeiro de Barros','Pederneiras',0,204,'17280-000','','','+5551999223973','Wendel Alves de Sousa',26,'','direta@diretaaviacao.com.br') returning id
)
INSERT INTO public.company (name,works_with_drone,works_with_plane,works_with_tractor,lat,long,address_id) VALUES
	 ('Direta Aviação Agrícola',false,true,false,-22.304873,-48.778422,(select id from 	C2));


with C4 as (
	INSERT INTO public.address (street,city,"number",km,postal_code,complement,neighborhood,phone_number,contact_name,state_id,mobile_number,email) VALUES
	 ('Rod. Arlindo Bento Romanini','Itápolis',0,4,'14940-000','Caixa Postal 72','','+555133286091','Daniel Martins Thomazin',26,'+5516997726802','dmthomaz@terra.com.br') returning id
)
INSERT INTO public.company (name,works_with_drone,works_with_plane,works_with_tractor,lat,long,address_id) VALUES
	 ('TOM Aviação Agrícola',false,true,false,-21.626791,-48.779912,(select id from C4));


with C1 as (
	INSERT INTO public.address (street,city,"number",km,postal_code,complement,neighborhood,phone_number,contact_name,state_id,mobile_number,email) VALUES
	 ('R. Ulisses Jamil Cury','São José do Rio Preto',810,0,'15092-601','','Distrito Industrial Dr. Ulysses da Silveira Guimaraes','+551733055700', 'Marco Antônio Ranal', 26,'','comercial@grupoagtech.com') returning id
)
INSERT INTO public.company (name,works_with_drone,works_with_plane,works_with_tractor,lat,long,address_id) VALUES
	 ('AGTech agrotecnologia',true,false,false,-20.828882, -49.420522,(select id from C1));


with C3 as (
	INSERT INTO public.address (street,city,"number",km,postal_code,complement,neighborhood,phone_number,contact_name,state_id,mobile_number,email) VALUES
	 ('R. Cezira Giovanoni Moretti','Piracicaba',955,0,'',' 9º Andar ','Santa Rosa Ipes','+555133079777','',26,'+5551999223973','contato@arpacbrasil.com.br') returning id
)
INSERT INTO public.company (name,works_with_drone,works_with_plane,works_with_tractor,lat,long,address_id) VALUES
	 ('Arpac Drones',true,false,false,-22.694752, -47.621626,(select id from C3));


with C5 as (
	INSERT INTO public.address (street,city,"number",km,postal_code,complement,neighborhood,phone_number,contact_name,state_id,mobile_number,email) VALUES
	 ('Rua Catumbi','São Paulo',950,0,'03021-000','Bloco 10 - 2','Brás','+5511987988987','',26,'+5511987988987','comercial@maverickagro.com.br') returning id
)
INSERT INTO public.company (name,works_with_drone,works_with_plane,works_with_tractor,lat,long,address_id) VALUES
	 ('Maverick Agro',true,false,false,-22.225593,-47.380774,(select id from C5));
