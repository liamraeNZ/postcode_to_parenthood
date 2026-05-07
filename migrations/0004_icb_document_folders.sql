-- Map health board records to their R2 folder name under policies/

UPDATE health_boards SET document_folder_name = 'Bath and North East Somerset, Swindon and Wiltshire' WHERE id = 'QOX'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Bedfordshire, Luton and Milton Keynes' WHERE sub_board_code = 'M1J4Y'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Birmingham and Solihull' WHERE id = 'QHL'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Black Country' WHERE id = 'QUA'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Bristol, North Somerset and South Gloucestershire' WHERE id = 'QUY'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Buckinghamshire, Oxfordshire and Berkshire West' WHERE sub_board_code = '10Q'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Cambridgeshire and Peterborough' WHERE sub_board_code = '06H'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Cornwall and the Isles of Scilly' WHERE id = 'QT6'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Coventry and Warwickshire' WHERE id = 'QWU'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Derby and Derbyshire' WHERE id = 'QJ2'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Devon' WHERE id = 'QJK'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Dorset' WHERE id = 'QVV'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Frimley' WHERE sub_board_code = 'D4U1Y'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Gloucestershire' WHERE id = 'QR1'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Hampshire and Isle of Wight' WHERE id = 'QRL'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Herefordshire and Worcestershire' WHERE id = 'QGH'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Hertfordshire and West Essex' WHERE id = 'QM7'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Kent and Medway' WHERE id = 'QKS'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Lancashire and South Cumbria' WHERE id = 'QE1'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Lincolnshire' WHERE id = 'QJM'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Mid and South Essex' WHERE sub_board_code = '99E'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Norfolk and Waveney' WHERE sub_board_code = '06L'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'North Central London' WHERE sub_board_code = '07P'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'North East and North Cumbria' WHERE id = 'QHM'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'North East London' WHERE id = 'QMF'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'North West London' WHERE sub_board_code = '08Y'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Northamptonshire' WHERE id = 'QPM'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Nottingham and Nottinghamshire' WHERE id = 'QT1'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Shropshire, Telford and Wrekin' WHERE id = 'QOC'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Somerset' WHERE id = 'QSL'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'South East London' WHERE id = 'QKK'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'South West London' WHERE id = 'QWE'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'South Yorkshire' WHERE id = 'QF7'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Staffordshire and Stoke-on-Trent' WHERE id = 'QNC'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Suffolk and North East Essex' WHERE sub_board_code = '07K'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Surrey Heartlands' WHERE sub_board_code = '92A'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Sussex' WHERE sub_board_code = '09D'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'West Yorkshire' WHERE id = 'QWO'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Cheshire and Merseyside' WHERE id = 'QYG'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Greater Manchester' WHERE id = 'QOP'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Humber and North Yorkshire' WHERE id = 'QOQ'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Leicester, Leicestershire and Rutland' WHERE id = 'QK1';

-- Scotland (14 Health Boards)
UPDATE health_boards SET document_folder_name = 'Ayrshire and Arran' WHERE id = 'S08000015'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Borders' WHERE id = 'S08000016'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Dumfries and Galloway' WHERE id = 'S08000017'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Fife' WHERE id = 'S08000029'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Forth Valley' WHERE id = 'S08000019'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Grampian' WHERE id = 'S08000020'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Greater Glasgow and Clyde' WHERE id = 'S08000031'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Highland' WHERE id = 'S08000022'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Lanarkshire' WHERE id = 'S08000032'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Lothian' WHERE id = 'S08000024'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Orkney' WHERE id = 'S08000025'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Shetland' WHERE id = 'S08000026'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Tayside' WHERE id = 'S08000030'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Western Isles' WHERE id = 'S08000028';

-- Wales (7 Local Health Boards) — official ONS LHB23CD codes
UPDATE health_boards SET document_folder_name = 'Betsi Cadwaladr' WHERE id = 'W11000023'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Powys' WHERE id = 'W11000024'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Hywel Dda' WHERE id = 'W11000025'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Aneurin Bevan' WHERE id = 'W11000028'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Cardiff and Vale' WHERE id = 'W11000029'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Cwm Taf Morgannwg' WHERE id = 'W11000030'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Swansea Bay' WHERE id = 'W11000031';

-- Northern Ireland (5 HSC Trusts)
UPDATE health_boards SET document_folder_name = 'Belfast' WHERE id = 'N09000003'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Northern' WHERE id = 'N09000004'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'South Eastern' WHERE id = 'N09000005'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Southern' WHERE id = 'N09000006'; --> statement-breakpoint
UPDATE health_boards SET document_folder_name = 'Western' WHERE id = 'N09000007';

CREATE INDEX IF NOT EXISTS health_boards_document_folder_name_idx
  ON health_boards (document_folder_name)
  WHERE document_folder_name IS NOT NULL;
